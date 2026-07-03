import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  MessageSquare,
  Bell,
  Check,
  CheckCircle2,
  Trash2,
  Send,
  LogOut,
  Sparkles,
  Calendar,
  Car,
  Utensils,
  Compass,
  Heart,
  Plus,
  ArrowUpRight,
  Database,
  Wifi,
  ShieldCheck,
  Smartphone,
  CheckSquare,
  AlertCircle
} from "lucide-react";
import { dbService, Booking, Message, ConciergeRequest } from "../lib/supabase";

interface ServicesTeamProps {
  onLogout: () => void;
}

export default function ServicesTeam({ onLogout }: ServicesTeamProps) {
  // --- STATES ---
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<ConciergeRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected client details for messaging / monitoring
  const [selectedBookingCode, setSelectedBookingCode] = useState<string>("");
  const [staffReplyText, setStaffReplyText] = useState("");

  // New Booking Creation Form State
  const [showAddBooking, setShowAddBooking] = useState(false);
  const [newBookingCode, setNewBookingCode] = useState("");
  const [newGuestName, setNewGuestName] = useState("");
  const [newVillaName, setNewVillaName] = useState("Chowrest Villa Azure");
  const [newCheckIn, setNewCheckIn] = useState("2026-07-03");
  const [newCheckOut, setNewCheckOut] = useState("2026-07-10");
  const [newError, setNewError] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load initial data
  const loadData = async () => {
    try {
      const [allBookings, allRequests, allMessages] = await Promise.all([
        dbService.getAllBookings(),
        dbService.getAllRequests(),
        dbService.getAllMessages()
      ]);
      setBookings(allBookings);
      setRequests(allRequests);
      setMessages(allMessages);

      if (allBookings.length > 0 && !selectedBookingCode) {
        setSelectedBookingCode(allBookings[0].booking_code);
      }
    } catch (err) {
      console.error("Error loading services database:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Poll database every 3.5 seconds to pull client actions, chats, and RSVPs in real time
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [allRequests, allMessages] = await Promise.all([
          dbService.getAllRequests(),
          dbService.getAllMessages()
        ]);

        if (JSON.stringify(allRequests) !== JSON.stringify(requests)) {
          setRequests(allRequests);
        }
        if (JSON.stringify(allMessages) !== JSON.stringify(messages)) {
          setMessages(allMessages);
        }
      } catch (err) {
        console.warn("Staff dashboard polling failed:", err);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [requests, messages]);

  // Scroll chat to bottom when selected booking or messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedBookingCode, messages]);

  // Handle send staff message
  const handleSendStaffMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffReplyText.trim() || !selectedBookingCode) return;

    const textToSend = staffReplyText;
    setStaffReplyText("");

    // Optimistic Update
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const tempMsg: Message = {
      id: `temp_staff_${Date.now()}`,
      booking_code: selectedBookingCode,
      sender: "host",
      text: textToSend,
      time: timeStr,
      created_at: now.toISOString()
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const addedMsg = await dbService.addMessage(selectedBookingCode, "host", textToSend);
      setMessages((prev) => prev.map(m => m.id === tempMsg.id ? addedMsg : m));
    } catch (err) {
      console.error("Staff message save error:", err);
    }
  };

  // Confirm/Complete a request
  const handleStatusUpdate = async (reqId: string, bookingCode: string, title: string, newStatus: "pending" | "confirmed" | "completed") => {
    try {
      const success = await dbService.updateRequestStatus(reqId, newStatus);
      if (success) {
        // Update local state
        setRequests((prev) => prev.map(r => r.id === reqId ? { ...r, status: newStatus } : r));

        // Auto-post a message in the chat as the host to notify the client in real-time!
        let notifyText = "";
        if (newStatus === "confirmed") {
          notifyText = `🛎️ Host Update: Your concierge booking "${title}" is now CONFIRMED! Please refer to Stay Essentials or reach out here if you need changes.`;
        } else if (newStatus === "completed") {
          notifyText = `✅ Host Update: Your booking "${title}" has been completed. Enjoy your service!`;
        }

        if (notifyText) {
          await dbService.addMessage(bookingCode, "host", notifyText);
          const latestMsgs = await dbService.getMessages(bookingCode);
          setMessages((prev) => {
            const filtered = prev.filter(m => m.booking_code !== bookingCode);
            return [...filtered, ...latestMsgs].sort((a,b) => a.created_at.localeCompare(b.created_at));
          });
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // Add new Booking
  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewError("");
    
    const code = newBookingCode.trim().toUpperCase();
    const name = newGuestName.trim();
    
    if (!code || !name) {
      setNewError("All fields are required.");
      return;
    }

    // Check if code already exists
    if (bookings.some(b => b.booking_code === code)) {
      setNewError(`Booking code ${code} is already registered.`);
      return;
    }

    try {
      const newBooking = await dbService.createBooking({
        booking_code: code,
        guest_name: name,
        villa_name: newVillaName,
        check_in: newCheckIn,
        check_out: newCheckOut,
        wifi_ssid: newVillaName.includes("Emerald") ? "VillaEmerald_Guest_5G" : newVillaName.includes("Sapphire") ? "VillaSapphire_Guest_5G" : "VillaAzure_Guest_5G",
        wifi_password: "serenity2024",
        gate_code: `#${Math.floor(1000 + Math.random() * 9000)}*`
      });

      setBookings((prev) => [...prev, newBooking]);
      setSelectedBookingCode(newBooking.booking_code);
      
      // Seed a welcome message for the new booking
      await dbService.addMessage(
        newBooking.booking_code,
        "host",
        `Sawasdee krub! Welcome to ${newBooking.villa_name}, ${newBooking.guest_name}. I am Sunny, your dedicated villa concierge. Let me know if you would like me to arrange an airport limousine or premium spa treatment!`
      );

      // Reset form
      setNewBookingCode("");
      setNewGuestName("");
      setShowAddBooking(false);
      
      // Reload messages
      const updatedMessages = await dbService.getAllMessages();
      setMessages(updatedMessages);

    } catch (err) {
      setNewError("Failed to register booking in database.");
    }
  };

  // Filter messages for active chat
  const filteredMessages = messages.filter(m => m.booking_code === selectedBookingCode);
  const activeBooking = bookings.find(b => b.booking_code === selectedBookingCode);

  // Group requests count by status
  const pendingRequestsCount = requests.filter(r => r.status === "pending").length;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-[#1A1A1A] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-bold mt-3 uppercase tracking-wider animate-pulse">Syncing Services Database...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col animate-fadeIn">
      
      {/* HEADER BAR */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-[#1A1A1A] text-white px-6 py-4 rounded-[2rem] shadow-md border border-white/5 mb-4 gap-4">
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-11 h-11 bg-[#2D5A27] rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-inner">
            ST
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black tracking-tight uppercase">Hospitality Service Portal</h1>
              <span className="px-2 py-0.5 bg-emerald-600/20 text-emerald-400 text-[9px] rounded-full font-bold uppercase tracking-widest border border-emerald-500/10">Staff</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider">Chowrest Villa Azure Management Team</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-1.5 text-xs text-gray-300">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="font-bold">Live Stream Sync</span>
          </div>

          <button 
            onClick={onLogout}
            className="px-4 py-2 bg-gray-800 hover:bg-red-950 hover:text-red-300 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all border border-white/5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* PANEL 1: CLIENT GUEST LIST */}
        <section className="lg:col-span-4 bg-white rounded-[2rem] p-6 border border-black/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#2D5A27]" /> Active Guest Villas
              </h3>
              <button 
                onClick={() => setShowAddBooking(true)}
                className="bg-[#2D5A27] hover:bg-[#1a3818] text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> New Check-in
              </button>
            </div>
            <p className="text-[11px] text-gray-500 mb-4 font-semibold">Select a guest villa to answer chats & manage requests</p>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
              {bookings.map((b) => {
                const isActive = b.booking_code === selectedBookingCode;
                const clientLastMsg = messages.filter(m => m.booking_code === b.booking_code).slice(-1)[0];
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBookingCode(b.booking_code)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                      isActive
                        ? "bg-[#E9F0E8] border-[#2D5A27]/25 shadow-sm"
                        : "bg-gray-50/70 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          isActive ? "bg-[#2D5A27] text-white" : "bg-gray-200 text-gray-700"
                        }`}>
                          {b.booking_code}
                        </span>
                        <h4 className="font-bold text-xs text-gray-800 mt-1.5 leading-tight">{b.guest_name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mt-0.5">{b.villa_name}</p>
                      </div>
                      <span className="text-[9px] text-gray-400 font-mono font-bold">
                        Out: {b.check_out}
                      </span>
                    </div>

                    {/* WiFi and PIN stats for staff reference */}
                    <div className="mt-3 pt-2 border-t border-black/[0.04] grid grid-cols-2 text-[8px] font-mono font-semibold text-gray-500">
                      <div className="truncate flex items-center gap-1">
                        <Wifi className="w-2.5 h-2.5 text-gray-400" /> SSID: {b.wifi_ssid}
                      </div>
                      <div className="truncate flex items-center gap-1 justify-end">
                        <ShieldCheck className="w-2.5 h-2.5 text-gray-400" /> PIN: {b.gate_code}
                      </div>
                    </div>

                    {/* Last message preview */}
                    {clientLastMsg && (
                      <div className="mt-2 text-[10px] text-gray-500 italic truncate bg-white/50 px-2 py-1 rounded">
                        <span className="font-bold uppercase tracking-tight mr-1 text-[8px]">
                          {clientLastMsg.sender === "guest" ? "Guest" : "You"}:
                        </span>
                        "{clientLastMsg.text}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-2xl border border-black/[0.02] text-[10px] text-gray-500 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>Registered villas synchronize with Supabase immediately.</span>
          </div>
        </section>

        {/* PANEL 2: SERVICES LIVE CHAT */}
        <section className="lg:col-span-5 bg-[#1A1A1A] text-white rounded-[2rem] p-6 shadow-md flex flex-col justify-between min-h-[420px]">
          {/* Active client header */}
          <div className="pb-3 border-b border-gray-800 flex justify-between items-center mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#2D5A27] rounded-xl flex items-center justify-center font-black text-sm">
                {activeBooking?.booking_code.charAt(0) || "V"}
              </div>
              <div>
                <h3 className="text-xs font-bold">{activeBooking?.guest_name || "Guest Portal"}</h3>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">{activeBooking?.villa_name || "Azure Suite"}</p>
              </div>
            </div>
            
            <span className="px-2.5 py-0.5 bg-gray-800 text-[9px] font-bold text-emerald-400 rounded-full tracking-wider uppercase">
              Client Messenger
            </span>
          </div>

          {/* Messages Logs */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 max-h-[280px] scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-6 text-gray-500">
                <MessageSquare className="w-8 h-8 text-gray-600 mb-2 fill-gray-800/10 animate-pulse" />
                <p className="text-xs font-bold">No chat history with this client yet.</p>
                <p className="text-[10px] mt-1">Send a welcome message below to initiate connection!</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-2.5 ${msg.sender === "host" ? "justify-end animate-fadeInRight" : "justify-start animate-fadeInLeft"}`}
                >
                  {msg.sender === "guest" && (
                    <div className="w-7 h-7 bg-[#2D5A27] rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 border border-white/10 shadow">
                      G
                    </div>
                  )}
                  <div className={`rounded-2xl p-3 max-w-[85%] text-xs shadow-sm ${
                    msg.sender === "host" 
                      ? "bg-gray-800 border border-gray-700/60 text-gray-100 rounded-tr-none" 
                      : "bg-[#2D5A27] text-white rounded-tl-none border border-green-800/20"
                  }`}>
                    <p className="leading-relaxed font-medium break-words">{msg.text}</p>
                    <div className="flex items-center justify-between gap-3 mt-1.5 border-t border-white/5 pt-1 text-[8px] text-gray-400 uppercase tracking-widest font-semibold">
                      <span>{msg.time}</span>
                      {msg.sender === "host" && <span className="text-emerald-400 font-bold">✓ Delivered</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendStaffMessage} className="relative">
            <input 
              type="text" 
              placeholder={`Reply to ${activeBooking?.guest_name || 'Guest'}...`}
              value={staffReplyText}
              onChange={(e) => setStaffReplyText(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-3.5 pl-4 pr-12 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2D5A27] transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-1.5 top-1.5 bg-[#2D5A27] hover:bg-[#1a3818] p-2 rounded-full text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Send reply"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>

        {/* PANEL 3: REQUESTS & SERVICES ACTION CENTER */}
        <section className="lg:col-span-3 bg-white rounded-[2rem] p-6 border border-black/5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-orange-500" /> Client Requests
              </h3>
              {pendingRequestsCount > 0 && (
                <span className="bg-orange-500 text-white font-extrabold text-[8px] px-2 py-0.5 rounded-full animate-bounce">
                  {pendingRequestsCount} Pending
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mb-4 font-semibold">Monitor and action active guest concierge orders</p>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 scrollbar-thin">
              {requests.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic text-center py-10">No active concierge requests.</p>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="bg-gray-50 p-3 rounded-2xl border border-black/[0.02] text-[10px] space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 truncate">
                        {req.category === "car" && <Car className="w-3.5 h-3.5 text-orange-600" />}
                        {req.category === "food" && <Utensils className="w-3.5 h-3.5 text-blue-600" />}
                        {req.category === "trip" && <Compass className="w-3.5 h-3.5 text-purple-600" />}
                        {req.category === "spa" && <Heart className="w-3.5 h-3.5 text-[#2D5A27]" />}
                        <span className="font-bold text-gray-700 truncate">{req.booking_code}</span>
                      </div>
                      <span className={`px-2 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider ${
                        req.status === "confirmed" 
                          ? "bg-emerald-100 text-emerald-800" 
                          : req.status === "completed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800 animate-pulse"
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-bold text-gray-800 leading-tight">{req.title}</h5>
                      <p className="text-gray-400 text-[9px] mt-0.5">{req.detail}</p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-black/[0.03]">
                      <span className="font-bold text-gray-800 bg-gray-200/60 px-1.5 py-0.5 rounded">{req.price}</span>
                      
                      <div className="flex gap-1.5">
                        {req.status === "pending" && (
                          <button
                            onClick={() => handleStatusUpdate(req.id, req.booking_code, req.title, "confirmed")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                            title="Approve request"
                          >
                            <Check className="w-3 h-3" /> Confirm
                          </button>
                        )}
                        {req.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusUpdate(req.id, req.booking_code, req.title, "completed")}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                            title="Complete request"
                          >
                            <CheckSquare className="w-3 h-3" /> Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 text-[9px] text-gray-400 border-t border-gray-150 pt-2 flex justify-between items-center">
            <span>Total Requests: {requests.length}</span>
            <span>Confirmed: {requests.filter(r => r.status === "confirmed").length}</span>
          </div>
        </section>

      </main>

      {/* NEW CHECK-IN SLIDE OVERLAY MODAL */}
      {showAddBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 relative border border-black/5 shadow-2xl animate-scaleUp">
            
            <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">Register New Guest Check-in</h3>
            <p className="text-xs text-gray-500 mb-6 font-medium">Create a booking code dynamically. Guests will immediately be able to check-in using this code on their login screen.</p>
            
            <form onSubmit={handleAddBooking} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400">Guest Name / Family Group</label>
                <input
                  type="text"
                  placeholder="e.g. Mr. & Mrs. Robert Vance"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] rounded-xl py-3 px-4 text-xs text-gray-800 placeholder-gray-400 outline-none transition-all mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Booking Code</label>
                  <input
                    type="text"
                    placeholder="e.g. VILLA-404"
                    value={newBookingCode}
                    onChange={(e) => setNewBookingCode(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] rounded-xl py-3 px-4 text-xs text-gray-800 placeholder-gray-400 uppercase font-mono tracking-wider outline-none transition-all mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Villa Residence</label>
                  <select
                    value={newVillaName}
                    onChange={(e) => setNewVillaName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] rounded-xl py-3 px-3 text-xs font-bold text-gray-800 outline-none transition-all mt-1"
                  >
                    <option value="Chowrest Villa Azure">Villa Azure (Main)</option>
                    <option value="Chowrest Villa Emerald">Villa Emerald</option>
                    <option value="Chowrest Villa Sapphire">Villa Sapphire</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Check-In</label>
                  <input
                    type="date"
                    value={newCheckIn}
                    onChange={(e) => setNewCheckIn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] rounded-xl py-2.5 px-3 text-xs text-gray-800 outline-none transition-all mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Check-Out</label>
                  <input
                    type="date"
                    value={newCheckOut}
                    onChange={(e) => setNewCheckOut(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] rounded-xl py-2.5 px-3 text-xs text-gray-800 outline-none transition-all mt-1"
                  />
                </div>
              </div>

              {newError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex gap-2 border border-red-100 items-center animate-fadeIn">
                  <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                  <span className="font-semibold">{newError}</span>
                </div>
              )}

              <div className="pt-4 flex gap-3 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-[#2D5A27] hover:bg-[#1a3818] text-white rounded-xl text-xs font-bold text-center shadow-md shadow-green-900/10 cursor-pointer"
                >
                  Confirm Registration
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBooking(false)}
                  className="py-3.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center py-4 mt-6 border-t border-black/5">
        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
          Managed by Chowrest Hospitality Group &copy; {new Date().getFullYear()} • Staff Command Panel
        </p>
      </footer>

    </div>
  );
}
