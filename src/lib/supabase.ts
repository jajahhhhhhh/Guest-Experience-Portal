import { createClient } from "@supabase/supabase-js";

// Retrieve keys
const rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_URL || "https://axyxxccwqlfhbutinwdj.supabase.co";
const rawAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || (import.meta as any).env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_pEgB9vlno9H_jCQj_DfNww_YPe8iHyK";

// Validation helpers to prevent client-side initialization crash on invalid/placeholder credentials
const isValidSupabaseUrl = (url: any): boolean => {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false;
  
  const lowerUrl = trimmed.toLowerCase();
  if (
    lowerUrl.includes("your-project") ||
    lowerUrl.includes("placeholder") ||
    lowerUrl.includes("<your") ||
    lowerUrl.includes("your-supabase") ||
    lowerUrl.includes("your-app") ||
    lowerUrl === "https://" ||
    lowerUrl === "http://"
  ) {
    return false;
  }
  
  try {
    new URL(trimmed);
    return true;
  } catch (e) {
    return false;
  }
};

const isValidSupabaseKey = (key: any): boolean => {
  if (!key || typeof key !== "string") return false;
  const trimmed = key.trim();
  const lowerKey = trimmed.toLowerCase();
  if (
    lowerKey === "your-anon-key" ||
    lowerKey === "your-key" ||
    lowerKey.includes("placeholder") ||
    lowerKey.includes("<your") ||
    lowerKey.includes("anon-key") ||
    trimmed === ""
  ) {
    return false;
  }
  // Supabase anon keys are usually JWTs and quite long (typically > 40 characters)
  if (trimmed.length < 20) return false;
  return true;
};

// Check if configured and not placeholder values
export const isSupabaseConfigured = isValidSupabaseUrl(rawUrl) && isValidSupabaseKey(rawAnonKey);

export const supabaseUrl = isSupabaseConfigured ? rawUrl.trim() : "";
export const supabaseAnonKey = isSupabaseConfigured ? rawAnonKey.trim() : "";

// Initialize client if configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Types
export interface Booking {
  id: string;
  booking_code: string;
  guest_name: string;
  villa_name: string;
  check_in: string;
  check_out: string;
  wifi_ssid: string;
  wifi_password: string;
  gate_code: string;
}

export interface Message {
  id: string;
  booking_code: string;
  sender: "host" | "guest";
  text: string;
  time: string;
  created_at: string;
}

export interface ConciergeRequest {
  id: string;
  booking_code: string;
  category: "car" | "food" | "trip" | "spa" | "house";
  title: string;
  detail: string;
  price: string;
  status: "pending" | "confirmed" | "completed";
  created_at: string;
}

export interface Rsvp {
  id: string;
  booking_code: string;
  event_id: string;
}

