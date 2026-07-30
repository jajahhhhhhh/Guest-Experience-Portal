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
  Sparkle,
  Home,
  Map,
  Layers,
  Flame
} from "lucide-react";
import { dbService, Booking, Message, ConciergeRequest } from "../lib/supabase";
import LocalDiscoveries from "./LocalDiscoveries";

export interface ExcursionOption {
  id: string;
  name: string;
  slogan: string;
  image: string;
  priceThb: number;
  priceUsd: number;
  duration: string;
  recommendationTag: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: { time: string; activity: string }[];
  whatToBring?: string[];
  options: { name: string; priceUsd: number; priceThb: number }[];
  restrictions?: string[];
}

export const EXCURSIONS: ExcursionOption[] = [
  {
    id: "pink-dolphin",
    name: "GD Ocean Dolphin Watching & Pig Island",
    slogan: "A magical encounter with Koh Samui's wild pink dolphins and adorable beach pigs.",
    image: "https://images.unsplash.com/photo-1590418606746-018840f9cd0f?auto=format&fit=crop&w=800&q=80",
    priceThb: 2000,
    priceUsd: 58,
    duration: "Full Day (8:00 AM - 2:45 PM)",
    recommendationTag: "Most Popular",
    inclusions: [
      "Luxury Speedboat transport",
      "Bilingual expert tour guide",
      "Full buffet lunch & fresh fruits",
      "Drinking water & cold soft drinks",
      "Premium Snorkeling mask & life jacket",
      "Full accident travel insurance",
      "Round-trip air-con hotel transfer"
    ],
    exclusions: [
      "Koh Madsum (Pig Island) admission fee (50 THB / ~$1.50 per person)"
    ],
    itinerary: [
      { time: "08:00 AM", activity: "Pick up from your villa in an air-conditioned minivan" },
      { time: "09:00 AM", activity: "Board speedboat to the pristine Khanom coast to spot wild Pink Dolphins" },
      { time: "11:00 AM", activity: "Anchor at Koh Tan coral reefs for premium tropical snorkeling" },
      { time: "12:30 PM", activity: "Arrive at Koh Madsum (Pig Island) to feed the famous friendly wild pigs & sunbathe" },
      { time: "01:40 PM", activity: "Return to Koh Samui pier for a delicious, fresh traditional Thai buffet lunch" },
      { time: "02:45 PM", activity: "Depart the pier and transfer safely back to your luxury villa" }
    ],
    restrictions: [
      "Unfortunately we cannot accept people with existing health problems, pregnant women, children aged under 1 year, or adults over 70 years."
    ],
    whatToBring: ["Swimwear", "Sunscreen", "Camera", "50 THB Cash for Island Admission fee"],
    options: [
      { name: "Full Dolphin + Koh Tan + Pig Island Program (Mon/Wed/Fri/Sun)", priceUsd: 58, priceThb: 2000 },
      { name: "Koh Tan + Pig Island Tour Only (Tue/Thu/Sat)", priceUsd: 44, priceThb: 1500 }
    ]
  },
  {
    id: "angthong-marine",
    name: "Angthong National Marine Park Expedition",
    slogan: "Paddle and snorkel through a pristine archipelago of 42 limestone islands.",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80",
    priceThb: 1850,
    priceUsd: 54,
    duration: "Full Day (7:15 AM - 4:30 PM)",
    recommendationTag: "Aesthetic Views",
    inclusions: [
      "Large tour boat cruise",
      "Premium ocean kayaking equipment",
      "Snorkeling gear & dry bags",
      "Speaking guides (English/German)",
      "Light breakfast on board",
      "Freshly prepared buffet lunch & fruits",
      "Soft drinks & accident insurance"
    ],
    exclusions: [
      "National Park Entry Fee (Pay cash at the pier: 300 THB Adult / 150 THB Child)"
    ],
    itinerary: [
      { time: "07:15 AM", activity: "Transfer by air-conditioned minivan from villa to Nathon Pier" },
      { time: "08:30 AM", activity: "Depart the pier; enjoy a light continental breakfast on board" },
      { time: "10:00 AM", activity: "Arrive at Angthong Marine Park. Set off by kayak or longtail boat to Koh Mae Koh" },
      { time: "11:00 AM", activity: "Climb stairs to the breathtaking Emerald Green Lagoon viewpoint (Talay Nai)" },
      { time: "12:00 PM", activity: "Indulge in a premium freshly cooked Thai buffet lunch served on board" },
      { time: "01:00 PM", activity: "Stop at Koh Wua Ta Lap. Climb 500m to the peak viewpoint or explore Lotus Cave" },
      { time: "03:00 PM", activity: "Depart back to Samui with coffee, tea, and sunset snacks on deck" },
      { time: "04:30 PM", activity: "Arrive at Nathon Pier and transfer directly back to your villa" }
    ],
    restrictions: [
      "Not recommended for pregnant women or individuals with severe back/heart conditions."
    ],
    whatToBring: ["Jungle walking shoes", "Swimwear", "Towel", "Dry change of clothes", "300 THB Cash for Park Admission"],
    options: [
      { name: "Full Tour: Sightseeing + Snorkeling + Kayaking", priceUsd: 54, priceThb: 1850 },
      { name: "Sightseeing + Snorkeling Only (No Kayak)", priceUsd: 38, priceThb: 1300 }
    ]
  },
  {
    id: "zipline-canopy",
    name: "Tree Bridge Rainforest Zipline Adventure",
    slogan: "Fly like a bird across 8 high-wire cables above Koh Samui's dense canopy.",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80",
    priceThb: 1800,
    priceUsd: 52,
    duration: "Half Day (Flexible slots)",
    recommendationTag: "High Adrenaline",
    inclusions: [
      "8 high-speed zipline cables across the jungle canopy",
      "Full high-grade safety gear (harness & helmet)",
      "Professional safety instruction guide team",
      "Round-trip hotel transfers directly to Maenam Soi 5",
      "Fresh tropical snacks & ice cold drinks",
      "Basic first-aid accident insurance"
    ],
    exclusions: [
      "Personal cameras (GoPro rentals available at treehouse base)"
    ],
    itinerary: [
      { time: "10:00 AM", activity: "Pick up from villa and off-road drive up Maenam Soi 5 hills" },
      { time: "10:30 AM", activity: "Safety brief, equipment fit-out, and forest trail walk with guides" },
      { time: "11:00 AM", activity: "Launch from first of 8 zipline cables. Glide over rivers, treetops, and valleys" },
      { time: "12:30 PM", activity: "Cool down at the Tree Bridge Waterfall and enjoy snacks & fresh fruit juices" },
      { time: "01:30 PM", activity: "Transfer back to your villa in high-clearance off-road vehicles" }
    ],
    whatToBring: ["Closed-toe sport shoes / sneakers", "Comfortable activewear", "Insect repellent", "Hair tie for long hair"],
    options: [
      { name: "Full Canopy Zipline Program (8 Cables)", priceUsd: 52, priceThb: 1800 }
    ]
  },
  {
    id: "jungle-safari",
    name: "Mr. Toon Jungle 4x4 Safari Tour",
    slogan: "Buckle up in an open-air 4x4 off-road truck for a thrilling island expedition.",
    image: "https://images.unsplash.com/photo-1608958416755-9856f4bc1e28?auto=format&fit=crop&w=800&q=80",
    priceThb: 1500,
    priceUsd: 44,
    duration: "Full Day (8:30 AM - 3:45 PM)",
    recommendationTag: "Cultural & Scenic",
    inclusions: [
      "Open-cabin off-road 4x4 safari vehicle transport",
      "Certified local tour guide (English speaking)",
      "Authentic Thai buffet lunch at mountaintop viewpoint",
      "Namuang Waterfall and temple entry tickets",
      "Cold bottled water and refreshments",
      "Accident travel insurance"
    ],
    exclusions: [
      "Personal elephant feeding bananas (optional, 100 THB)"
    ],
    itinerary: [
      { time: "08:30 AM", activity: "Pickup from villa in Mr. Toon's customized 4x4 off-road truck" },
      { time: "09:15 AM", activity: "Visit Wat Plai Laem (18-arm goddess statue) and Big Buddha Temple" },
      { time: "10:30 AM", activity: "Thrilling off-road climb up the steep ridges of Samui's highest peak" },
      { time: "11:30 AM", activity: "Visit Teepangkorn Temple (highest temple) and enjoy 360-degree ocean views" },
      { time: "12:30 PM", activity: "Enjoy a traditional buffet lunch at a majestic mountaintop restaurant" },
      { time: "01:30 PM", activity: "Descend into the mystical Magic Garden (tucked-away stone deities)" },
      { time: "02:15 PM", activity: "Enjoy a cooling dip in the freshwater pools of Namuang Waterfall 1" },
      { time: "03:00 PM", activity: "Visit Mummified Monk (Kunaram Temple) and Grandfather/Grandmother Rocks" },
      { time: "03:45 PM", activity: "Descent from mountains and secure drop-off directly to your villa" }
    ],
    whatToBring: ["Camera", "Comfortable clothes", "Walking shoes/sneakers", "Swimwear & towel for waterfall", "Sunscreen"],
    options: [
      { name: "Jungle 4x4 Grand Safari Tour (Full Day)", priceUsd: 44, priceThb: 1500 }
    ]
  },
  {
    id: "cooking-class",
    name: "Smiley Cook Thai Culinary Masterclass",
    slogan: "Learn the secrets of traditional Thai spices with a boutique local cooking class.",
    image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=800&q=80",
    priceThb: 2100,
    priceUsd: 60,
    duration: "Half Day (4 Hours)",
    recommendationTag: "Best Local Flavor",
    inclusions: [
      "Hands-on masterclass with certified Thai culinary teacher",
      "Market tour to select fresh herbs & premium spices",
      "Preparation of 4 customized dishes + 1 Thai dessert",
      "Communal gourmet dining setup to enjoy cooked food",
      "Digital recipe book, certificate, and ingredients",
      "Round-trip villa transfers (Chaweng, Lamai, Bophut, Maenam, Choengmon)"
    ],
    exclusions: [
      "Extra alcoholic beverages (BYOB allowed)"
    ],
    itinerary: [
      { time: "09:00 AM", activity: "Pickup from villa and transfer to the vibrant local fresh market" },
      { time: "09:30 AM", activity: "Educational tour: Select organic coconut, lemongrass, galangal, & fresh chilis" },
      { time: "10:00 AM", activity: "Arrive at cooking school. Receive welcoming herbal drinks & prep workstations" },
      { time: "10:30 AM", activity: "Hands-on preparation of curry pastes from scratch, followed by hot-wok cooking" },
      { time: "12:00 PM", activity: "Communal lunch feast: Eat the delicious dishes you've created with fellow classmates" },
      { time: "01:00 PM", activity: "Award of graduation certificates and air-con shuttle back to your villa" }
    ],
    whatToBring: ["Hungry appetite!", "Camera for food plating photos", "Flat comfortable shoes"],
    options: [
      { name: "Morning Masterclass & Market Tour (09:00 AM - 01:00 PM)", priceUsd: 60, priceThb: 2100 },
      { name: "Afternoon Sunset Masterclass (04:00 PM - 08:00 PM)", priceUsd: 60, priceThb: 2100 }
    ]
  }
];

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
  
  // Property Map states
  const [isPropertyMapOpen, setIsPropertyMapOpen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<"ground" | "upper">("ground");
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null);
  const [hoveredAmenity, setHoveredAmenity] = useState<string | null>(null);

  // Concierge tab modal
  const [activeTab, setActiveTab] = useState<"car" | "food" | "trip" | "spa" | "house" | null>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#car" || hash === "#car-rental" || hash.includes("car")) {
        return "car";
      } else if (hash === "#house" || hash.includes("house")) {
        return "house";
      }
    }
    return null;
  });
  
  // Tab local options
  const [selectedCar, setSelectedCar] = useState<string>("SUV (Toyota Fortuner) - $120/day");
  const [carDays, setCarDays] = useState<number>(3);
  const [selectedHouse, setSelectedHouse] = useState<string>("Luxury Beachfront Guest House - $450/day");
  const [houseDays, setHouseDays] = useState<number>(1);
  const [foodCart, setFoodCart] = useState<{ [key: string]: number }>({
    "Classic Pad Thai": 0,
    "Pineapple Fried Rice": 0,
    "Mango Sticky Rice": 0,
  });
  const [selectedTrip, setSelectedTrip] = useState<string>("pink-dolphin");
  const [selectedTripOptionIndex, setSelectedTripOptionIndex] = useState<number>(0);
  const [tripSubTab, setTripSubTab] = useState<"itinerary" | "inclusions" | "prep">("itinerary");
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

  // Handle hash change for quick navigation links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === "#car" || hash === "#car-rental" || hash.includes("car")) {
        setActiveTab("car");
      } else if (hash === "#food" || hash.includes("food")) {
        setActiveTab("food");
      } else if (hash === "#trip" || hash.includes("trip")) {
        setActiveTab("trip");
      } else if (hash === "#spa" || hash.includes("spa")) {
        setActiveTab("spa");
      } else if (hash === "#house" || hash.includes("house")) {
        setActiveTab("house");
      }
    };
    
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

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

  // --- REAL-TIME WEBSOCKET & LOCAL SUBSCRIPTIONS ---
  // Subscribes to database changes (via Supabase WebSockets or custom browser events) for real-time reactivity
  useEffect(() => {
    if (!booking) return;

    // 1. Subscribe to Messages in Real-Time
    const unsubscribeMessages = dbService.subscribeToMessages(bookingCode, (newMsg) => {
      setChatMessages((prev) => {
        const exists = prev.some((m) => m.id === newMsg.id);
        if (exists) {
          // Update existing (e.g. if updated by host)
          return prev.map((m) => m.id === newMsg.id ? newMsg : m);
        }
        // Append new message
        return [...prev, newMsg];
      });
    });

    // 2. Subscribe to Concierge Requests in Real-Time
    const unsubscribeRequests = dbService.subscribeToRequests(bookingCode, (req, eventType, oldId) => {
      setBookedServices((prev) => {
        if (eventType === "INSERT") {
          const exists = prev.some((r) => r.id === req.id);
          if (exists) return prev;
          return [req, ...prev];
        } else if (eventType === "UPDATE") {
          return prev.map((r) => r.id === req.id ? req : r);
        } else if (eventType === "DELETE") {
          return prev.filter((r) => r.id !== (oldId || req.id));
        }
        return prev;
      });
    });

    // 3. Gentle background reconciliation fallback (polls every 8 seconds as a safety net)
    const interval = setInterval(async () => {
      try {
        const [latestMsgs, latestReqs] = await Promise.all([
          dbService.getMessages(bookingCode),
          dbService.getRequests(bookingCode)
        ]);

        if (JSON.stringify(latestMsgs) !== JSON.stringify(chatMessages)) {
          setChatMessages(latestMsgs);
        }
        if (JSON.stringify(latestReqs) !== JSON.stringify(bookedServices)) {
          setBookedServices(latestReqs);
        }
      } catch (err) {
        console.warn("Reconciliation fetch failed:", err);
      }
    }, 8000);

    return () => {
      unsubscribeMessages();
      unsubscribeRequests();
      clearInterval(interval);
    };
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
  const formatSamuiTime = () => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const samuiTime = new Date(utc + 3600000 * 7);
    return samuiTime.toLocaleTimeString("en-US", {
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
      // Split to clean up name for display
      const cleanCarName = selectedCar.split(" • ")[0] || selectedCar;
      title = `${cleanCarName} Rental`;
      detail = `${carDays} Day${carDays > 1 ? "s" : ""} • Delivered to Villa Port`;
      
      let dailyPrice = 25;
      if (selectedCar.includes("Vespa")) dailyPrice = 35;
      else if (selectedCar.includes("Fortuner") || selectedCar.includes("SUV")) dailyPrice = 120;
      else if (selectedCar.includes("Boxster")) dailyPrice = 250;
      else if (selectedCar.includes("S-Class")) dailyPrice = 350;
      else if (selectedCar.includes("Ghost")) dailyPrice = 850;
      
      price = `$${dailyPrice * carDays}`;
    } else if (activeTab === "house") {
      const cleanHouseName = selectedHouse.split(" • ")[0] || selectedHouse;
      title = `House Reservation: ${cleanHouseName}`;
      detail = `${houseDays} Day${houseDays > 1 ? "s" : ""} • Exclusive Guest/House Privilege`;
      
      let dailyPrice = 450;
      if (selectedHouse.includes("Penthouse")) dailyPrice = 650;
      else if (selectedHouse.includes("Pool Villa")) dailyPrice = 800;
      else if (selectedHouse.includes("President")) dailyPrice = 1200;
      
      price = `$${dailyPrice * houseDays}`;
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
      const excursion = EXCURSIONS.find(e => e.id === selectedTrip) || EXCURSIONS[0];
      const option = excursion.options[selectedTripOptionIndex] || excursion.options[0];
      title = `Excursion: ${excursion.name}`;
      detail = `${option.name} • ${tripGuests} Guests`;
      price = `$${option.priceUsd * tripGuests}`;
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
      name: "Fisherman's Village Cafe",
      category: "Artisanal Coffee & Bakery",
      desc: "Charming seaside cafe in Koh Samui's iconic Fisherman's Village. Handcrafted cold brews, fresh coconut tarts, and local desserts with ocean views.",
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
              <p id="guest-portal-location" className="text-sm font-bold">Koh Samui, Thailand</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>{tempUnit === "C" ? "29°C" : "84°F"}</span>
              <span> • </span>
              <span className="font-mono text-gray-500 font-semibold">{formatSamuiTime()}</span>
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
            <div className="flex justify-between items-center mb-3">
              <span className="px-3 py-1 bg-[#2D5A27] text-white text-[10px] rounded-full font-bold uppercase tracking-wider inline-block shadow-sm">
                Stay Essentials
              </span>
              <button 
                onClick={() => setIsPropertyMapOpen(true)}
                className="px-2.5 py-1.5 bg-white hover:bg-gray-50 text-[#2D5A27] text-[10px] rounded-full font-black uppercase tracking-wider flex items-center gap-1.5 border border-[#2D5A27]/20 shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Map className="w-3.5 h-3.5" /> Villa Map
              </button>
            </div>

            <div className="relative w-full h-36 rounded-2xl overflow-hidden my-3 border border-[#2D5A27]/10 shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80" 
                alt="Luxury Beachfront Resort Villa" 
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-[#2D5A27]/90 backdrop-blur-sm rounded-full text-white text-[9px] font-black uppercase tracking-wider shadow">
                Our Private Oasis
              </div>
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

              <button 
                onClick={() => setActiveTab("house")}
                className="col-span-2 bg-indigo-50/70 hover:bg-indigo-55 rounded-2xl p-3 flex items-center justify-between px-4 border border-indigo-100/20 hover:scale-[1.01] transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center shadow-inner flex-shrink-0">
                    <Home className="w-4.5 h-4.5 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-800">Luxury House Booking</p>
                    <p className="text-[9px] text-gray-400 font-medium">Rent Beach Houses, Penthouses & Pool Villas</p>
                  </div>
                </div>
                <div className="bg-indigo-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm">
                  1 Day +
                </div>
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
                      {req.category === "house" && <Home className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
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
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" 
                  alt="Host Sunny" 
                  className="w-9 h-9 rounded-full object-cover border border-white/10 shadow-sm"
                  referrerPolicy="no-referrer"
                />
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
                    <img 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" 
                      alt="Host Sunny" 
                      className="w-7 h-7 rounded-full object-cover border border-gray-700/50 flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
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
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80" 
                  alt="Host Sunny typing" 
                  className="w-7 h-7 rounded-full object-cover border border-gray-700/50 flex-shrink-0 animate-pulse"
                  referrerPolicy="no-referrer"
                />
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

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button 
              onClick={handleEmergencyCallStart}
              className="flex-1 p-3.5 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-center text-xs font-bold shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5 animate-pulse"
            >
              <Phone className="w-4 h-4" /> Call Hotline
            </button>
            <button 
              onClick={() => {
                setSelectedFloor("ground");
                setSelectedAmenity("exit_foyer");
                setIsPropertyMapOpen(true);
              }}
              className="px-3.5 py-3.5 bg-white hover:bg-red-50 text-red-600 rounded-2xl text-center text-xs font-bold border border-red-100 shadow-sm hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-1"
              title="View Evacuation & Fire Exits Map"
            >
              <Map className="w-4 h-4" />
              <span>Evac Map</span>
            </button>
          </div>
        </section>

        {/* WIDGET G: Live Google Grounded Local Discoveries */}
        <LocalDiscoveries />

      </main>

      {/* MODAL OVERLAYS */}
      
      {/* 1. CONCIERGE BOOKING SLIDE-IN MODALS */}
      {activeTab && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className={`bg-white rounded-[2rem] w-full p-6 relative border border-black/5 shadow-2xl animate-scaleUp overflow-y-auto max-h-[90vh] ${activeTab === "trip" ? "max-w-4xl" : "max-w-lg"}`}>
            
            <button 
              onClick={() => setActiveTab(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {activeTab === "car" && (
              <div>
                <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-black/5 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&w=500&q=80" 
                    alt="Car & Scooter Rental" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="bg-orange-100 text-orange-700 text-[10px] uppercase font-bold px-3 py-1 rounded-full">Car & Scooter Rental</span>
                <h3 className="text-xl font-bold text-gray-800 mt-2">Rent a Vehicle</h3>
                <p className="text-xs text-gray-500 mt-1">Explore Koh Samui island with fully insured vehicles delivered directly to the villa.</p>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Select Vehicle Model</label>
                    <select 
                      value={selectedCar} 
                      onChange={(e) => setSelectedCar(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-800 mt-1.5 focus:outline-none"
                    >
                      <option value="Scooter (Honda Click 125i) • $25/day">Scooter (Honda Click 125i) • $25/day</option>
                      <option value="Scooter (Vespa Sprint 150) • $35/day">Scooter (Vespa Sprint 150) • $35/day</option>
                      <option value="SUV (Toyota Fortuner) • $120/day">SUV (Toyota Fortuner) • $120/day</option>
                      <option value="Convertible (Porsche Boxster) • $250/day">Convertible (Porsche Boxster) • $250/day</option>
                      <option value="Privilege Car (Mercedes S-Class) • $350/day">Privilege Car (Mercedes S-Class) • $350/day</option>
                      <option value="Privilege Car (Rolls-Royce Ghost) • $850/day">Privilege Car (Rolls-Royce Ghost) • $850/day</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Rental Duration</label>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button 
                        type="button"
                        onClick={() => setCarDays(d => Math.max(1, d - 1))}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-10 h-10 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center text-lg"
                      >
                        -
                      </button>
                      <span className="font-bold text-base text-gray-800 w-16 text-center">{carDays} Day{carDays > 1 ? "s" : ""}</span>
                      <button 
                        type="button"
                        onClick={() => setCarDays(d => d + 1)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-10 h-10 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Estimated Live Subtotal pricing */}
                  {(() => {
                    let dailyPrice = 25;
                    if (selectedCar.includes("Vespa")) dailyPrice = 35;
                    else if (selectedCar.includes("Fortuner") || selectedCar.includes("SUV")) dailyPrice = 120;
                    else if (selectedCar.includes("Boxster")) dailyPrice = 250;
                    else if (selectedCar.includes("S-Class")) dailyPrice = 350;
                    else if (selectedCar.includes("Ghost")) dailyPrice = 850;

                    return (
                      <div className="mt-4 pt-3.5 border-t border-gray-150 flex justify-between items-center bg-orange-50/40 p-3.5 rounded-2xl border border-orange-100/25">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-orange-800">Booking Privilege Subtotal</p>
                          <p className="text-[10px] text-gray-500 font-medium font-sans">${dailyPrice} × {carDays} Day{carDays > 1 ? "s" : ""}</p>
                        </div>
                        <p className="text-xl font-black text-orange-600">${dailyPrice * carDays}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {activeTab === "food" && (
              <div>
                <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-black/5 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1626804475315-00c47fc762d4?auto=format&fit=crop&w=500&q=80" 
                    alt="In-Villa Room Service" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
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

            {activeTab === "trip" && (() => {
              const excursion = EXCURSIONS.find(e => e.id === selectedTrip) || EXCURSIONS[0];
              const selectedOption = excursion.options[selectedTripOptionIndex] || excursion.options[0];
              const totalThb = selectedOption.priceThb * tripGuests;
              const totalUsd = selectedOption.priceUsd * tripGuests;

              return (
                <div className="flex flex-col">
                  {/* Top Header */}
                  <div className="mb-4 border-b border-gray-100 pb-3">
                    <span className="bg-purple-100 text-purple-700 text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full">
                      Koh Samui Excursions
                    </span>
                    <h3 className="text-xl font-black text-gray-800 mt-1.5">Book a Premium Island Excursion</h3>
                    <p className="text-xs text-gray-500">
                      Curated adventure and culture trips with certified guides and full private villa transfers.
                    </p>
                  </div>

                  {/* Main Grid Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {/* Left Column - Excursions List */}
                    <div className="md:col-span-2 space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Select an Adventure</p>
                      {EXCURSIONS.map((t) => {
                        const isActive = t.id === selectedTrip;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => {
                              setSelectedTrip(t.id);
                              setSelectedTripOptionIndex(0); // Reset option index on switch
                            }}
                            className={`w-full text-left p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                              isActive
                                ? "border-[#2D5A27] bg-[#2D5A27]/5 shadow-sm"
                                : "border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200"
                            }`}
                          >
                            <img
                              src={t.image}
                              alt={t.name}
                              className="w-12 h-12 rounded-xl object-cover border border-black/5 flex-shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#2D5A27] bg-[#2D5A27]/10 px-1.5 py-0.5 rounded">
                                {t.recommendationTag}
                              </span>
                              <h4 className="text-xs font-black text-gray-800 truncate leading-tight mt-1">
                                {t.name}
                              </h4>
                              <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                                From ฿{t.options[0].priceThb.toLocaleString()} (~${t.options[0].priceUsd})
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Column - Detail Panel */}
                    <div className="md:col-span-3 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-5 max-h-[380px] overflow-y-auto pr-1">
                      <div>
                        {/* Hero Image & Slogan */}
                        <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-3.5 border border-black/5 shadow-inner">
                          <img
                            src={excursion.image}
                            alt={excursion.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3">
                            <h4 className="text-white text-xs font-black drop-shadow">{excursion.name}</h4>
                            <p className="text-white/90 text-[10px] leading-snug truncate drop-shadow">{excursion.slogan}</p>
                          </div>
                        </div>

                        {/* Interactive Info Sub-tabs */}
                        <div className="flex border-b border-gray-100 mb-3 gap-1">
                          {(["itinerary", "inclusions", "prep"] as const).map((tab) => {
                            const isTabActive = tripSubTab === tab;
                            const label =
                              tab === "itinerary"
                                ? "Itinerary"
                                : tab === "inclusions"
                                ? "Inclusions"
                                : "Useful Info";
                            return (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => setTripSubTab(tab)}
                                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider border-b-2 text-center transition-all cursor-pointer ${
                                  isTabActive
                                    ? "border-[#2D5A27] text-[#2D5A27]"
                                    : "border-transparent text-gray-400 hover:text-gray-600"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>

                        {/* Sub-tab content view */}
                        <div className="max-h-36 overflow-y-auto mb-4 bg-gray-50/70 p-3 rounded-2xl border border-black/[0.02]">
                          {tripSubTab === "itinerary" && (
                            <div className="space-y-3">
                              {excursion.itinerary.map((step, idx) => (
                                <div key={idx} className="flex gap-2.5 items-start">
                                  <span className="font-mono text-[9px] font-black text-[#2D5A27] bg-white border border-[#2D5A27]/20 px-2 py-0.5 rounded-md flex-shrink-0 shadow-sm">
                                    {step.time}
                                  </span>
                                  <p className="text-[11px] text-gray-600 leading-tight pt-0.5">
                                    {step.activity}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {tripSubTab === "inclusions" && (
                            <div className="space-y-2">
                              <p className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-800">✓ Package Includes:</p>
                              <div className="grid grid-cols-1 gap-1">
                                {excursion.inclusions.map((inc, idx) => (
                                  <div key={idx} className="flex items-start gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-[11px] text-gray-600 leading-snug">{inc}</span>
                                  </div>
                                ))}
                              </div>
                              {excursion.exclusions && excursion.exclusions.length > 0 && (
                                <div className="mt-3 pt-2 border-t border-gray-200/50">
                                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-rose-800">✗ Package Excludes:</p>
                                  <div className="mt-1 space-y-1">
                                    {excursion.exclusions.map((exc, idx) => (
                                      <div key={idx} className="flex items-start gap-1.5">
                                        <X className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-[11px] text-gray-500 leading-snug">{exc}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {tripSubTab === "prep" && (
                            <div className="space-y-2.5">
                              {excursion.whatToBring && (
                                <div>
                                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-blue-800">🎒 What to Bring:</p>
                                  <ul className="list-disc pl-4 mt-1 space-y-1">
                                    {excursion.whatToBring.map((item, idx) => (
                                      <li key={idx} className="text-[11px] text-gray-600 leading-snug">
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {excursion.restrictions && (
                                <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-start gap-2 mt-1.5">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-[9px] font-extrabold text-amber-800 uppercase tracking-wide">Important Safety Notice</p>
                                    <p className="text-[10px] text-amber-700 mt-0.5 leading-snug font-medium">
                                      {excursion.restrictions[0]}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Booking Options Form */}
                        <div className="space-y-3 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
                          {excursion.options.length > 1 && (
                            <div>
                              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">Select Excursion Option</label>
                              <select
                                value={selectedTripOptionIndex}
                                onChange={(e) => setSelectedTripOptionIndex(Number(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-bold text-gray-800 mt-1 focus:outline-none"
                              >
                                {excursion.options.map((opt, oIdx) => (
                                  <option key={oIdx} value={oIdx}>
                                    {opt.name} • ฿{opt.priceThb.toLocaleString()} (~${opt.priceUsd})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <label className="text-[9px] font-black uppercase tracking-wider text-gray-400">Total Guests</label>
                              <div className="flex items-center gap-2 mt-1">
                                <button
                                  type="button"
                                  onClick={() => setTripGuests(g => Math.max(1, g - 1))}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-lg font-black transition-all cursor-pointer flex items-center justify-center text-xs"
                                >
                                  -
                                </button>
                                <span className="font-extrabold text-xs text-gray-800 w-12 text-center">
                                  {tripGuests} Guest{tripGuests > 1 ? "s" : ""}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setTripGuests(g => g + 1)}
                                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-8 h-8 rounded-lg font-black transition-all cursor-pointer flex items-center justify-center text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">Subtotal Price</p>
                              <p className="text-sm font-black text-[#2D5A27] mt-0.5">
                                ฿{totalThb.toLocaleString()}
                              </p>
                              <p className="text-[10px] text-gray-500 font-mono">
                                (~${totalUsd} USD)
                              </p>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeTab === "spa" && (
              <div>
                <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-black/5 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80" 
                    alt="In-Villa Wellness Spa" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
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

            {activeTab === "house" && (
              <div>
                <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-4 border border-black/5 shadow-sm">
                  <img 
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=500&q=80" 
                    alt="Luxury Guest House Rental" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-bold px-3 py-1 rounded-full">Luxury Guest Houses & Villas</span>
                <h3 className="text-xl font-bold text-gray-800 mt-2">Book an Exclusive Luxury House</h3>
                <p className="text-xs text-gray-500 mt-1">Reserve a magnificent private residence, guest house, or penthouse for 1 day or more with full premium VIP services included.</p>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Select House Model</label>
                    <select 
                      value={selectedHouse} 
                      onChange={(e) => setSelectedHouse(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-bold text-gray-800 mt-1.5 focus:outline-none"
                    >
                      <option value="Luxury Beachfront Guest House • $450/day">Luxury Beachfront Guest House • $450/day</option>
                      <option value="Hilltop Scenic Penthouse • $650/day">Hilltop Scenic Penthouse • $650/day</option>
                      <option value="Exclusive Private Pool Villa • $800/day">Exclusive Private Pool Villa • $800/day</option>
                      <option value="Chowrest Presidential Mansion • $1200/day">Chowrest Presidential Mansion • $1200/day</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-gray-400">Reservation Duration</label>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button 
                        type="button"
                        onClick={() => setHouseDays(d => Math.max(1, d - 1))}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-10 h-10 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center text-lg animate-fadeIn"
                      >
                        -
                      </button>
                      <span className="font-bold text-base text-gray-800 w-16 text-center">{houseDays} Day{houseDays > 1 ? "s" : ""}</span>
                      <button 
                        type="button"
                        onClick={() => setHouseDays(d => d + 1)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 w-10 h-10 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center text-lg animate-fadeIn"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* House Estimated Live Subtotal Pricing */}
                  {(() => {
                    let dailyPrice = 450;
                    if (selectedHouse.includes("Penthouse")) dailyPrice = 650;
                    else if (selectedHouse.includes("Pool Villa")) dailyPrice = 800;
                    else if (selectedHouse.includes("President")) dailyPrice = 1200;

                    return (
                      <div className="mt-4 pt-3.5 border-t border-gray-150 flex justify-between items-center bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-100/25">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-800">Privilege House Subtotal</p>
                          <p className="text-[10px] text-gray-500 font-medium font-sans">${dailyPrice} × {houseDays} Day{houseDays > 1 ? "s" : ""}</p>
                        </div>
                        <p className="text-xl font-black text-indigo-600 font-mono">${dailyPrice * houseDays}</p>
                      </div>
                    );
                  })()}
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

      {/* 5. PROPERTY MAP MODAL */}
      {isPropertyMapOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] w-full max-w-5xl p-6 md:p-8 relative border border-black/5 shadow-2xl animate-scaleUp max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-6">
              <div>
                <span className="bg-[#E9F0E8] text-[#2D5A27] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 w-fit">
                  <Map className="w-3.5 h-3.5" /> Villa Navigation
                </span>
                <h2 className="text-xl md:text-2xl font-black mt-2 text-[#1A1A1A] tracking-tight">Interactive Villa Layout & Map</h2>
                <p className="text-xs text-gray-500 mt-1 font-medium">Click on any hotspot room, amenity, or safety exit on the blueprint to view detailed guidelines.</p>
              </div>
              <button 
                onClick={() => {
                  setIsPropertyMapOpen(false);
                  setSelectedAmenity(null);
                }}
                className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2.5 rounded-full transition-all cursor-pointer"
                title="Close Map"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content container with responsive layout */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 pr-1 scrollbar-thin">
              
              {/* Left Column: Legend and Details (Col Span 5) */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                
                {/* Floor Switcher */}
                <div className="bg-gray-100/80 p-1.5 rounded-2xl flex border border-black/[0.03]">
                  <button 
                    onClick={() => {
                      setSelectedFloor("ground");
                      setSelectedAmenity(null);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedFloor === "ground" 
                        ? "bg-white text-[#2D5A27] shadow-sm font-black" 
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Ground & Outdoors</span>
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedFloor("upper");
                      setSelectedAmenity(null);
                    }}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selectedFloor === "upper" 
                        ? "bg-white text-[#2D5A27] shadow-sm font-black" 
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Upper Level Floor</span>
                  </button>
                </div>

                {/* Directory list of elements */}
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Key Amenities & Safety Items</h3>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                    
                    {selectedFloor === "ground" ? (
                      <>
                        {[
                          { id: "pool", label: "Infinity Pool & Terrace", type: "amenity" },
                          { id: "parking", label: "Covered Parking & EV Charging", type: "amenity" },
                          { id: "lounge", label: "Main Living Lounge", type: "amenity" },
                          { id: "guest_suite_1", label: "Ground Guest Suite 1", type: "amenity" },
                          { id: "kitchen", label: "Kitchen & Gas Shutoff Valve", type: "utility" },
                          { id: "first_aid", label: "First Aid & Foyer Station", type: "safety" },
                          { id: "exit_foyer", label: "Primary Exit A (Foyer Door)", type: "exit" },
                          { id: "exit_terrace", label: "Secondary Exit B (Terrace Door)", type: "exit" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedAmenity(item.id)}
                            onMouseEnter={() => setHoveredAmenity(item.id)}
                            onMouseLeave={() => setHoveredAmenity(null)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                              selectedAmenity === item.id 
                                ? "bg-[#2D5A27]/10 text-[#2D5A27] border-[#2D5A27]/25" 
                                : hoveredAmenity === item.id
                                ? "bg-gray-50 border-gray-200"
                                : "bg-transparent border-transparent text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span className={`w-2 h-2 rounded-full ${
                                item.type === "exit" 
                                  ? "bg-emerald-500" 
                                  : item.type === "safety" 
                                  ? "bg-red-500" 
                                  : item.type === "utility" 
                                  ? "bg-amber-500" 
                                  : "bg-sky-500"
                              }`} />
                              <span className="truncate">{item.label}</span>
                            </span>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">
                              {item.type}
                            </span>
                          </button>
                        ))}
                      </>
                    ) : (
                      <>
                        {[
                          { id: "master_suite", label: "Master Ocean Suite", type: "amenity" },
                          { id: "guest_suite_2", label: "Upper Guest Suite 2", type: "amenity" },
                          { id: "bath", label: "Master Bath & Jacuzzi", type: "amenity" },
                          { id: "exit_stairs", label: "Staircase & Upper Exit C", type: "exit" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedAmenity(item.id)}
                            onMouseEnter={() => setHoveredAmenity(item.id)}
                            onMouseLeave={() => setHoveredAmenity(null)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                              selectedAmenity === item.id 
                                ? "bg-[#2D5A27]/10 text-[#2D5A27] border-[#2D5A27]/25" 
                                : hoveredAmenity === item.id
                                ? "bg-gray-50 border-gray-200"
                                : "bg-transparent border-transparent text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <span className={`w-2 h-2 rounded-full ${
                                item.type === "exit" 
                                  ? "bg-emerald-500" 
                                  : item.type === "safety" 
                                  ? "bg-red-500" 
                                  : "bg-sky-500"
                              }`} />
                              <span className="truncate">{item.label}</span>
                            </span>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-gray-400 px-1.5 py-0.5 bg-gray-100 rounded">
                              {item.type}
                            </span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </div>

                {/* Live Details Card */}
                <div className="flex-1 bg-gray-50/80 border border-black/[0.03] rounded-3xl p-5 flex flex-col justify-between min-h-[220px]">
                  {selectedAmenity ? (() => {
                    // Inline details helper inside modal JSX to keep things super tidy and scoped
                    const getAmenityDetails = (id: string) => {
                      switch(id) {
                        case "pool":
                          return {
                            title: "Infinity Pool & Terrace",
                            badge: "Outdoors / Leisure",
                            badgeColor: "bg-sky-100 text-sky-800",
                            desc: "A magnificent 12m salt-water infinity pool with panoramic views of Bophut Bay.",
                            tips: [
                              "Operating Hours: 06:00 AM – 10:00 PM.",
                              "Strictly NO glass drinkware near the pool deck (premium acrylic tumblers are provided in the kitchen cabinets).",
                              "An emergency flotation ring is mounted on the wooden pillar beside the sunbeds."
                            ]
                          };
                        case "parking":
                          return {
                            title: "Private Carport & Entry",
                            badge: "Entrance / Security",
                            badgeColor: "bg-slate-100 text-slate-800",
                            desc: "Secured covered parking area with automatic electronic sliding gate.",
                            tips: [
                              "Space is suitable for up to 2 large SUVs or 1 SUV and 4 scooters.",
                              "Gate opens automatically on approach from the inside; enter gate PIN on the external keypad to gain access from the outside.",
                              "Includes an EV Type-2 charger mounted on the right brick pillar."
                            ]
                          };
                        case "exit_foyer":
                          return {
                            title: "Primary Fire Exit A (Foyer)",
                            badge: "Safety / Fire Route",
                            badgeColor: "bg-emerald-100 text-emerald-800",
                            desc: "The primary escape route on the ground level, leading directly from the main corridor foyer out to the open-air carport.",
                            tips: [
                              "Fitted with a manual deadbolt lock and quick-release interior thumb-turn latch.",
                              "A 6kg dry-chemical fire extinguisher is mounted inside the primary foyer entry closet.",
                              "An automated emergency LED floodlight is located above this door and will activate in power outages."
                            ]
                          };
                        case "exit_terrace":
                          return {
                            title: "Secondary Fire Exit B (Terrace)",
                            badge: "Safety / Fire Route",
                            badgeColor: "bg-emerald-100 text-emerald-800",
                            desc: "The secondary escape route, exiting the living lounge area through the heavy slide-open panoramic glass doors onto the open-air sun terrace.",
                            tips: [
                              "Provides quick access to the beachfront egress gates and outdoor garden paths.",
                              "Please ensure the heavy sliding glass doors are fully unlocked and sliding tracks are kept clear of debris.",
                              "A portable dry-chemical fire extinguisher is stored in the low cabinet near the BBQ pit."
                            ]
                          };
                        case "kitchen":
                          return {
                            title: "Kitchen & Dining Area",
                            badge: "Indoors / Utilities",
                            badgeColor: "bg-amber-100 text-amber-800",
                            desc: "Fully equipped western gourmet kitchen with modern induction cooktops and built-in appliances.",
                            tips: [
                              "The main electrical breaker panel is located behind the wooden service door under the staircase corridor.",
                              "A heavy-duty fire blanket and a specialized kitchen fire extinguisher are mounted on the wall inside the walk-in pantry.",
                              "Fitted with active photoelectric smoke detectors and smart carbon monoxide alarm sensors."
                            ]
                          };
                        case "first_aid":
                          return {
                            title: "First Aid & Foyer Console",
                            badge: "Medical / Support",
                            badgeColor: "bg-red-100 text-red-800",
                            desc: "Central hallway console between the main entrance and the staircase landing.",
                            tips: [
                              "A comprehensive, fully stocked professional First Aid medical kit is kept in the upper-left drawer of the wooden console cabinet.",
                              "Emergency local contact numbers and hospital coordinates are printed on the back of the cabinet lid.",
                              "Main key hooks for guest scooters are also located on the console wall."
                            ]
                          };
                        case "lounge":
                          return {
                            title: "Main Living Lounge",
                            badge: "Indoors / Living",
                            badgeColor: "bg-indigo-100 text-indigo-800",
                            desc: "A wide, double-height open-plan living room space with a smart television, Sonos soundbar, and panoramic ocean vistas.",
                            tips: [
                              "Air conditioning shuts off automatically if the patio doors remain open for more than 3 minutes.",
                              "Fitted with a smoke detector linked to the primary villa warning system."
                            ]
                          };
                        case "guest_suite_1":
                          return {
                            title: "Ground Guest Suite 1",
                            badge: "Indoors / Bedroom",
                            badgeColor: "bg-[#2D5A27]/20 text-[#2D5A27]",
                            desc: "Ground-floor en-suite guest bedroom featuring direct access to the garden and pool deck.",
                            tips: [
                              "An emergency LED torch/flashlight is plugged into the socket beside the bedside table (automatically charges and lights up during power failures).",
                              "Includes a digital electronic safe inside the main wardrobe closet."
                            ]
                          };
                        case "master_suite":
                          return {
                            title: "Master Ocean Suite",
                            badge: "Upper Level / Bedroom",
                            badgeColor: "bg-indigo-100 text-indigo-800",
                            desc: "Magnificent upper-level primary master bedroom overlooking the bay with a private wrap-around balcony.",
                            tips: [
                              "Features a walk-in wardrobe, en-suite double rain shower, and outdoor jacuzzi tub.",
                              "Equipped with emergency panic buttons on either side of the bed headboard that connect directly to the main security house.",
                              "Two emergency LED flashlights are located in the drawer under the bedside console."
                            ]
                          };
                        case "guest_suite_2":
                          return {
                            title: "Upper Guest Suite 2",
                            badge: "Upper Level / Bedroom",
                            badgeColor: "bg-violet-100 text-violet-800",
                            desc: "Spacious upper-floor guest suite featuring en-suite amenities and beautiful sunset mountain views.",
                            tips: [
                              "Includes an electronic closet safety deposit box for valuables.",
                              "An emergency LED flashlight is kept in the bedside drawer."
                            ]
                          };
                        case "exit_stairs":
                          return {
                            title: "Staircase & Upper Exit C",
                            badge: "Safety / Upper Route",
                            badgeColor: "bg-emerald-100 text-emerald-800",
                            desc: "The primary safety egress for the upper level, leading down the main timber staircase directly to the ground level entrance foyer and Exit A.",
                            tips: [
                              "Equipped with dual stairways light switches and illuminated anti-slip stair nosing.",
                              "An additional dry-powder fire extinguisher is securely mounted on the hallway wall at the top of the landing.",
                              "Please keep the staircase landing and stairs completely clear of suitcases or personal items."
                            ]
                          };
                        case "bath":
                          return {
                            title: "Master Bath & Jacuzzi",
                            badge: "Upper Level / Bathroom",
                            badgeColor: "bg-sky-100 text-sky-800",
                            desc: "Luxury master bathroom equipped with panoramic windows, double vanity, and a premium jacuzzi overlooking the ocean.",
                            tips: [
                              "Water temperature control features a safety anti-scald limit set at 38°C.",
                              "Jacuzzi filtration controls should only be adjusted using the waterproof smart keypad on the wall."
                            ]
                          };
                        default:
                          return null;
                      }
                    };

                    const details = getAmenityDetails(selectedAmenity);
                    if (!details) return null;
                    return (
                      <div className="h-full flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center mb-2.5">
                            <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full ${details.badgeColor}`}>
                              {details.badge}
                            </span>
                          </div>
                          <h4 className="text-base font-black text-gray-800 tracking-tight leading-tight">{details.title}</h4>
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed font-semibold">
                            {details.desc}
                          </p>
                          <div className="mt-4 space-y-2">
                            {details.tips.map((tip, i) => (
                              <div key={i} className="flex gap-2 text-[11px] text-gray-600 leading-normal">
                                <span className="text-[#2D5A27] font-black mt-0.5">•</span>
                                <span className="font-sans font-medium">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="text-[9px] text-gray-400 mt-4 border-t border-gray-100 pt-3 font-semibold flex items-center gap-1">
                          <Info className="w-3 h-3 text-[#2D5A27] flex-shrink-0" />
                          <span>Always read the full house manuals prior to operating any devices.</span>
                        </p>
                      </div>
                    );
                  })() : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                      <Compass className="w-10 h-10 text-gray-300 animate-spin" style={{ animationDuration: "12s" }} />
                      <p className="text-xs font-black text-gray-500 mt-3">Select a hotspot on the layout</p>
                      <p className="text-[10px] text-gray-400 mt-1 leading-normal px-4">
                        Hover or click rooms or visual safety badges on the right diagram to reveal specific operational notes and emergency tips.
                      </p>
                    </div>
                  )}
                </div>

              </div>

              {/* Right Column: Dynamic SVG Blueprint Plan (Col Span 7) */}
              <div className="lg:col-span-7 bg-slate-50 border border-slate-100 rounded-[2rem] p-4 flex items-center justify-center overflow-hidden min-h-[350px] md:min-h-[420px] shadow-inner">
                {selectedFloor === "ground" ? (
                  <svg viewBox="0 0 800 500" className="w-full h-auto max-h-[450px] select-none">
                    <defs>
                      <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E8F0" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" rx="16" />

                    {/* Sandy Beach Area */}
                    <path d="M 0,0 L 140,0 L 140,500 L 0,500 Z" fill="#FEF3C7" opacity="0.3" />
                    <text x="70" y="270" fill="#D97706" className="text-[10px] font-black uppercase tracking-widest rotate-270 opacity-30 text-center text-anchor-middle">Beachfront Line</text>

                    {/* Sun Deck (Outdoors) */}
                    <rect x="140" y="40" width="160" height="420" fill="#F1F5F9" rx="12" stroke="#CBD5E1" strokeWidth="1.5" />
                    <text x="220" y="70" fill="#94A3B8" className="text-[9px] font-black uppercase tracking-widest text-anchor-middle">Outdoor Sun Terrace</text>

                    {/* Infinity Pool */}
                    <rect 
                      x="165" y="110" width="110" height="280" 
                      fill={selectedAmenity === "pool" || hoveredAmenity === "pool" ? "#BAE6FD" : "#E0F2FE"} 
                      rx="16" 
                      stroke={selectedAmenity === "pool" ? "#0284C7" : "#38BDF8"} 
                      strokeWidth="2.5"
                      className="transition-all cursor-pointer hover:fill-[#BAE6FD]"
                      onClick={() => setSelectedAmenity("pool")}
                      onMouseEnter={() => setHoveredAmenity("pool")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    />
                    <text x="220" y="250" fill="#0369A1" className="text-xs font-black uppercase tracking-widest rotate-270 pointer-events-none text-anchor-middle">Infinity Pool</text>
                    <path d="M 180,150 Q 195,145 210,150 T 240,150 T 260,150" fill="none" stroke="#7DD3FC" strokeWidth="1.5" opacity="0.6" />
                    <path d="M 180,290 Q 195,285 210,290 T 240,290 T 260,290" fill="none" stroke="#7DD3FC" strokeWidth="1.5" opacity="0.6" />

                    {/* Indoor Villa Walls Outer boundary */}
                    <rect x="300" y="40" width="340" height="420" fill="#FFFFFF" rx="20" stroke="#334155" strokeWidth="4" />

                    {/* Indoor Rooms and partitions */}
                    {/* Kitchen and dining room */}
                    <rect 
                      x="300" y="40" width="180" height="190" 
                      fill={selectedAmenity === "kitchen" || hoveredAmenity === "kitchen" ? "#F8FAFC" : "transparent"} 
                      stroke="#E2E8F0" strokeWidth="1.5"
                      className="transition-all cursor-pointer hover:fill-slate-50"
                      onClick={() => setSelectedAmenity("kitchen")}
                      onMouseEnter={() => setHoveredAmenity("kitchen")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    />
                    <text x="390" y="100" fill="#475569" className="text-xs font-bold text-center text-anchor-middle pointer-events-none">Dining & Kitchen</text>

                    {/* Living Lounge */}
                    <rect 
                      x="300" y="230" width="180" height="230" 
                      fill={selectedAmenity === "lounge" || hoveredAmenity === "lounge" ? "#F8FAFC" : "transparent"} 
                      stroke="#E2E8F0" strokeWidth="1.5"
                      className="transition-all cursor-pointer hover:fill-slate-50"
                      onClick={() => setSelectedAmenity("lounge")}
                      onMouseEnter={() => setHoveredAmenity("lounge")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    />
                    <text x="390" y="350" fill="#475569" className="text-xs font-bold text-center text-anchor-middle pointer-events-none">Living Lounge</text>

                    {/* Guest Bedroom 1 */}
                    <rect 
                      x="480" y="230" width="160" height="230" 
                      fill={selectedAmenity === "guest_suite_1" || hoveredAmenity === "guest_suite_1" ? "#F8FAFC" : "transparent"} 
                      stroke="#E2E8F0" strokeWidth="1.5"
                      className="transition-all cursor-pointer hover:fill-slate-50"
                      onClick={() => setSelectedAmenity("guest_suite_1")}
                      onMouseEnter={() => setHoveredAmenity("guest_suite_1")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    />
                    <text x="560" y="350" fill="#475569" className="text-xs font-bold text-center text-anchor-middle pointer-events-none">Guest Suite 1</text>

                    {/* Foyer entrance corridor */}
                    <rect 
                      x="480" y="40" width="160" height="190" 
                      fill={selectedAmenity === "first_aid" || hoveredAmenity === "first_aid" || selectedAmenity === "exit_foyer" || hoveredAmenity === "exit_foyer" ? "#F8FAFC" : "transparent"} 
                      stroke="#E2E8F0" strokeWidth="1.5"
                      className="transition-all cursor-pointer hover:fill-slate-50"
                      onClick={() => setSelectedAmenity("first_aid")}
                      onMouseEnter={() => setHoveredAmenity("first_aid")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    />
                    <text x="560" y="100" fill="#475569" className="text-xs font-bold text-center text-anchor-middle pointer-events-none">Foyer Corridor</text>

                    {/* Outdoors: Carport */}
                    <rect 
                      x="640" y="90" width="130" height="200" 
                      fill={selectedAmenity === "parking" || hoveredAmenity === "parking" ? "#E2E8F0" : "#F1F5F9"} 
                      rx="12" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="5,3"
                      className="transition-all cursor-pointer hover:fill-slate-200"
                      onClick={() => setSelectedAmenity("parking")}
                      onMouseEnter={() => setHoveredAmenity("parking")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    />
                    <text x="705" y="180" fill="#64748B" className="text-[10px] font-black uppercase tracking-wider text-anchor-middle pointer-events-none">Private Carport</text>
                    
                    {/* Parking Lines */}
                    <path d="M 660,140 L 710,140 M 660,220 L 710,220" stroke="#CBD5E1" strokeWidth="1.5" />

                    {/* Interactive Badges / Hotspot circles */}
                    {/* Pool Area Pin */}
                    <g 
                      className="cursor-pointer"
                      onClick={() => setSelectedAmenity("pool")}
                      onMouseEnter={() => setHoveredAmenity("pool")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <circle cx="220" cy="250" r="16" fill="#0284C7" className="animate-pulse" opacity="0.2" />
                      <circle cx="220" cy="250" r="11" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
                      <path d="M 215,250 C 215,245 225,245 225,250" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>

                    {/* Carport Parking Pin */}
                    <g 
                      className="cursor-pointer"
                      onClick={() => setSelectedAmenity("parking")}
                      onMouseEnter={() => setHoveredAmenity("parking")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <circle cx="705" cy="215" r="11" fill="#475569" stroke="#FFFFFF" strokeWidth="2" />
                      <text x="705" y="218" fill="#FFFFFF" className="text-[9px] font-black text-anchor-middle pointer-events-none">P</text>
                    </g>

                    {/* Fire Exit Foyer (EXIT A) (Safety Green Badge) */}
                    <g 
                      className="cursor-pointer transition-transform duration-200 hover:scale-105"
                      onClick={() => setSelectedAmenity("exit_foyer")}
                      onMouseEnter={() => setHoveredAmenity("exit_foyer")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <rect x="530" y="28" width="55" height="24" rx="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" className="shadow-md" />
                      <text x="557.5" y="43" fill="#FFFFFF" className="text-[8px] font-black tracking-widest text-anchor-middle pointer-events-none">EXIT A</text>
                    </g>

                    {/* Fire Exit Terrace (EXIT B) (Safety Green Badge) */}
                    <g 
                      className="cursor-pointer transition-transform duration-200 hover:scale-105"
                      onClick={() => setSelectedAmenity("exit_terrace")}
                      onMouseEnter={() => setHoveredAmenity("exit_terrace")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <rect x="272" y="270" width="55" height="24" rx="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" className="shadow-md" />
                      <text x="299.5" y="285" fill="#FFFFFF" className="text-[8px] font-black tracking-widest text-anchor-middle pointer-events-none">EXIT B</text>
                    </g>

                    {/* First Aid Station (Red Cross) */}
                    <g 
                      className="cursor-pointer"
                      onClick={() => setSelectedAmenity("first_aid")}
                      onMouseEnter={() => setHoveredAmenity("first_aid")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <circle cx="560" cy="140" r="11" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                      <path d="M 556,140 L 564,140 M 560,136 L 560,144" stroke="#FFFFFF" strokeWidth="2" />
                    </g>

                    {/* Gas/Kitchen Extinguisher Symbol */}
                    <g 
                      className="cursor-pointer"
                      onClick={() => setSelectedAmenity("kitchen")}
                      onMouseEnter={() => setHoveredAmenity("kitchen")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <circle cx="450" cy="150" r="11" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                      <path d="M 447,147 L 453,147 L 453,153 L 447,153 Z M 450,144 L 450,147" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>

                  </svg>
                ) : (
                  <svg viewBox="0 0 800 500" className="w-full h-auto max-h-[450px] select-none">
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" rx="16" />

                    {/* Beachfront line backdrop */}
                    <path d="M 0,0 L 140,0 L 140,500 L 0,500 Z" fill="#FEF3C7" opacity="0.1" />

                    {/* Upper level boundary */}
                    <rect x="200" y="40" width="440" height="420" fill="#FFFFFF" rx="20" stroke="#334155" strokeWidth="4" />

                    {/* Master suite left half */}
                    <rect 
                      x="200" y="40" width="220" height="420" 
                      fill={selectedAmenity === "master_suite" || hoveredAmenity === "master_suite" ? "#F8FAFC" : "transparent"} 
                      stroke="#E2E8F0" strokeWidth="1.5"
                      className="transition-all cursor-pointer hover:fill-slate-50"
                      onClick={() => setSelectedAmenity("master_suite")}
                      onMouseEnter={() => setHoveredAmenity("master_suite")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    />
                    <text x="310" y="240" fill="#1E293B" className="text-sm font-black uppercase tracking-wider text-anchor-middle pointer-events-none">Master Ocean Suite</text>

                    {/* Wrap-around master balcony */}
                    <rect x="110" y="80" width="90" height="340" fill="#F1F5F9" rx="10" stroke="#94A3B8" strokeWidth="1.5" />
                    <text x="155" y="250" fill="#64748B" className="text-[9px] font-black uppercase tracking-widest rotate-270 text-anchor-middle pointer-events-none">Ocean Horizon Balcony</text>

                    {/* Master Bath / Jacuzzi room */}
                    <rect 
                      x="420" y="40" width="110" height="190" 
                      fill={selectedAmenity === "bath" || hoveredAmenity === "bath" ? "#F8FAFC" : "transparent"} 
                      stroke="#E2E8F0" strokeWidth="1.5"
                      className="transition-all cursor-pointer hover:fill-slate-50"
                      onClick={() => setSelectedAmenity("bath")}
                      onMouseEnter={() => setHoveredAmenity("bath")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    />
                    <text x="475" y="130" fill="#475569" className="text-xs font-bold text-center text-anchor-middle pointer-events-none">Master Bath</text>

                    {/* Upper Guest Suite 2 */}
                    <rect 
                      x="420" y="230" width="220" height="230" 
                      fill={selectedAmenity === "guest_suite_2" || hoveredAmenity === "guest_suite_2" ? "#F8FAFC" : "transparent"} 
                      stroke="#E2E8F0" strokeWidth="1.5"
                      className="transition-all cursor-pointer hover:fill-slate-50"
                      onClick={() => setSelectedAmenity("guest_suite_2")}
                      onMouseEnter={() => setHoveredAmenity("guest_suite_2")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    />
                    <text x="530" y="350" fill="#475569" className="text-xs font-bold text-center text-anchor-middle pointer-events-none">Guest Suite 2</text>

                    {/* Upper Hallway landing */}
                    <rect 
                      x="530" y="40" width="110" height="190" 
                      fill={selectedAmenity === "exit_stairs" || hoveredAmenity === "exit_stairs" ? "#F8FAFC" : "transparent"} 
                      stroke="#E2E8F0" strokeWidth="1.5"
                      className="transition-all cursor-pointer hover:fill-slate-50"
                      onClick={() => setSelectedAmenity("exit_stairs")}
                      onMouseEnter={() => setHoveredAmenity("exit_stairs")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    />
                    <text x="585" y="110" fill="#475569" className="text-[10px] font-bold text-center text-anchor-middle pointer-events-none">Hall & Stairs</text>
                    
                    {/* Stair steps vector lines */}
                    <path d="M 550,135 L 585,135 M 550,140 L 585,140 M 550,145 L 585,145 M 550,150 L 585,150 M 550,155 L 585,155" stroke="#CBD5E1" strokeWidth="1.5" />

                    {/* Interactive Hotspot pins */}
                    {/* Master Suite Bed Hotspot Pin */}
                    <g 
                      className="cursor-pointer"
                      onClick={() => setSelectedAmenity("master_suite")}
                      onMouseEnter={() => setHoveredAmenity("master_suite")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <circle cx="310" cy="280" r="11" fill="#475569" stroke="#FFFFFF" strokeWidth="2" />
                      <text x="310" y="283" fill="#FFFFFF" className="text-[9px] font-black text-anchor-middle pointer-events-none">M</text>
                    </g>

                    {/* Guest Bedroom 2 Bed Hotspot Pin */}
                    <g 
                      className="cursor-pointer"
                      onClick={() => setSelectedAmenity("guest_suite_2")}
                      onMouseEnter={() => setHoveredAmenity("guest_suite_2")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <circle cx="530" cy="280" r="11" fill="#475569" stroke="#FFFFFF" strokeWidth="2" />
                      <text x="530" y="283" fill="#FFFFFF" className="text-[9px] font-black text-anchor-middle pointer-events-none">G</text>
                    </g>

                    {/* Exit Stairs Landing C (Safety Green Badge) */}
                    <g 
                      className="cursor-pointer transition-transform duration-200 hover:scale-105"
                      onClick={() => setSelectedAmenity("exit_stairs")}
                      onMouseEnter={() => setHoveredAmenity("exit_stairs")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <rect x="560" y="28" width="55" height="24" rx="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" className="shadow-md" />
                      <text x="587.5" y="43" fill="#FFFFFF" className="text-[8px] font-black tracking-widest text-anchor-middle pointer-events-none">EXIT C</text>
                    </g>

                    {/* Upper level extinguisher */}
                    <g 
                      className="cursor-pointer"
                      onClick={() => setSelectedAmenity("exit_stairs")}
                      onMouseEnter={() => setHoveredAmenity("exit_stairs")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <circle cx="550" cy="170" r="11" fill="#DC2626" stroke="#FFFFFF" strokeWidth="2" />
                      <path d="M 547,167 L 553,167 L 553,173 L 547,173 Z M 550,164 L 550,167" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
                    </g>

                    {/* Jacuzzi Pin */}
                    <g 
                      className="cursor-pointer"
                      onClick={() => setSelectedAmenity("bath")}
                      onMouseEnter={() => setHoveredAmenity("bath")}
                      onMouseLeave={() => setHoveredAmenity(null)}
                    >
                      <circle cx="475" cy="165" r="11" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="475" cy="165" r="5" fill="#FFFFFF" opacity="0.6" />
                    </g>

                  </svg>
                )}
              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="mt-6 border-t border-gray-100 pt-4 flex justify-between items-center text-xs text-gray-400">
              <span className="font-semibold flex items-center gap-1.5 text-slate-500">
                <Flame className="w-4 h-4 text-red-500 animate-pulse" />
                <span>Smoke detectors & Fire blankets are indicated on each floor plan.</span>
              </span>
              <button 
                onClick={() => {
                  setIsPropertyMapOpen(false);
                  setSelectedAmenity(null);
                }}
                className="px-6 py-3 bg-[#2D5A27] hover:bg-[#1a3818] text-white rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-green-900/10"
              >
                Done Exploring
              </button>
            </div>

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
