import React, { useState } from "react";
import { Database, Check, Copy, HelpCircle, X, ChevronRight, AlertCircle, Info } from "lucide-react";
import { isSupabaseConfigured, SUPABASE_SQL_SCHEMA } from "../lib/supabase";

export default function SupabaseHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <>
      {/* Tiny Badge fixed at bottom-left */}
      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
            isSupabaseConfigured 
              ? "bg-emerald-600 text-white hover:bg-emerald-700" 
              : "bg-amber-500 text-amber-950 hover:bg-amber-600"
          }`}
          title="Supabase Database Status & Setup Guides"
        >
          <Database className="w-3.5 h-3.5 animate-pulse" />
          <span>Supabase: {isSupabaseConfigured ? "Connected" : "Fallback Local"}</span>
          <span className="bg-black/10 px-1 py-0.2 rounded text-[10px]">GUIDE</span>
        </button>
      </div>

      {/* Slide-out/Modal Setup Guide Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl p-6 relative border border-black/5 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scaleUp">
            
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${isSupabaseConfigured ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Supabase Integration Center
                  </h3>
                  <p className="text-xs text-gray-400">
                    Connection: {isSupabaseConfigured ? "Live Database Active" : "In-Memory / LocalStorage Fallback Enabled"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Scroll */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1 scrollbar-thin">
              
              {/* Status Notice */}
              <div className={`p-4 rounded-2xl border ${
                isSupabaseConfigured 
                  ? "bg-emerald-50/50 border-emerald-100 text-emerald-950" 
                  : "bg-amber-50/50 border-amber-100 text-amber-950"
              }`}>
                <div className="flex gap-2">
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 ${isSupabaseConfigured ? "text-emerald-600" : "text-amber-600"}`} />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      {isSupabaseConfigured ? "SUCCESSFULLY CONNECTED!" : "SUPABASE NOT CONFIGURED YET"}
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed">
                      {isSupabaseConfigured 
                        ? "Your app is currently communicating with the live Supabase instance. Make sure you have created the matching tables so reads/writes don't fail!"
                        : "To connect this app to your actual Supabase (chowrest) database, add your environment variables in the secrets panel."}
                    </p>
                  </div>
                </div>
                
                {!isSupabaseConfigured && (
                  <div className="mt-3 bg-white/70 p-3 rounded-xl text-xs space-y-1 text-gray-700">
                    <p className="font-bold text-[#2D5A27] mb-1">Steps to connect:</p>
                    <div className="flex items-center gap-1">
                      <span className="font-bold bg-amber-200/50 text-amber-900 w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px]">1</span>
                      <span>Go to <b>Secrets Panel</b> in AI Studio.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold bg-amber-200/50 text-amber-900 w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px]">2</span>
                      <span>Add <code>VITE_SUPABASE_URL</code> with your project URL.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold bg-amber-200/50 text-amber-900 w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px]">3</span>
                      <span>Add <code>VITE_SUPABASE_ANON_KEY</code> with your anon public key.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* SQL Schema Copy */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-[#2D5A27]" /> SQL Setup Script
                  </h4>
                  <button 
                    onClick={handleCopySql}
                    className="flex items-center gap-1.5 text-xs text-[#2D5A27] bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg font-bold transition-all"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SQL Code</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                  Go to the <b>SQL Editor</b> inside your Supabase project dashboard, paste this script, and click <b>Run</b>. It creates the 4 needed tables (bookings, messages, concierge_requests, rsvps) and seeds sample data.
                </p>
                <div className="bg-gray-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-[220px] scrollbar-thin">
                  <pre>{SUPABASE_SQL_SCHEMA}</pre>
                </div>
              </div>

              {/* Login Guide */}
              <div className="bg-gray-50 p-4 rounded-2xl text-xs space-y-2 text-gray-700">
                <h4 className="font-bold text-gray-800 uppercase tracking-wider">🔑 How to test logins</h4>
                <p>
                  We have configured 2 custom logging portals in a beautiful single-view login screen:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li><b>Guest Login:</b> Use booking code <code>VILLA-101</code>, <code>VILLA-202</code>, or <code>VILLA-303</code>. No password needed for guest convenience!</li>
                  <li><b>Services Team Login:</b> Enter Code <code>staff</code> or <code>STAFF-ADMIN</code> to access the comprehensive staff dashboard to reply to chats and confirm concierge requests.</li>
                </ul>
              </div>

            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-[#2D5A27] hover:bg-[#1a3818] text-white text-xs px-5 py-2.5 rounded-xl font-bold cursor-pointer transition-all"
              >
                Done, Back to App
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
