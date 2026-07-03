import React, { useState, useEffect, useRef } from "react";
import {
  Wifi,
  ShieldCheck,
  Copy,
  Check,
  Eye,
  EyeOff,
  Car,
  Utensils,
  Compass,
  Sparkles,
  Calendar,
  ChevronRight,
  Send,
  Info,
  Phone,
  MapPin,
  AlertTriangle,
  Heart,
  User,
  Clock,
  CloudSun,
  ArrowRight,
  Search,
  X,
  ChevronLeft,
  BookOpen,
  CheckCircle2,
  Trash2,
  Plus,
  LogOut,
  Sparkle
} from "lucide-react";
import { dbService, Booking, Message, ConciergeRequest } from "../lib/supabase";

interface GuestPortalProps {
  bookingCode: string;
  onLogout: () => void;
}

interface EventItem {
  id: string;
  day: string;
  title: string;
  time: string;
  desc: string;
  location: string;
  rsvpsCount: number;
}

interface RecommendationItem {
  id: string;
  name: string;
  category: string;
  desc: string;
  phone: string;
  hours: string;
  dressCode: string;
}

export default function GuestPortal({ bookingCode, onLogout }: GuestPortalProps) {
  // --- STATES ---
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Time & Weather
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");

  // Copy/Visibility states
  const [copiedWifiNet, setCopiedWifiNet] = useState(false);
  const [copiedWifiPass, setCopiedWifiPass] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Concierge tab modal
  const [activeTab, setActiveTab] = useState<"car" | "food" | "trip" | "spa" | null>(null);
  
  // Tab local options
  const [selectedCar, setSelectedCar] = useState<string>("SUV (Fortuner)");
  const [carDays, setCarDays] = useState<number>(3);
  const [foodCart, setFoodCart] = useState<{ [key: string]: number }>({
    "Classic Pad Thai": 0,
    "Pineapple Fried Rice": 0,
    "Mango Sticky Rice": 0,
  });
  const [selectedTrip, setSelectedTrip] = useState<string>("Phi Phi Islands Snorkeling");
  const [tripGuests, setTripGuests] = useState<number>(2);
  const [selectedSpa, setSelectedSpa] = useState<string>("Traditional Thai Massage");
  const [spaDuration, setSpaDuration] = useState<number>(60);

  // Database-backed states
  const [bookedServices, setBookedServices] = useState<ConciergeRequest[]>([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [rsvps, setRsvps] = useState<string[]>([]);

  // Local static details
  const [selectedManual, setSelectedManual] = useState<string | null>(null);
  const [selectedRec, setSelectedRec] = useState<RecommendationItem | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([
    {
      id: "rec1",
      name: "Baan Rim Pa",
      category: "Authentic Royal Thai",
      desc: "Spectacular royal Thai dining set on a majestic cliff overlooking the Andaman Sea and Patong Bay. Known for its gorgeous sunset settings.",
      phone: "+66 76 340 789",
      hours: "12:00 PM - 11:00 PM",
      dressCode: "Smart Casual"
    },
    {
      id: "rec2",
      name: "The Catch Club",
      category: "Beachfront Dining",
      desc: "High-end open-air beach club on Bangtao Beach with premium seafood, DJ sets, cabanas, and excellent tropical cocktail selections.",
      phone: "+66 76 314 380",
      hours: "11:00 AM - Midnight",
      dressCode: "Resort Chic"
    }
  ]);

  // Chat Messenger
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Emergency Call
  const [emergencyCall, setEmergencyCall] = useState<{
    isActive: boolean;
    duration: number;
    status: "connecting" | "active" | "ended";
  }>({
    isActive: false,
    duration: 0,
    status: "connecting"
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    async function loadInitialData() {
      try {
        const bookingData = await dbService.getBookingByCode(bookingCode);
        setBooking(bookingData);
        
        if (bookingData) {
          const [messages, requests, userRsvps] = await Promise.all([
            dbService.getMessages(bookingCode),
            dbService.getRequests(bookingCode),
            dbService.getRsvps(bookingCode)
          ]);
          setChatMessages(messages);
          setBookedServices(requests);
          setRsvps(userRsvps);
        }
      } catch (err) {
        console.error("Error loading guest portal data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [bookingCode]);

  // --- REAL-TIME POLLING SYNC ---
  // We set up a lightweight polling mechanism (every 3.5 seconds) to fetch latest messages and concierge request updates
  // from Supabase/Local fallback so they receive responses from the Services Team instantly!
  useEffect(() => {
    if (!booking) return;

    const interval = setInterval(async () => {
      try {
        const [latestMsgs, latestReqs] = await Promise.all([
          dbService.getMessages(bookingCode),
          dbService.getRequests(bookingCode)
        ]);

        // Only update states if they changed to prevent extra React renders
        if (JSON.stringify(latestMsgs) !== JSON.stringify(chatMessages)) {
          setChatMessages(latestMsgs);
        }
        if (JSON.stringify(latestReqs) !== JSON.stringify(bookedServices)) {
          setBookedServices(latestReqs);
        }
      } catch (err) {
        console.warn("Polling fetch failed:", err);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [booking, bookingCode, chatMessages, bookedServices]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Emergency Timer
  useEffect(() => {
    if (emergencyCall.isActive && emergencyCall.status === "active") {
      timerRef.current = setInterval(() => {
        setEmergencyCall((prev) => ({ ...prev, duration: prev.duration + 1 }));
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [emergencyCall.isActive, emergencyCall.status]);

  // Scroll Chat to Bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // --- HANDLERS & HELPERS ---
  const formatPhuketTime = () => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const phuketTime = new Date(utc + 3600000 * 7);
    return phuketTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCopyText = (text: string, setCopied: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const textToSend = chatInput;
    setChatInput("");

    // 1. Optimistic Update locally
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const tempMsg: Message = {
      id: `temp_${Date.now()}`,
      booking_code: bookingCode,
      sender: "guest",
      text: textToSend,
      time: timeStr,
      created_at: now.toISOString()
    };
    setChatMessages((prev) => [...prev, tempMsg]);

    try {
      // 2. Real DB add
      const addedMsg = await dbService.addMessage(bookingCode, "guest", textToSend);
      // Replace optimistic message with DB message
      setChatMessages((prev) => prev.map(m => m.id === tempMsg.id ? addedMsg : m));
    } catch (err) {
      console.error("Failed to save message to database:", err);
    }
  };

  const submitBooking = async () => {
    let title = "";
    let detail = "";
    let price = "";
    
    if (activeTab === "car") {
      title = `${selectedCar} Rental`;
      detail = `${carDays} Days • Delivered to Villa Port`;
      const dailyPrice = selectedCar.includes("Scooter") ? 25 : selectedCar.includes("SUV") ? 120 : 250;
      price = `$${dailyPrice * carDays}`;
    } else if (activeTab === "food") {
      title = "Gourmet Room Delivery";
      const entries = Object.entries(foodCart) as [string, number][];
      const items = entries
        .filter(([_, qty]) => qty > 0)
        .map(([name, qty]) => `${qty}x ${name}`)
        .join(", ");
      
      if (!items) return; 
      detail = items;
      
      const prices: { [key: string]: number } = { "Classic Pad Thai": 12, "Pineapple Fried Rice": 14, "Mango Sticky Rice": 8 };
      const total = entries.reduce((acc, [name, qty]) => acc + (prices[name] * qty), 0);
      price = `$${total}`;
    } else if (activeTab === "trip") {
      title = `Excursion: ${selectedTrip}`;
      detail = `${tripGuests} Guests • Private Guide`;
      const basePrices: { [key: string]: number } = {
        "Phi Phi Islands Snorkeling": 180,
        "Elephant Sanctuary Visit": 95,
        "Sunset Yacht Cruise": 220
      };
      price = `$${(basePrices[selectedTrip] || 100) * tripGuests}`;
    } else if (activeTab === "spa") {
      title = `Spa: ${selectedSpa}`;
      detail = `${spaDuration} Minutes • In-Villa Suite`;
      const basePrices: { [key: string]: number } = {
        "Traditional Thai Massage": 45,
        "Aromatherapy Massage": 60,
        "Coconut Body Scrub": 50
      };
      const scale = spaDuration === 90 ? 1.4 : spaDuration === 120 ? 1.8 : 1;
      price = `$${Math.round((basePrices[selectedSpa] || 50) * scale)}`;
    }

    try {
      const newReq = await dbService.createRequest(bookingCode, activeTab!, title, detail, price);
      setBookedServices((prev) => [newReq, ...prev]);

      // Automatically send a client notification message to the chat so the staff sees it instantly
      await dbService.addMessage(
        bookingCode, 
        "guest", 
        `🛎️ New Concierge Request submitted: "${title}" (${detail}) - Total: ${price}. Please confirm!`
      );
    } catch (err) {
      console.error("Booking submission error:", err);
    }

    // Reset local state
    setFoodCart({ "Classic Pad Thai": 0, "Pineapple Fried Rice": 0, "Mango Sticky Rice": 0 });
    setActiveTab(null);
  };

  const deleteBooking = async (id: string, title: string) => {
    try {
      await dbService.deleteRequest(id);
      setBookedServices((prev) => prev.filter((b) => b.id !== id));
      
      await dbService.addMessage(
        bookingCode, 
        "guest", 
        `❌ Cancelled Request: "${title}"`
      );
    } catch (err) {
      console.error("Cancel booking error:", err);
    }
  };

  const handleRsvpToggle = async (eventId: string, eventTitle: string) => {
    try {
      const isRegistered = rsvps.includes(eventId);
      const latestRsvps = await dbService.toggleRsvp(bookingCode, eventId);
      setRsvps(latestRsvps);

      await dbService.addMessage(
        bookingCode, 
        "guest", 
        isRegistered 
          ? `🙋 Left activity registration list for: "${eventTitle}"`
          : `🙋 Signed up to participate in: "${eventTitle}"!`
      );
    } catch (err) {
      console.error("RSVP toggle failed:", err);
    }
  };

  const handleEmergencyCallStart = () => {
    setEmergencyCall({
      isActive: true,
      duration: 0,
      status: "connecting"
    });
    setTimeout(() => {
      setEmergencyCall((prev) => {
        if (!prev.isActive) return prev;
        return { ...prev, status: "active" };
      });
    }, 1500);
  };

  const handleAddCustomRec = () => {
    const spot: RecommendationItem = {
      id: `rec_${Date.now()}`,
      name: "Old Phuket Town Cafe",
      category: "Artisanal Coffee & Bakery",
      desc: "Charming cafe inside a beautifully preserved Sino-Portuguese shophouse. Handcrafted cold brews, fresh coconut tarts, and local desserts.",
      phone: "+66 81 542 900",
      hours: "8:00 AM - 6:00 PM",
      dressCode: "Casual"
    };
    if (!recommendations.some(r => r.name === spot.name)) {
      setRecommendations(prev => [...prev, spot]);
    }
  };

  const events: EventItem[] = [
    {
      id: "ev1",
      day: "MON",
      title: "Muay Thai Night",
      time: "19:00",
      desc: "Exciting traditional Muay Thai showcase fights at Bangla Stadium. transport leaves from front gate at 18:30.",
      location: "Bangla Stadium",
      rsvpsCount: 4
    },
    {
      id: "ev2",
      day: "TUE",
      title: "Thai Cooking Class",
      time: "11:00",
      desc: "Learn secrets of Thai spices. Cook Pad Thai, Green Curry and Mango Sticky Rice with chef.",
      location: "Villa Kitchen Garden",
      rsvpsCount: 2
    },
    {
      id: "ev3",
      day: "WED",
      title: "Group Diving Trip",
      time: "08:30",
      desc: "PADI certified day trip to Racha Yai island coral fields with professional safety guides.",
      location: "Chalong Pier Departs",
      rsvpsCount: 6
    },
    {
      id: "ev4",
      day: "THU",
      title: "Paddleboarding",
      time: "16:00",
      desc: "Sunset standup paddleboard tour of Lagoon. Fresh beach coconuts served at completion.",
      location: "Bangtao Lagoon Club",
      rsvpsCount: 3
    }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-[#2D5A27] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-bold mt-3 uppercase tracking-wider animate-pulse">Syncing Portal with Supabase...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-2" />
        <p className="text-sm font-bold text-gray-800">Booking Session Expired or Not Found</p>
        <button onClick={onLogout} className="mt-4 text-xs font-bold bg-[#2D5A27] text-white px-4 py-2 rounded-xl">
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col animate-fadeIn">
      
      {/* HEADER WIDGET */}
      <header className="flex flex-col md:flex-row justify-between items-center bg-white px-6 py-4 rounded-[2rem] shadow-sm border border-black/5 mb-4 gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-12 h-12 bg-[#2D5A27] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
            C
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-[#1A1A1A] flex items-center gap-2">
              {booking.villa_name.toUpperCase()}
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Sparkle className="w-3.5 h-3.5 text-[#2D5A27] fill-[#2D5A27]/25" /> 
              <span>Guest Portal • Booking {booking.booking_code}</span>
            </p>
          </div>
        </div>

        {/* Action and Clock */}
        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
          <div className="text-left md:text-right">
            <div className="flex items-center gap-2 md:justify-end">
              <MapPin className="w-3.5 h-3.5 text-[#2D5A27]" />
              <p className="text-sm font-bold">Phuket, Thailand</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>{tempUnit === "C" ? "29°C" : "84°F"}</span>
              <span> • </span>
              <span className="font-mono text-gray-500 font-semibold">{formatPhuketTime()}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={onLogout}
              className="px-3.5 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer border border-black/5"
              title="Sign out of portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Check-out Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* BENTO GRID MAIN */}
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 auto-rows-auto">
        
        {/* WIDGET A: Welcome Box */}
        <section className="lg:col-span-5 bg-[#E9F0E8] rounded-[2rem] p-6 border border-[#2D5A27]/10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 -mr-12 -mt-12 w-48 h-48 bg-[#2D5A27]/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-[#2D5A27] text-white text-[10px] rounded-full font-bold uppercase tracking-wider mb-3 inline-block shadow-sm">
                Stay Essentials
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight mt-2 text-[#1c3819]">
              Welcome Home, <br />
              <span className="text-[#2D5A27] font-black">{booking.guest_name}</span>
            </h2>
            
            <p className="text-xs text-gray-500 font-semibold mt-3 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              Stay: {booking.check_in} to {booking.check_out}
            </p>
          </div>

          <div className="space-y-3 relative z-10">
            {/* Wi-Fi */}
            <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-4 border border-[#2D5A27]/5 hover:bg-white/95 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] text-[#2D5A27] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Wifi className="w-3.5 h-3.5" /> High-Speed Wi-Fi
                </p>
                <span className="text-[9px] bg-green-100 text-[#2D5A27] font-bold px-1.5 py-0.5 rounded">Fiber 500M</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">SSID</p>
                  <p className="font-mono text-sm font-bold truncate">{booking.wifi_ssid}</p>
                </div>
                <button 
                  onClick={() => handleCopyText(booking.wifi_ssid, setCopiedWifiNet)}
                  className="bg-gray-100 hover:bg-[#2D5A27]/15 p-2 rounded-xl transition-all cursor-pointer text-gray-600 hover:text-[#2D5A27]"
                  title="Copy Wi-Fi SSID"
                >
                  {copiedWifiNet ? <Check className="w-4 h-4 text-[#2D5A27]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-between items-center gap-2 mt-2 pt-2 border-t border-black/[0.03]">
                <div className="flex-1">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Password</p>
                  <p className="font-mono text-sm font-bold">{booking.wifi_password}</p>
                </div>
                <button 
                  onClick={() => handleCopyText(booking.wifi_password, setCopiedWifiPass)}
                  className="bg-gray-100 hover:bg-[#2D5A27]/15 p-2 rounded-xl transition-all cursor-pointer text-gray-600 hover:text-[#2D5A27]"
                  title="Copy Wi-Fi Password"
                >
                  {copiedWifiPass ? <Check className="w-4 h-4 text-[#2D5A27]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Codes */}
            <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-4 border border-[#2D5A27]/5 hover:bg-white/95 transition-all duration-300">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] text-[#2D5A27] font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Security Codes
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">Main Gate PIN</p>
                  <p className="font-mono text-base font-bold tracking-widest text-gray-800">
                    {showPin ? booking.gate_code : "•••••••"}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button 
                    onClick={() => setShowPin(!showPin)}
                    className="bg-gray-100 p-2 rounded-xl text-gray-500 hover:bg-gray-200 transition-all cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => handleCopyText(booking.gate_code, setCopiedCode)}
                    className="bg-gray-100 hover:bg-[#2D5A27]/15 p-2 rounded-xl transition-all cursor-pointer text-gray-600 hover:text-[#2D5A27]"
                    title="Copy Gate Code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-[#2D5A27]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WIDGET B: Concierge */}
        <section className="lg:col-span-4 bg-white rounded-[2rem] p-6 border border-black/5 shadow-sm flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute right-0 bottom-0 -mb-10 -mr-10 w-32 h-32 bg-[#2D5A27]/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Concierge Services</h3>
            <p className="text-[11px] text-gray-500 mb-4 font-medium">Book directly with our 5-star villa hospitality team</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setActiveTab("car")}
                className="bg-orange-50/70 hover:bg-orange-50 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-orange-100/20 hover:scale-[1.02] transition-all cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 bg-orange-100 rounded-full mb-3 flex items-center justify-center shadow-inner">
                  <Car className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-xs font-bold text-gray-800">Car Rental</p>
                <p className="text-[9px] text-gray-400 mt-0.5">Scooters & SUVs</p>
              </button>

              <button 
                onClick={() => setActiveTab("food")}
                className="bg-blue-50/70 hover:bg-blue-50 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-blue-100/20 hover:scale-[1.02] transition-all cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full mb-3 flex items-center justify-center shadow-inner">
                  <Utensils className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs font-bold text-gray-800">Food Delivery</p>
                <p className="text-[9px] text-gray-400 mt-0.5">In-Villa Dining</p>
              </button>

              <button 
                onClick={() => setActiveTab("trip")}
                className="bg-purple-50/70 hover:bg-purple-50 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-purple-100/20 hover:scale-[1.02] transition-all cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-full mb-3 flex items-center justify-center shadow-inner">
                  <Compass className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs font-bold text-gray-800">Trip Booking</p>
                <p className="text-[9px] text-gray-400 mt-0.5">Custom Excursions</p>
              </button>

              <button 
                onClick={() => setActiveTab("spa")}
                className="bg-green-50/70 hover:bg-green-50 rounded-2xl p-4 flex flex-col justify-center items-center text-center border border-green-100/20 hover:scale-[1.02] transition-all cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full mb-3 flex items-center justify-center shadow-inner">
                  <Heart className="w-5 h-5 text-[#2D5A27]" />
                </div>
                <p className="text-xs font-bold text-gray-800">Spa & Massage</p>
                <p className="text-[9px] text-gray-400 mt-0.5">Therapist In-Villa</p>
              </button>
            </div>
          </div>

          {/* Active Reservations */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Requested Bookings</h4>
            <div className="max-h-[105px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              {bookedServices.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic">No concierge services requested yet.</p>
              ) : (
                bookedServices.map((req) => (
                  <div key={req.id} className="flex items-center justify-between bg-gray-50/80 px-2.5 py-2 rounded-xl text-[10px] border border-black/[0.02] hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 truncate">
                      {req.category === "car" && <Car className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />}
                      {req.category === "food" && <Utensils className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                      {req.category === "trip" && <Compass className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />}
                      {req.category === "spa" && <Heart className="w-3.5 h-3.5 text-[#2D5A27] flex-shrink-0" />}
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-gray-800 truncate">{req.title}</p>
                          <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider ${
                            req.status === "confirmed" 
                              ? "bg-emerald-100 text-emerald-800" 
                              : req.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {req.status}
                          </span>
                        </div>
                        <p className="text-gray-400 truncate text-[9px]">{req.detail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="font-bold text-gray-700 bg-gray-200/50 px-1.5 py-0.5 rounded">{req.price}</span>
                      {req.status === "pending" && (
                        <button 
                          onClick={() => deleteBooking(req.id, req.title)}
                          className="text-gray-400 hover:text-red-500 cursor-pointer p-1"
                          title="Cancel pending request"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* WIDGET C: Weekly Schedule */}
        <section className="lg:col-span-3 bg-white rounded-[2rem] p-6 border border-black/5 shadow-sm flex flex-col justify-between group">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Weekly Schedule</h3>
              <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded-full">Activities</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-4 font-medium font-sans">Toggle attendance. Auto-registers under your villa.</p>
            
            <div className="space-y-3 flex-1">
              {events.map((event) => {
                const isRsvped = rsvps.includes(event.id);
                return (
                  <div 
                    key={event.id} 
                    className={`flex gap-3 items-center border-b border-gray-50 pb-2.5 cursor-pointer hover:bg-gray-50/50 p-1.5 rounded-xl transition-all ${isRsvped ? 'bg-green-50/30 border-l-2 border-l-[#2D5A27] pl-2' : ''}`}
                    onClick={() => handleRsvpToggle(event.id, event.title)}
                    title="Toggle Attendance Registration"
                  >
                    <div className={`font-bold text-[10px] w-12 text-center py-1.5 rounded-lg flex-shrink-0 transition-colors ${
                      isRsvped 
                        ? 'bg-[#2D5A27] text-white shadow-sm shadow-green-900/10' 
                        : event.day === "MON" 
                        ? "bg-red-50 text-red-600" 
                        : event.day === "WED" 
                        ? "bg-blue-50 text-blue-600" 
                        : "bg-gray-50 text-gray-500"
                    }`}>
                      {event.day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{event.title}</p>
                      <p className="text-[9px] text-gray-400 font-medium">{event.time} • {event.location}</p>
                    </div>
                    <div>
                      {isRsvped ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-[#2D5A27]" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-300 hover:text-gray-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 bg-[#2D5A27] text-white p-3 rounded-2xl text-center text-xs font-bold shadow-md shadow-green-900/15 flex items-center justify-center gap-1.5">
            <Calendar className="w-4 h-4" /> Guest RSVP Count ({rsvps.length})
          </div>
        </section>

        {/* WIDGET D: Host Messaging */}
        <section className="lg:col-span-4 bg-[#1A1A1A] text-white rounded-[2rem] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[350px] group">
          <div className="absolute left-0 top-0 -mt-10 -ml-10 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

          <div className="flex justify-between items-center pb-3 border-b border-gray-850 mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-[#2D5A27] rounded-full flex items-center justify-center text-white font-bold text-sm border border-white/10 shadow-sm">
                  S
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#1a1a1a] rounded-full"></span>
              </div>
              <div>
                <h3 className="text-xs font-bold tracking-wide">Sunny (Host)</h3>
                <p className="text-[9px] text-gray-500 font-medium">Online • Villa Manager</p>
              </div>
            </div>
            
            <span className="px-2.5 py-0.5 bg-gray-800 text-[9px] font-bold text-gray-400 rounded-full tracking-wider uppercase">
              Host Chat
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1 max-h-[220px] scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
            {chatMessages.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center p-4">
                <Sparkle className="w-8 h-8 text-gray-600 mb-2 fill-gray-800/10" />
                <p className="text-xs font-bold text-gray-400">Start a chat with Host Sunny!</p>
                <p className="text-[10px] text-gray-500 mt-1">Ask questions about keys, checkout or dinner reservations.</p>
              </div>
            ) : (
              chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-2.5 ${msg.sender === "guest" ? "justify-end animate-fadeInRight" : "justify-start animate-fadeInLeft"}`}
                >
                  {msg.sender === "host" && (
                    <div className="w-7 h-7 bg-gray-800 text-gray-300 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 border border-gray-700/50">
                      S
                    </div>
                  )}
                  <div className={`rounded-2xl p-3 max-w-[85%] text-xs shadow-sm ${
                    msg.sender === "guest" 
                      ? "bg-[#2D5A27] text-white rounded-tr-none border border-green-800/20" 
                      : "bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700/55"
                  }`}>
                    <p className="leading-relaxed font-medium break-words">{msg.text}</p>
                    <div className="flex items-center justify-between gap-2 mt-1.5 border-t border-white/5 pt-1 text-[8px] text-gray-400 uppercase tracking-widest font-semibold">
                      <span>{msg.time}</span>
                      {msg.sender === "guest" && <span className="text-[#99F6E4]">✓ Sent</span>}
                    </div>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex gap-2.5 justify-start items-center">
                <div className="w-7 h-7 bg-gray-800 text-gray-300 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 animate-pulse">
                  S
                </div>
                <div className="bg-gray-800 border border-gray-700/55 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-1 bg-opacity-70">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleSendChat} className="relative mt-auto">
            <input 
              type="text" 
              placeholder="Message your Host Sunny..." 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-full py-3.5 pl-4 pr-12 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#2D5A27] focus:border-[#2D5A27] transition-all"
            />
            <button 
              type="submit" 
              className="absolute right-1.5 top-1.5 bg-[#2D5A27] hover:bg-[#1a3818] p-2 rounded-full text-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Send Message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </section>

        {/* WIDGET E: Manuals & Recommendations */}
        <section className="lg:col-span-5 bg-white rounded-[2rem] p-6 border border-black/5 shadow-sm flex flex-col justify-between group">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Manuals & Recommendations</h3>
              <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2.5 py-0.5 rounded-full">Guidebook</span>
            </div>
            <p className="text-[11px] text-gray-500 mb-4 font-semibold">Gourmet manuals and host recommendations</p>

            <div className="grid grid-cols-2 gap-4">
              {/* House Manuals */}
              <div>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2D5A27]" /> House Manuals
                </h4>
                <div className="space-y-2">
                  <div 
                    onClick={() => setSelectedManual("kitchen")}
                    className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-sm hover:border-gray-200"
                  >
                    <p className="text-xs font-bold text-gray-800">Kitchen Appliances</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-medium">Induction hob, Coffee maker</p>
                  </div>
                  <div 
                    onClick={() => setSelectedManual("ac")}
                    className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-sm hover:border-gray-200"
                  >
                    <p className="text-xs font-bold text-gray-800">AC & Smart Home</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-medium">Climate controls, Sonos</p>
                  </div>
                  <div 
                    onClick={() => setSelectedManual("pool")}
                    className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all cursor-pointer shadow-sm hover:border-gray-200"
                  >
                    <p className="text-xs font-bold text-gray-800">Pool & Terrace</p>
                    <p className="text-[9px] text-gray-400 mt-0.5 font-medium">BBQ pit, filtration guide</p>
                  </div>
                </div>
              </div>

              {/* Local Spots */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-500" /> Local Spots
                  </h4>
                  <button 
                    onClick={handleAddCustomRec}
                    className="text-[9px] text-[#2D5A27] hover:underline font-bold cursor-pointer"
                  >
                    + More
                  </button>
                </div>
                
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id} 
                      onClick={() => setSelectedRec(rec)}
                      className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-100"
                    >
                      <div className="w-10 h-10 bg-[#E9F0E8] rounded-xl flex items-center justify-center text-[#2D5A27] font-extrabold text-sm flex-shrink-0 shadow-sm">
                        {rec.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">{rec.name}</p>
                        <p className="text-[9px] text-gray-500 font-semibold truncate">{rec.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-gray-400 bg-gray-50 p-2.5 rounded-xl border border-black/[0.02] flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-[#2D5A27] flex-shrink-0" />
            <span>Need localized coordinates or airport transport? Message Sunny in chat.</span>
          </div>
        </section>

        {/* WIDGET F: Safety */}
        <section className="lg:col-span-3 bg-[#FDF2F2] rounded-[2rem] p-6 border border-red-100 flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute right-0 top-0 -mr-8 -mt-8 w-24 h-24 bg-red-100/40 rounded-full blur-2xl pointer-events-none"></div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Safety Support
              </h3>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </div>
            <p className="text-[10px] text-red-700/70 mb-4 font-semibold">Immediate safety and medical dialers</p>

            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/40 p-2.5 rounded-xl hover:bg-white/60 transition-colors">
                <div className="w-2.5 h-2.5 bg-red-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Local Hospital</p>
                  <p className="text-sm font-bold tracking-tight text-gray-800 font-mono">+66 76 210 935</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/40 p-2.5 rounded-xl hover:bg-white/60 transition-colors">
                <div className="w-2.5 h-2.5 bg-red-600 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Tourist Police</p>
                  <p className="text-sm font-bold tracking-tight text-gray-800 font-mono">1155</p>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleEmergencyCallStart}
            className="w-full mt-4 p-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-center text-xs font-bold shadow-lg shadow-red-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
          >
            <Phone className="w-4 h-4" /> Call Emergency Desk
          </button>
        </section>

      </main>

      {/* MODAL OVERLAYS */}
      
      {/* 1. CONCIERGE BOOKING SLIDE-IN MODALS */}
      {activeTab && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] w-full max-w-lg p-6 relative border border-black/5 shadow-2xl animate-scaleUp">
            
            <button 
              onClick={() => setActiveTab(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {activeTab === "car" && (
              <div>
                <span className="bg-orange-100 text-orange-700 text-[10px] uppercase font-bold px-3 py-1 rounded-full">Car & Scooter Rental</span>
                <h3 className="text-xl font-bold text-gray-800 mt-2">Rent a Vehicle</h3>
                <p className="text-xs text-gray-500 mt-1">Explore Phuket island with fully insured vehicles delivered directly to the villa.</p>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Select Vehicle Model</label>
                    <select 
                      value={selectedCar} 
                      onChange={(e) => setSelectedCar(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-800 mt-1.5 focus:outline-none"
                    >
                      <option value="Scooter (Honda Click 125i) - $25/day">Scooter (Honda Click 125i) • $25/day</option>
                      <option value="Scooter (Vespa Sprint 150) - $35/day">Scooter (Vespa Sprint 150) • $35/day</option>
                      <option value="SUV (Toyota Fortuner) - $120/day">SUV (Toyota Fortuner) • $120/day</option>
                      <option value="Convertible (Porsche Boxster) - $250/day">Convertible (Porsche Boxster) • $250/day</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Rental Duration</label>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button 
                        onClick={() => setCarDays(d => Math.max(1, d - 1))}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-10 h-10 rounded-xl font-bold transition-all cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-base text-gray-800 w-16 text-center">{carDays} Days</span>
                      <button 
                        onClick={() => setCarDays(d => d + 1)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-10 h-10 rounded-xl font-bold transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "food" && (
              <div>
                <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-3 py-1 rounded-full">Gourmet Food Delivery</span>
                <h3 className="text-xl font-bold text-gray-800 mt-2">Order In-Villa Room Service</h3>
                <p className="text-xs text-gray-500 mt-1">Five-star local delicacies prepared fresh by our private chefs and brought to your table.</p>
                
                <div className="mt-4 space-y-4">
                  {(Object.entries(foodCart) as [string, number][]).map(([name, count]) => {
                    const price = name === "Classic Pad Thai" ? 12 : name === "Pineapple Fried Rice" ? 14 : 8;
                    return (
                      <div key={name} className="flex justify-between items-center border-b border-gray-50 pb-2">
                        <div>
                          <p className="text-xs font-bold text-gray-800">{name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">${price} • Freshly prepared</p>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button 
                            onClick={() => setFoodCart(prev => ({ ...prev, [name]: Math.max(0, count - 1) }))}
                            className="bg-gray-50 hover:bg-gray-100 text-gray-600 w-7 h-7 rounded-lg font-bold transition-all text-xs"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-bold text-gray-800 w-5 text-center">{count}</span>
                          <button 
                            onClick={() => setFoodCart(prev => ({ ...prev, [name]: count + 1 }))}
                            className="bg-gray-50 hover:bg-gray-100 text-gray-600 w-7 h-7 rounded-lg font-bold transition-all text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "trip" && (
              <div>
                <span className="bg-purple-100 text-purple-700 text-[10px] uppercase font-bold px-3 py-1 rounded-full">Island Excursions</span>
                <h3 className="text-xl font-bold text-gray-800 mt-2">Book a Premium Excursion</h3>
                <p className="text-xs text-gray-500 mt-1">Curated luxury day trips with certified safety guides and private speedboats.</p>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Excursion Choice</label>
                    <select 
                      value={selectedTrip} 
                      onChange={(e) => setSelectedTrip(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-800 mt-1.5 focus:outline-none"
                    >
                      <option value="Phi Phi Islands Snorkeling">Phi Phi Islands Speedboat • $180/guest</option>
                      <option value="Elephant Sanctuary Visit">Elephant Sanctuary Visit • $95/guest</option>
                      <option value="Sunset Yacht Cruise">Sunset Catamaran Cruise • $220/guest</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Total Guests</label>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button 
                        onClick={() => setTripGuests(g => Math.max(1, g - 1))}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-10 h-10 rounded-xl font-bold transition-all cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-bold text-base text-gray-800 w-16 text-center">{tripGuests} Guests</span>
                      <button 
                        onClick={() => setTripGuests(g => g + 1)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-10 h-10 rounded-xl font-bold transition-all cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "spa" && (
              <div>
                <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-3 py-1 rounded-full">In-Villa Wellness Spa</span>
                <h3 className="text-xl font-bold text-gray-800 mt-2">Book In-Villa Massage Session</h3>
                <p className="text-xs text-gray-500 mt-1">Professional registered therapists will bring massage beds & aromatic essential oils to your private suite.</p>
                
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Treatment Type</label>
                    <select 
                      value={selectedSpa} 
                      onChange={(e) => setSelectedSpa(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-800 mt-1.5 focus:outline-none"
                    >
                      <option value="Traditional Thai Massage">Traditional Thai Massage • $45/hr</option>
                      <option value="Aromatherapy Massage">Aromatherapy Oil Massage • $60/hr</option>
                      <option value="Coconut Body Scrub">Coconut Body Scrub & Polish • $50/hr</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Session Duration</label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      <button 
                        type="button"
                        onClick={() => setSpaDuration(60)}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${spaDuration === 60 ? "bg-[#2D5A27] text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        60 Min
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSpaDuration(90)}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${spaDuration === 90 ? "bg-[#2D5A27] text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        90 Min
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSpaDuration(120)}
                        className={`py-2 text-xs font-bold rounded-xl transition-all ${spaDuration === 120 ? "bg-[#2D5A27] text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        120 Min
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div className="mt-6 flex gap-3 pt-4 border-t border-gray-100">
              <button 
                onClick={submitBooking}
                className="flex-1 py-3.5 bg-[#2D5A27] hover:bg-[#1a3818] text-white rounded-xl text-xs font-bold text-center shadow-md shadow-green-900/10 cursor-pointer"
              >
                Send Request to Host
              </button>
              <button 
                onClick={() => setActiveTab(null)}
                className="py-3.5 px-5 bg-gray-100 text-gray-500 rounded-xl text-xs font-bold hover:bg-gray-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. HOUSE MANUALS VIEW MODAL */}
      {selectedManual && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 relative border border-black/5 shadow-2xl animate-scaleUp">
            
            <button 
              onClick={() => setSelectedManual(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {selectedManual === "kitchen" && (
              <div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">House Guide</span>
                <h3 className="text-lg font-bold text-gray-800 mt-2">Kitchen Appliances</h3>
                <div className="mt-4 space-y-3 text-xs text-gray-600 leading-relaxed">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="font-bold text-gray-800">☕ Nespresso Espresso Machine</p>
                    <p className="mt-1">Fill the back canister with mineral water. Insert your chosen pod, lock the handle, and press the single or double cup button. Coffee capsules are restocked daily.</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="font-bold text-gray-800">🍳 Induction Cooking Hob</p>
                    <p className="mt-1">Turn on the main power button. Place an induction-compatible pan on the heat ring, then tap + to change the power level. Safe-lock turns on automatically if no pan is detected.</p>
                  </div>
                </div>
              </div>
            )}

            {selectedManual === "ac" && (
              <div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">House Guide</span>
                <h3 className="text-lg font-bold text-gray-800 mt-2">AC & Climate Smart controls</h3>
                <div className="mt-4 space-y-3 text-xs text-gray-600 leading-relaxed">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="font-bold text-gray-800">❄️ Daikin Air Conditioning</p>
                    <p className="mt-1">To preserve energy and protect our environment, air conditioning units will automatically shut off if the sliding patio glass doors remain open for more than 3 minutes.</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="font-bold text-gray-800">🎵 Sonos Multi-Room Soundbar</p>
                    <p className="mt-1">Connect your iPhone or Android to the "VillaAzure_Guest_5G" network and search for AirPlay or Spotify Connect speakers to broadcast audio directly.</p>
                  </div>
                </div>
              </div>
            )}

            {selectedManual === "pool" && (
              <div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase">House Guide</span>
                <h3 className="text-lg font-bold text-gray-800 mt-2">Infinity Pool & Sun Terrace</h3>
                <div className="mt-4 space-y-3 text-xs text-gray-600 leading-relaxed">
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="font-bold text-gray-800">🏊‍♂️ Pool Filtration Schedule</p>
                    <p className="mt-1">The eco-filtration pumps run automatically from 08:00 AM until 07:00 PM. No glass drinkware is allowed in or around the pool under any circumstances; please use plastic tumblers.</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="font-bold text-gray-800">🍖 Gas Barbecue Setup</p>
                    <p className="mt-1">Open the under-cabinet valve on the propane cylinder. Turn the burner knobs to maximum and press the igniter. Always shut off both cylinder and burner controls when finished.</p>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={() => setSelectedManual(null)}
              className="w-full mt-5 py-3 bg-[#2D5A27] text-white rounded-xl text-xs font-bold transition-all"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}

      {/* 3. RECOMMENDATIONS VIEW MODAL */}
      {selectedRec && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 relative border border-black/5 shadow-2xl animate-scaleUp">
            
            <button 
              onClick={() => setSelectedRec(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="bg-[#E9F0E8] text-[#2D5A27] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{selectedRec.category}</span>
              <h3 className="text-xl font-bold text-gray-800 mt-2.5">{selectedRec.name}</h3>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-black/[0.01]">
                "{selectedRec.desc}"
              </p>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-semibold">Opening Hours</span>
                  <span className="font-bold text-gray-700">{selectedRec.hours}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 font-semibold">Dress Code</span>
                  <span className="font-bold text-gray-700">{selectedRec.dressCode}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400 font-semibold">Reservations Phone</span>
                  <span className="font-mono font-bold text-[#2D5A27]">{selectedRec.phone}</span>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => {
                    setSelectedRec(null);
                    setChatInput(`Hi Sunny! Can you help make a dining reservation at ${selectedRec.name} for tomorrow?`);
                  }}
                  className="flex-1 py-3 text-xs font-bold text-white bg-[#2D5A27] hover:bg-[#1a3818] rounded-xl transition-all cursor-pointer text-center"
                >
                  Ask Host To Book
                </button>
                <button 
                  onClick={() => setSelectedRec(null)}
                  className="py-3 px-5 text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. EMERGENCY HOTLINE DIALER MODAL */}
      {emergencyCall.isActive && (
        <div className="fixed inset-0 bg-[#741515]/95 backdrop-blur-lg z-50 flex flex-col items-center justify-center text-white p-6 animate-fadeIn">
          <div className="w-full max-w-sm flex flex-col items-center justify-between h-[450px]">
            
            <div className="text-center animate-pulse">
              <span className="px-3 py-1 bg-red-800 text-red-200 text-[10px] rounded-full font-bold uppercase tracking-widest inline-block">
                Hotline Dialer
              </span>
              <h2 className="text-2xl font-black mt-4 tracking-tight">Villa Azure Emergency Desk</h2>
              <p className="text-xs text-red-200/70 mt-1">Direct Satellite Connection</p>
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center my-6">
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
              <div className="absolute inset-4 bg-red-500/30 rounded-full animate-ping delay-300"></div>
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-2xl relative z-10 border border-red-500/30">
                <Phone className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>

            <div className="text-center w-full">
              {emergencyCall.status === "connecting" ? (
                <p className="text-sm font-semibold tracking-wider text-red-100 animate-pulse">DIALING SECURE LINE...</p>
              ) : (
                <div>
                  <p className="text-base font-bold tracking-widest text-emerald-300 flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span> SECURED LINE ACTIVE
                  </p>
                  <p className="text-3xl font-mono font-bold mt-1.5">
                    {Math.floor(emergencyCall.duration / 60).toString().padStart(2, "0")}:
                    {(emergencyCall.duration % 60).toString().padStart(2, "0")}
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={() => {
                setEmergencyCall({ isActive: false, duration: 0, status: "connecting" });
              }}
              className="w-16 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer mt-4"
              title="Hang up Emergency call"
            >
              <Phone className="w-6 h-6 rotate-135" />
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center py-4 mt-6 border-t border-black/5">
        <p className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold">
          Managed by Chowrest Hospitality Group &copy; {new Date().getFullYear()} • Dynamic Bento Grid 
        </p>
      </footer>

    </div>
  );
}