// --- LOCAL STORAGE BACKUP DATABASE ---
// We initialize default data in localStorage if they don't exist
const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: "b1",
    booking_code: "VILLA-101",
    guest_name: "The Anderson Family",
    villa_name: "Chowrest Villa Azure",
    check_in: "2026-06-30",
    check_out: "2026-07-06",
    wifi_ssid: "VillaAzure_Guest_5G",
    wifi_password: "serenity2024",
    gate_code: "#1209*"
  },
  {
    id: "b2",
    booking_code: "VILLA-202",
    guest_name: "Dr. Elizabeth Chen",
    villa_name: "Chowrest Villa Emerald",
    check_in: "2026-07-01",
    check_out: "2026-07-08",
    wifi_ssid: "VillaEmerald_Guest_5G",
    wifi_password: "emeraldserene",
    gate_code: "#2202*"
  },
  {
    id: "b3",
    booking_code: "VILLA-303",
    guest_name: "Sato & Yuki Tanaka",
    villa_name: "Chowrest Villa Sapphire",
    check_in: "2026-07-02",
    check_out: "2026-07-05",
    wifi_ssid: "VillaSapphire_Guest_5G",
    wifi_password: "sapphiresun",
    gate_code: "#3030*"
  },
  {
    id: "ab1",
    booking_code: "1684861076010173478",
    guest_name: "Marcus Aurelius",
    villa_name: "Chowrest Sanctuary Villa",
    check_in: "2026-07-03",
    check_out: "2026-07-10",
    wifi_ssid: "Chowrest_Sanctuary_5G",
    wifi_password: "sanctuaryretreat",
    gate_code: "#4861*"
  },
  {
    id: "ab2",
    booking_code: "1686708815346599245",
    guest_name: "Serena Williams",
    villa_name: "Chowrest Ocean Oasis",
    check_in: "2026-07-04",
    check_out: "2026-07-11",
    wifi_ssid: "Chowrest_Ocean_5G",
    wifi_password: "oceanoasisfree",
    gate_code: "#7088*"
  },
  {
    id: "ab3",
    booking_code: "1716892251918662152",
    guest_name: "Alexander Wright",
    villa_name: "Chowrest Horizon Haven",
    check_in: "2026-07-03",
    check_out: "2026-07-09",
    wifi_ssid: "Chowrest_Horizon_5G",
    wifi_password: "horizonhavensky",
    gate_code: "#8922*"
  },
  {
    id: "ab4",
    booking_code: "1716905792921069157",
    guest_name: "Sophia Loren",
    villa_name: "Chowrest Palm Retreat",
    check_in: "2026-07-05",
    check_out: "2026-07-12",
    wifi_ssid: "Chowrest_Palm_5G",
    wifi_password: "palmretreat2026",
    gate_code: "#9057*"
  },
  {
    id: "ab5",
    booking_code: "1716861874617626825",
    guest_name: "Liam Neeson",
    villa_name: "Chowrest Jungle Canopy",
    check_in: "2026-07-02",
    check_out: "2026-07-08",
    wifi_ssid: "Chowrest_Jungle_5G",
    wifi_password: "junglecanopygreen",
    gate_code: "#8618*"
  },
  {
    id: "ab6",
    booking_code: "1717026260606862074",
    guest_name: "Grace Kelly",
    villa_name: "Chowrest Serenity Suites",
    check_in: "2026-07-03",
    check_out: "2026-07-07",
    wifi_ssid: "Chowrest_Serenity_5G",
    wifi_password: "serenitysuiteslux",
    gate_code: "#0262*"
  },
  {
    id: "ab7",
    booking_code: "1685591049457780061",
    guest_name: "James Bond",
    villa_name: "Chowrest Cliffside Manor",
    check_in: "2026-07-01",
    check_out: "2026-07-08",
    wifi_ssid: "Chowrest_Cliffside_5G",
    wifi_password: "cliffside007",
    gate_code: "#5910*"
  },
  {
    id: "ab8",
    booking_code: "1685608943348499808",
    guest_name: "Audrey Hepburn",
    villa_name: "Chowrest Sunset Crest",
    check_in: "2026-07-03",
    check_out: "2026-07-10",
    wifi_ssid: "Chowrest_Sunset_5G",
    wifi_password: "sunsetcrestchic",
    gate_code: "#6089*"
  }
];

