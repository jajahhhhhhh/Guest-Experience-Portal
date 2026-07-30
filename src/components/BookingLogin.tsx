import React, { useState } from "react";
import { Key, DoorOpen, Lock, Sparkles, AlertCircle, Database, ChevronRight, UserCheck, Car } from "lucide-react";
import { dbService } from "../lib/supabase";

const REAL_AIRBNB_LISTINGS = [
  { code: "1684861076010173478", name: "Chowrest Sanctuary Villa", guest: "Marcus Aurelius" },
  { code: "1686708815346599245", name: "Chowrest Ocean Oasis", guest: "Serena Williams" },
  { code: "1716892251918662152", name: "Chowrest Horizon Haven", guest: "Alexander Wright" },
  { code: "1716905792921069157", name: "Chowrest Palm Retreat", guest: "Sophia Loren" },
  { code: "1716861874617626825", name: "Chowrest Jungle Canopy", guest: "Liam Neeson" },
  { code: "1717026260606862074", name: "Chowrest Serenity Suites", guest: "Grace Kelly" },
  { code: "1685591049457780061", name: "Chowrest Cliffside Manor", guest: "James Bond" },
  { code: "1685608943348499808", name: "Chowrest Sunset Crest", guest: "Audrey Hepburn" }
];

interface BookingLoginProps {
  onLoginSuccess: (type: "guest" | "staff", bookingCode?: string) => void;
}

