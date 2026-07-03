import React, { useState, useEffect } from "react";
import BookingLogin from "./components/BookingLogin";
import GuestPortal from "./components/GuestPortal";
import ServicesTeam from "./components/ServicesTeam";
import SupabaseHelper from "./components/SupabaseHelper";

export default function App() {
  // Session Persistence
  const [loginState, setLoginState] = useState<{
    type: "none" | "guest" | "staff";
    bookingCode?: string;
  }>(() => {
    const savedType = localStorage.getItem("chowrest_login_type") as "none" | "guest" | "staff";
    const savedCode = localStorage.getItem("chowrest_booking_code") || undefined;
    if (savedType === "guest" || savedType === "staff") {
      return { type: savedType, bookingCode: savedCode };
    }
    return { type: "none" };
  });

  const handleLoginSuccess = (type: "guest" | "staff", bookingCode?: string) => {
    setLoginState({ type, bookingCode });
    localStorage.setItem("chowrest_login_type", type);
    if (bookingCode) {
      localStorage.setItem("chowrest_booking_code", bookingCode);
    } else {
      localStorage.removeItem("chowrest_booking_code");
    }
  };

  const handleLogout = () => {
    setLoginState({ type: "none" });
    localStorage.removeItem("chowrest_login_type");
    localStorage.removeItem("chowrest_booking_code");
  };

  return (
    <div id="chowrest-app-root" className="min-h-screen bg-[#F6F8F5] text-gray-800 font-sans flex flex-col justify-between p-4 md:p-6 transition-all duration-300">
      
      {/* Dynamic Content */}
      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto justify-center">
        {loginState.type === "none" && (
          <BookingLogin onLoginSuccess={handleLoginSuccess} />
        )}
        
        {loginState.type === "guest" && loginState.bookingCode && (
          <GuestPortal 
            bookingCode={loginState.bookingCode} 
            onLogout={handleLogout} 
          />
        )}
        
        {loginState.type === "staff" && (
          <ServicesTeam onLogout={handleLogout} />
        )}
      </div>

      {/* Floating Supabase Configuration & Helper Dashboard */}
      <SupabaseHelper />
    </div>
  );
}