const DEFAULT_MESSAGES: Message[] = [
  {
    id: "msg1",
    booking_code: "VILLA-101",
    sender: "host",
    text: "Hello! I hope you're settling in well. Do you need a reservation for the Muay Thai fight tonight?",
    time: "09:45 AM",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "msg2",
    booking_code: "VILLA-101",
    sender: "guest",
    text: "Yes please, 4 tickets for the ringside section if available!",
    time: "10:12 AM",
    created_at: new Date(Date.now() - 3600000 * 3.5).toISOString()
  },
  {
    id: "msg3",
    booking_code: "VILLA-101",
    sender: "host",
    text: "Done! I've secured your 4 ringside tickets. They are registered under your villa schedule. Let me know if you need anything else!",
    time: "10:20 AM",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: "msg4",
    booking_code: "VILLA-202",
    sender: "host",
    text: "Hi Dr. Chen, welcome to Villa Emerald. Let me know if you would like to book a private Thai chef service for this evening.",
    time: "02:15 PM",
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

const DEFAULT_REQUESTS: ConciergeRequest[] = [
  {
    id: "req1",
    booking_code: "VILLA-101",
    category: "spa",
    title: "Traditional Thai Massage",
    detail: "90 min • In-Villa Suite",
    price: "$65",
    status: "confirmed",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const DEFAULT_RSVPS: Rsvp[] = [
  { id: "rv1", booking_code: "VILLA-101", event_id: "ev1" }
];

// Helper to load/save from localStorage
function getLocal<T>(key: string, defaultValue: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  // Auto-merge new bookings to existing local storage
  if (key === "sb_bookings" && Array.isArray(defaultValue)) {
    try {
      const parsed = JSON.parse(data) as any[];
      const missingBookings = defaultValue.filter(
        (defB: any) => !parsed.some((pB: any) => pB.booking_code === defB.booking_code)
      );
      if (missingBookings.length > 0) {
        const merged = [...parsed, ...missingBookings];
        localStorage.setItem(key, JSON.stringify(merged));
        return merged as unknown as T;
      }
    } catch (e) {
      console.warn("Failed merging booking data:", e);
    }
  }
  return JSON.parse(data);
}

function setLocal<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Helper to dispatch local custom events for instantaneous multi-component updates (when running without live Supabase)
const dispatchLocalUpdate = (detail: { type: string; booking_code?: string; action?: "INSERT" | "UPDATE" | "DELETE"; data?: any; id?: string }) => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("local-db-update", { detail }));
  }
};

// --- DATABASE SERVICE API WITH AUTO FALLBACKS ---

export const dbService = {
  // 1. Bookings
  async getBookingByCode(code: string): Promise<Booking | null> {
    const cleanCode = code.toUpperCase().trim();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .eq("booking_code", cleanCode)
          .maybeSingle();
        
        if (error) throw error;
        if (data) return data as Booking;
      } catch (err) {
        console.warn("Supabase booking lookup failed, falling back to local DB:", err);
      }
    }
    // Fallback
    const bookings = getLocal<Booking[]>("sb_bookings", DEFAULT_BOOKINGS);
    return bookings.find(b => b.booking_code === cleanCode) || null;
  },

  async getAllBookings(): Promise<Booking[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("booking_code", { ascending: true });
        
        if (error) throw error;
        if (data) return data as Booking[];
      } catch (err) {
        console.warn("Supabase getAllBookings failed, falling back:", err);
      }
    }
    return getLocal<Booking[]>("sb_bookings", DEFAULT_BOOKINGS);
  },

  async createBooking(booking: Omit<Booking, "id">): Promise<Booking> {
    const newBooking: Booking = {
      ...booking,
      id: `b_${Date.now()}`
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .insert([booking])
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          const result = data as Booking;
          dispatchLocalUpdate({ type: "booking", data: result });
          return result;
        }
      } catch (err) {
        console.warn("Supabase createBooking failed, saving locally:", err);
      }
    }

    const bookings = getLocal<Booking[]>("sb_bookings", DEFAULT_BOOKINGS);
    bookings.push(newBooking);
    setLocal("sb_bookings", bookings);
    dispatchLocalUpdate({ type: "booking", data: newBooking });
    return newBooking;
  },

  // 2. Chat Messages
  async getMessages(bookingCode: string): Promise<Message[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("booking_code", bookingCode)
          .order("created_at", { ascending: true });
        
        if (error) throw error;
        if (data) return data as Message[];
      } catch (err) {
        console.warn("Supabase getMessages failed, falling back:", err);
      }
    }
    const messages = getLocal<Message[]>("sb_messages", DEFAULT_MESSAGES);
    return messages.filter(m => m.booking_code === bookingCode);
  },

  async getAllMessages(): Promise<Message[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: true });
        
        if (error) throw error;
        if (data) return data as Message[];
      } catch (err) {
        console.warn("Supabase getAllMessages failed, falling back:", err);
      }
    }
    return getLocal<Message[]>("sb_messages", DEFAULT_MESSAGES);
  },

  async addMessage(bookingCode: string, sender: "host" | "guest", text: string): Promise<Message> {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const payload = {
      booking_code: bookingCode,
      sender,
      text,
      time: timeStr,
      created_at: now.toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("messages")
          .insert([payload])
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          const result = data as Message;
          dispatchLocalUpdate({ type: "message", booking_code: bookingCode, data: result });
          return result;
        }
      } catch (err) {
        console.warn("Supabase addMessage failed, saving locally:", err);
      }
    }

    const messages = getLocal<Message[]>("sb_messages", DEFAULT_MESSAGES);
    const newMsg: Message = {
      ...payload,
      id: `msg_${Date.now()}`
    };
    messages.push(newMsg);
    setLocal("sb_messages", messages);
    dispatchLocalUpdate({ type: "message", booking_code: bookingCode, data: newMsg });
    return newMsg;
  },

  // 3. Concierge Requests
  async getRequests(bookingCode: string): Promise<ConciergeRequest[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("concierge_requests")
          .select("*")
          .eq("booking_code", bookingCode)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        if (data) return data as ConciergeRequest[];
      } catch (err) {
        console.warn("Supabase getRequests failed, falling back:", err);
      }
    }
    const requests = getLocal<ConciergeRequest[]>("sb_requests", DEFAULT_REQUESTS);
    return requests.filter(r => r.booking_code === bookingCode);
  },

  async getAllRequests(): Promise<ConciergeRequest[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("concierge_requests")
          .select("*")
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        if (data) return data as ConciergeRequest[];
      } catch (err) {
        console.warn("Supabase getAllRequests failed, falling back:", err);
      }
    }
    return getLocal<ConciergeRequest[]>("sb_requests", DEFAULT_REQUESTS);
  },

  async createRequest(bookingCode: string, category: "car" | "food" | "trip" | "spa", title: string, detail: string, price: string): Promise<ConciergeRequest> {
    const payload = {
      booking_code: bookingCode,
      category,
      title,
      detail,
      price,
      status: "pending" as const,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("concierge_requests")
          .insert([payload])
          .select()
          .single();
        
        if (error) throw error;
        if (data) {
          const result = data as ConciergeRequest;
          dispatchLocalUpdate({ type: "request", booking_code: bookingCode, action: "INSERT", data: result });
          return result;
        }
      } catch (err) {
        console.warn("Supabase createRequest failed, saving locally:", err);
      }
    }

    const requests = getLocal<ConciergeRequest[]>("sb_requests", DEFAULT_REQUESTS);
    const newRequest: ConciergeRequest = {
      ...payload,
      id: `req_${Date.now()}`
    };
    requests.unshift(newRequest);
    setLocal("sb_requests", requests);
    dispatchLocalUpdate({ type: "request", booking_code: bookingCode, action: "INSERT", data: newRequest });
    return newRequest;
  },

  async updateRequestStatus(id: string, status: "pending" | "confirmed" | "completed"): Promise<boolean> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("concierge_requests")
          .update({ status })
          .eq("id", id)
          .select()
          .single();
        
        if (!error && data) {
          dispatchLocalUpdate({ type: "request", action: "UPDATE", data: data as ConciergeRequest });
          return true;
        }
        if (error) throw error;
      } catch (err) {
        console.warn("Supabase updateRequestStatus failed, saving locally:", err);
      }
    }

    const requests = getLocal<ConciergeRequest[]>("sb_requests", DEFAULT_REQUESTS);
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
      requests[index].status = status;
      setLocal("sb_requests", requests);
      dispatchLocalUpdate({ type: "request", action: "UPDATE", data: requests[index] });
      return true;
    }
    return false;
  },

  async deleteRequest(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("concierge_requests")
          .delete()
          .eq("id", id);
        
        if (!error) {
          dispatchLocalUpdate({ type: "request", action: "DELETE", id });
          return true;
        }
        throw error;
      } catch (err) {
        console.warn("Supabase deleteRequest failed, saving locally:", err);
      }
    }

    const requests = getLocal<ConciergeRequest[]>("sb_requests", DEFAULT_REQUESTS);
    const updated = requests.filter(r => r.id !== id);
    setLocal("sb_requests", updated);
    dispatchLocalUpdate({ type: "request", action: "DELETE", id });
    return true;
  },

  // 4. RSVPs
  async getRsvps(bookingCode: string): Promise<string[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("rsvps")
          .select("event_id")
          .eq("booking_code", bookingCode);
        
        if (error) throw error;
        if (data) return data.map(item => item.event_id);
      } catch (err) {
        console.warn("Supabase getRsvps failed, falling back:", err);
      }
    }
    const rsvps = getLocal<Rsvp[]>("sb_rsvps", DEFAULT_RSVPS);
    return rsvps.filter(r => r.booking_code === bookingCode).map(r => r.event_id);
  },

  async toggleRsvp(bookingCode: string, eventId: string): Promise<string[]> {
    if (supabase) {
      try {
        // Check if exists
        const { data, error: selectErr } = await supabase
          .from("rsvps")
          .select("*")
          .eq("booking_code", bookingCode)
          .eq("event_id", eventId)
          .maybeSingle();

        if (selectErr) throw selectErr;

        if (data) {
          // Delete
          const { error: deleteErr } = await supabase
            .from("rsvps")
            .delete()
            .eq("booking_code", bookingCode)
            .eq("event_id", eventId);
          if (deleteErr) throw deleteErr;
        } else {
          // Insert
          const { error: insertErr } = await supabase
            .from("rsvps")
            .insert([{ booking_code: bookingCode, event_id: eventId }]);
          if (insertErr) throw insertErr;
        }

        // Get latest
        const { data: latestData, error: latestErr } = await supabase
          .from("rsvps")
          .select("event_id")
          .eq("booking_code", bookingCode);
        
        if (latestErr) throw latestErr;
        return latestData.map(item => item.event_id);

      } catch (err) {
        console.warn("Supabase toggleRsvp failed, saving locally:", err);
      }
    }

    // Local fallback
    const rsvps = getLocal<Rsvp[]>("sb_rsvps", DEFAULT_RSVPS);
    const existingIndex = rsvps.findIndex(r => r.booking_code === bookingCode && r.event_id === eventId);
    if (existingIndex !== -1) {
      rsvps.splice(existingIndex, 1);
    } else {
      rsvps.push({
        id: `rv_${Date.now()}`,
        booking_code: bookingCode,
        event_id: eventId
      });
    }
    setLocal("sb_rsvps", rsvps);
    const finalRsvps = rsvps.filter(r => r.booking_code === bookingCode).map(r => r.event_id);
    dispatchLocalUpdate({ type: "rsvp", booking_code: bookingCode, data: finalRsvps });
    return finalRsvps;
  },

  // --- REAL-TIME SUBSCRIPTION METHODS (WEBSOCKETS) ---
  
  subscribeToBookings(onChange: (booking: Booking, eventType: "INSERT") => void): () => void {
    if (supabase) {
      const channel = supabase
        .channel("bookings_realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "bookings"
          },
          (payload: any) => {
            onChange(payload.new as Booking, "INSERT");
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Local subscription fallback
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.type === "booking") {
        onChange(customEvent.detail.data as Booking, "INSERT");
      }
    };
    window.addEventListener("local-db-update", handleLocalUpdate);
    return () => {
      window.removeEventListener("local-db-update", handleLocalUpdate);
    };
  },

  subscribeToMessages(bookingCode: string, onInsertOrUpdate: (msg: Message) => void): () => void {
    if (supabase) {
      const channel = supabase
        .channel(`messages_realtime_${bookingCode}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages",
            filter: bookingCode ? `booking_code=eq.${bookingCode}` : undefined
          },
          (payload: any) => {
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              onInsertOrUpdate(payload.new as Message);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Local subscription fallback
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail &&
        customEvent.detail.type === "message" &&
        (!bookingCode || customEvent.detail.booking_code === bookingCode)
      ) {
        onInsertOrUpdate(customEvent.detail.data as Message);
      }
    };
    window.addEventListener("local-db-update", handleLocalUpdate);
    return () => {
      window.removeEventListener("local-db-update", handleLocalUpdate);
    };
  },

  subscribeToAllMessages(onInsertOrUpdate: (msg: Message) => void): () => void {
    if (supabase) {
      const channel = supabase
        .channel("all_messages_realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "messages"
          },
          (payload: any) => {
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              onInsertOrUpdate(payload.new as Message);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Local subscription fallback
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.type === "message") {
        onInsertOrUpdate(customEvent.detail.data as Message);
      }
    };
    window.addEventListener("local-db-update", handleLocalUpdate);
    return () => {
      window.removeEventListener("local-db-update", handleLocalUpdate);
    };
  },

  subscribeToRequests(bookingCode: string, onChange: (req: ConciergeRequest, eventType: "INSERT" | "UPDATE" | "DELETE", oldId?: string) => void): () => void {
    if (supabase) {
      const channel = supabase
        .channel(`requests_realtime_${bookingCode}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "concierge_requests",
            filter: bookingCode ? `booking_code=eq.${bookingCode}` : undefined
          },
          (payload: any) => {
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              onChange(payload.new as ConciergeRequest, payload.eventType);
            } else if (payload.eventType === "DELETE") {
              onChange(payload.old as ConciergeRequest, "DELETE", payload.old.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Local subscription fallback
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (
        customEvent.detail &&
        customEvent.detail.type === "request" &&
        (!bookingCode || customEvent.detail.booking_code === bookingCode)
      ) {
        onChange(customEvent.detail.data as ConciergeRequest, customEvent.detail.action || "INSERT", customEvent.detail.id);
      }
    };
    window.addEventListener("local-db-update", handleLocalUpdate);
    return () => {
      window.removeEventListener("local-db-update", handleLocalUpdate);
    };
  },

  subscribeToAllRequests(onChange: (req: ConciergeRequest, eventType: "INSERT" | "UPDATE" | "DELETE", oldId?: string) => void): () => void {
    if (supabase) {
      const channel = supabase
        .channel("all_requests_realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "concierge_requests"
          },
          (payload: any) => {
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              onChange(payload.new as ConciergeRequest, payload.eventType);
            } else if (payload.eventType === "DELETE") {
              onChange(payload.old as ConciergeRequest, "DELETE", payload.old.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }

    // Local subscription fallback
    const handleLocalUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.type === "request") {
        onChange(customEvent.detail.data as ConciergeRequest, customEvent.detail.action || "INSERT", customEvent.detail.id);
      }
    };
    window.addEventListener("local-db-update", handleLocalUpdate);
    return () => {
      window.removeEventListener("local-db-update", handleLocalUpdate);
    };
  }
};

// SQL code snippet to print in the setup helper panel
export const SUPABASE_SQL_SCHEMA = `-- Create Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code text UNIQUE NOT NULL,
  guest_name text NOT NULL,
  villa_name text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  wifi_ssid text DEFAULT 'VillaAzure_Guest_5G',
  wifi_password text DEFAULT 'serenity2024',
  gate_code text DEFAULT '#1209*'
);

-- Create Chat Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code text NOT NULL REFERENCES bookings(booking_code) ON DELETE CASCADE,
  sender text CHECK (sender IN ('host', 'guest')) NOT NULL,
  text text NOT NULL,
  time text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create Concierge Requests Table
CREATE TABLE IF NOT EXISTS concierge_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code text NOT NULL REFERENCES bookings(booking_code) ON DELETE CASCADE,
  category text CHECK (category IN ('car', 'food', 'trip', 'spa')) NOT NULL,
  title text NOT NULL,
  detail text NOT NULL,
  price text NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'completed')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create RSVPs Table
CREATE TABLE IF NOT EXISTS rsvps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code text NOT NULL REFERENCES bookings(booking_code) ON DELETE CASCADE,
  event_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_code, event_id)
);

-- Seed Initial Bookings Data
INSERT INTO bookings (booking_code, guest_name, villa_name, check_in, check_out, wifi_ssid, wifi_password, gate_code)
VALUES 
  ('VILLA-101', 'The Anderson Family', 'Chowrest Villa Azure', '2026-06-30', '2026-07-06', 'VillaAzure_Guest_5G', 'serenity2024', '#1209*'),
  ('VILLA-202', 'Dr. Elizabeth Chen', 'Chowrest Villa Emerald', '2026-07-01', '2026-07-08', 'VillaEmerald_Guest_5G', 'emeraldserene', '#2202*'),
  ('VILLA-303', 'Sato & Yuki Tanaka', 'Chowrest Villa Sapphire', '2026-07-02', '2026-07-05', 'VillaSapphire_Guest_5G', 'sapphiresun', '#3030*'),
  ('1684861076010173478', 'Marcus Aurelius', 'Chowrest Sanctuary Villa', '2026-07-03', '2026-07-10', 'Chowrest_Sanctuary_5G', 'sanctuaryretreat', '#4861*'),
  ('1686708815346599245', 'Serena Williams', 'Chowrest Ocean Oasis', '2026-07-04', '2026-07-11', 'Chowrest_Ocean_5G', 'oceanoasisfree', '#7088*'),
  ('1716892251918662152', 'Alexander Wright', 'Chowrest Horizon Haven', '2026-07-03', '2026-07-09', 'Chowrest_Horizon_5G', 'horizonhavensky', '#8922*'),
  ('1716905792921069157', 'Sophia Loren', 'Chowrest Palm Retreat', '2026-07-05', '2026-07-12', 'Chowrest_Palm_5G', 'palmretreat2026', '#9057*'),
  ('1716861874617626825', 'Liam Neeson', 'Chowrest Jungle Canopy', '2026-07-02', '2026-07-08', 'Chowrest_Jungle_5G', 'junglecanopygreen', '#8618*'),
  ('1717026260606862074', 'Grace Kelly', 'Chowrest Serenity Suites', '2026-07-03', '2026-07-07', 'Chowrest_Serenity_5G', 'serenitysuiteslux', '#0262*'),
  ('1685591049457780061', 'James Bond', 'Chowrest Cliffside Manor', '2026-07-01', '2026-07-08', 'Chowrest_Cliffside_5G', 'cliffside007', '#5910*'),
  ('1685608943348499808', 'Audrey Hepburn', 'Chowrest Sunset Crest', '2026-07-03', '2026-07-10', 'Chowrest_Sunset_5G', 'sunsetcrestchic', '#6089*')
ON CONFLICT (booking_code) DO NOTHING;

-- Seed Initial Chat Message
INSERT INTO messages (booking_code, sender, text, time)
VALUES 
  ('VILLA-101', 'host', 'Hello! I hope you''re settling in well. Do you need a reservation for the Muay Thai fight tonight?', '09:45 AM'),
  ('VILLA-101', 'guest', 'Yes please, 4 tickets for the ringside section if available!', '10:12 AM'),
  ('VILLA-101', 'host', 'Done! I''ve secured your 4 ringside tickets.', '10:20 AM')
ON CONFLICT DO NOTHING;

-- Enable Realtime (Run this inside your Supabase SQL editor to activate WebSocket events!)
DO $$
BEGIN
  -- Add messages table to realtime if not already added
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_rel pr 
      JOIN pg_publication p ON p.oid = pr.prpubid 
      JOIN pg_class c ON c.oid = pr.prrelid 
      WHERE p.pubname = 'supabase_realtime' AND c.relname = 'messages'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    END IF;

    -- Add concierge_requests table to realtime if not already added
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_rel pr 
      JOIN pg_publication p ON p.oid = pr.prpubid 
      JOIN pg_class c ON c.oid = pr.prrelid 
      WHERE p.pubname = 'supabase_realtime' AND c.relname = 'concierge_requests'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE concierge_requests;
    END IF;

    -- Add bookings table to realtime if not already added
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_rel pr 
      JOIN pg_publication p ON p.oid = pr.prpubid 
      JOIN pg_class c ON c.oid = pr.prrelid 
      WHERE p.pubname = 'supabase_realtime' AND c.relname = 'bookings'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
    END IF;

    -- Add rsvps table to realtime if not already added
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_rel pr 
      JOIN pg_publication p ON p.oid = pr.prpubid 
      JOIN pg_class c ON c.oid = pr.prrelid 
      WHERE p.pubname = 'supabase_realtime' AND c.relname = 'rsvps'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE rsvps;
    END IF;
  END IF;
END $$;
`;