export default function BookingLogin({ onLoginSuccess }: BookingLoginProps) {
  const [activePortal, setActivePortal] = useState<"guest" | "staff">("guest");
  
  // Guest fields
  const [bookingCode, setBookingCode] = useState("");
  const [guestError, setGuestError] = useState("");
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  // Staff fields
  const [staffCode, setStaffCode] = useState("");
  const [staffError, setStaffError] = useState("");

  const handleGuestLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestError("");
    if (!bookingCode.trim()) {
      setGuestError("Please enter your Booking Code.");
      return;
    }

    setIsGuestLoading(true);
    try {
      const code = bookingCode.toUpperCase().trim();
      const booking = await dbService.getBookingByCode(code);
      if (booking) {
        onLoginSuccess("guest", code);
      } else {
        setGuestError("Invalid Booking Code. Try 'VILLA-101', 'VILLA-202' or create a custom one.");
      }
    } catch (err) {
      setGuestError("Error connecting to database. Please check connection.");
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError("");
    const code = staffCode.trim().toLowerCase();
    
    if (code === "staff" || code === "staff-admin" || code === "admin") {
      onLoginSuccess("staff");
    } else {
      setStaffError("Invalid Staff Code. Use 'staff' or 'STAFF-ADMIN' to preview.");
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center py-10 px-4">
      
      {/* Decorative top badge */}
      <div className="mb-4 flex items-center gap-2 bg-[#2D5A27]/10 text-[#2D5A27] px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-widest uppercase shadow-sm">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Luxury Guest Experience Portals</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-xl relative overflow-hidden flex flex-col justify-between transition-all hover:shadow-2xl">
        {/* Subtle background blur spot */}
        <div className="absolute right-0 top-0 -mr-16 -mt-16 w-36 h-36 bg-[#2D5A27]/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Brand Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 bg-[#2D5A27] text-white rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-green-900/20 mb-3 hover:scale-105 transition-transform duration-200">
            C
          </div>
          <h2 className="text-2xl font-black tracking-tight text-gray-800">
            CHOWREST <span className="text-[#2D5A27] font-semibold">VILLA AZURE</span>
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mt-1">Hospitality Management</p>
        </div>

        {/* Portal Tabs Selector */}
        <div className="grid grid-cols-2 bg-gray-100 p-1.5 rounded-2xl mb-6 border border-black/[0.02]">
          <button
            onClick={() => {
              setActivePortal("guest");
              setGuestError("");
              setStaffError("");
            }}
            className={`py-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activePortal === "guest" 
                ? "bg-white text-[#2D5A27] shadow-sm" 
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <DoorOpen className="w-4 h-4" />
            <span>Guest Portal</span>
          </button>
          <button
            onClick={() => {
              setActivePortal("staff");
              setGuestError("");
              setStaffError("");
            }}
            className={`py-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activePortal === "staff" 
                ? "bg-white text-[#2D5A27] shadow-sm" 
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Staff Portal</span>
          </button>
        </div>

        {/* Forms */}
        {activePortal === "guest" ? (
          <form onSubmit={handleGuestLogin} className="space-y-4">
            <div>
              <label htmlFor="booking_code_input" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Villa Booking Code
              </label>
              <div className="relative">
                <input
                  id="booking_code_input"
                  type="text"
                  placeholder="e.g. VILLA-101"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] rounded-xl py-3.5 px-4 text-xs text-gray-800 placeholder-gray-400 uppercase font-mono tracking-widest outline-none transition-all"
                />
                <Key className="w-4 h-4 text-gray-300 absolute right-4 top-3.5" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">
                Check-in codes are printed on your booking confirmation or keys.
              </p>
            </div>

            {guestError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex gap-2 border border-red-100 items-center animate-fadeIn">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                <span className="font-medium">{guestError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isGuestLoading}
              className="w-full bg-[#2D5A27] hover:bg-[#1a3818] text-white py-3.5 rounded-xl text-xs font-bold shadow-md shadow-green-900/10 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer disabled:bg-gray-400"
            >
              {isGuestLoading ? "Retrieving Booking..." : "Connect to Guest Portal"}
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Assist */}
            <div className="pt-4 border-t border-gray-100 text-[11px] text-gray-500 space-y-3.5">
              <div className="bg-orange-50 border border-orange-100 p-3 rounded-2xl flex flex-col justify-between items-stretch gap-2">
                <span className="font-extrabold text-orange-800 uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-orange-600" /> Direct Link: Car Rental settings
                </span>
                <p className="text-[10px] text-orange-700 font-semibold leading-normal">
                  Skip manual lookup and go directly to the Concierge Services Car Rental panel.
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    const demoCode = "1684861076010173478"; // Marcus Aurelius
                    setBookingCode(demoCode);
                    setIsGuestLoading(true);
                    try {
                      const bookingExists = await dbService.getBookingByCode(demoCode);
                      if (bookingExists) {
                        window.location.hash = "#car";
                        onLoginSuccess("guest", demoCode);
                      }
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsGuestLoading(false);
                    }
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm shadow-orange-700/10 cursor-pointer"
                >
                  <Car className="w-3.5 h-3.5" /> Go to Car Rental Services
                </button>
              </div>

              <div>
                <span className="font-extrabold text-gray-700 uppercase tracking-wider text-[9px]">Standard Demo Villas:</span>
                <div className="flex gap-2 mt-1.5 font-mono flex-wrap">
                  {["VILLA-101", "VILLA-202", "VILLA-303"].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setBookingCode(code)}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                        bookingCode === code 
                          ? "bg-[#2D5A27] text-white shadow-sm" 
                          : "bg-gray-100 hover:bg-[#2D5A27]/10 text-gray-600 hover:text-[#2D5A27]"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-extrabold text-gray-700 uppercase tracking-wider text-[9px] block mb-1.5">
                  ✨ Real Airbnb Connected Listings:
                </span>
                <div className="relative">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        setBookingCode(e.target.value);
                      }
                    }}
                    value={REAL_AIRBNB_LISTINGS.some(l => l.code === bookingCode) ? bookingCode : ""}
                    className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl py-2.5 px-3 text-[11px] text-gray-700 font-semibold outline-none transition-all cursor-pointer"
                  >
                    <option value="" disabled>-- Select Real Airbnb Booking --</option>
                    {REAL_AIRBNB_LISTINGS.map((listing) => (
                      <option key={listing.code} value={listing.code}>
                        {listing.name} ({listing.code.substring(0, 6)}...) - {listing.guest}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div>
              <label htmlFor="staff_code_input" className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Staff Access Key
              </label>
              <div className="relative">
                <input
                  id="staff_code_input"
                  type="password"
                  placeholder="Enter staff key..."
                  value={staffCode}
                  onChange={(e) => setStaffCode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-[#2D5A27] focus:ring-1 focus:ring-[#2D5A27] rounded-xl py-3.5 px-4 text-xs text-gray-800 placeholder-gray-400 outline-none transition-all"
                />
                <Lock className="w-4 h-4 text-gray-300 absolute right-4 top-3.5" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">
                For demo testing, type <code className="font-bold text-gray-600">staff</code> to bypass.
              </p>
            </div>

            {staffError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-xl text-xs flex gap-2 border border-red-100 items-center animate-fadeIn">
                <AlertCircle className="w-4.5 h-4.5 text-red-500 flex-shrink-0" />
                <span className="font-medium">{staffError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-black text-white py-3.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              Enter Service Team Dashboard
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
