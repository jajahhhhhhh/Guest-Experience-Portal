import { createClient } from "@supabase/supabase-js";

// Retrieve keys
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

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
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  isValidSupabaseUrl(supabaseUrl) && 
  isValidSupabaseKey(supabaseAnonKey)
);

// Initialize client if configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl.trim(), supabaseAnonKey.trim()) 
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
  category: "car" | "food" | "trip" | "spa";
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
  return JSON.parse(data);
}

function setLocal<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

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
        if (data) return data as Booking;
      } catch (err) {
        console.warn("Supabase createBooking failed, saving locally:", err);
      }
    }

    const bookings = getLocal<Booking[]>("sb_bookings", DEFAULT_BOOKINGS);
    bookings.push(newBooking);
    setLocal("sb_bookings", bookings);
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
        if (data) return data as Message;
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
        if (data) return data as ConciergeRequest;
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
    return newRequest;
  },

  async updateRequestStatus(id: string, status: "pending" | "confirmed" | "completed"): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase
          .from("concierge_requests")
          .update({ status })
          .eq("id", id);
        
        if (!error) return true;
        throw error;
      } catch (err) {
        console.warn("Supabase updateRequestStatus failed, saving locally:", err);
      }
    }

    const requests = getLocal<ConciergeRequest[]>("sb_requests", DEFAULT_REQUESTS);
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
      requests[index].status = status;
      setLocal("sb_requests", requests);
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
        
        if (!error) return true;
        throw error;
      } catch (err) {
        console.warn("Supabase deleteRequest failed, saving locally:", err);
      }
    }

    const requests = getLocal<ConciergeRequest[]>("sb_requests", DEFAULT_REQUESTS);
    const updated = requests.filter(r => r.id !== id);
    setLocal("sb_requests", updated);
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
    return rsvps.filter(r => r.booking_code === bookingCode).map(r => r.event_id);
  }
};

// SQL code snippet to print in the setup helper panel
export const SUPABASE_SQL_SCHEMA = `-- Create Bookings Table
CREATE TABLE bookings (
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
CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_code text NOT NULL REFERENCES bookings(booking_code) ON DELETE CASCADE,
  sender text CHECK (sender IN ('host', 'guest')) NOT NULL,
  text text NOT NULL,
  time text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create Concierge Requests Table
CREATE TABLE concierge_requests (
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
CREATE TABLE rsvps (
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
  ('VILLA-303', 'Sato & Yuki Tanaka', 'Chowrest Villa Sapphire', '2026-07-02', '2026-07-05', 'VillaSapphire_Guest_5G', 'sapphiresun', '#3030*');

-- Seed Initial Chat Message
INSERT INTO messages (booking_code, sender, text, time)
VALUES 
  ('VILLA-101', 'host', 'Hello! I hope you''re settling in well. Do you need a reservation for the Muay Thai fight tonight?', '09:45 AM'),
  ('VILLA-101', 'guest', 'Yes please, 4 tickets for the ringside section if available!', '10:12 AM'),
  ('VILLA-101', 'host', 'Done! I''ve secured your 4 ringside tickets.', '10:20 AM');
`;
