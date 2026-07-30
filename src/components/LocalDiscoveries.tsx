import React, { useState, useEffect } from "react";
import { 
  CloudSun, 
  Thermometer, 
  Wind, 
  Droplets, 
  Utensils, 
  Star, 
  RefreshCw, 
  ExternalLink, 
  Globe, 
  MapPin, 
  AlertCircle, 
  Sparkles,
  CheckCircle,
  ThumbsUp,
  Map
} from "lucide-react";

interface WeatherData {
  temperature: string;
  condition: string;
  humidity: string;
  wind: string;
  summary: string;
}

interface RestaurantData {
  name: string;
  rating: number;
  reviews_count: string;
  cuisine: string;
  price: string;
  highlight: string;
  recommended: string;
}

interface SearchSource {
  title: string;
  uri: string;
}

interface DiscoveryData {
  weather: WeatherData;
  restaurants: RestaurantData[];
}

const RESTAURANT_IMAGES: Record<string, string> = {
  "The Cliff Bar & Grill": "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80",
  "Sabienglae Restaurant": "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=500&q=80",
  "Jungle Club Restaurant": "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=500&q=80",
  "Fisherman's Village Cafe": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=500&q=80",
};

const FALLBACK_RESTAURANT_IMAGES = [
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=500&q=80", // delicious food
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=500&q=80", // gourmet plate
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=500&q=80", // restaurant seating
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80", // elegant restaurant
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=500&q=80", // chic dining
];

const getRestaurantImage = (name: string, index: number) => {
  const matched = Object.keys(RESTAURANT_IMAGES).find(key => name.toLowerCase().includes(key.toLowerCase()));
  if (matched) {
    return RESTAURANT_IMAGES[matched];
  }
  return FALLBACK_RESTAURANT_IMAGES[index % FALLBACK_RESTAURANT_IMAGES.length];
};

export default function LocalDiscoveries() {
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingStep, setLoadingStep] = useState<string>("Initializing search...");
  const [data, setData] = useState<DiscoveryData | null>(null);
  const [sources, setSources] = useState<SearchSource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyMissing, setIsApiKeyMissing] = useState<boolean>(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchLocalDiscoveries = async () => {
    setLoading(true);
    setError(null);
    setIsApiKeyMissing(false);
    setIsQuotaExceeded(false);

    // Stagger loading messages for an immersive feel
    const steps = [
      "Connecting to Gemini API...",
      "Querying Google Search Grounding for Koh Samui weather & restaurants...",
      "Synthesizing live reviews and actual ratings...",
      "Polishing real-time dashboard cards..."
    ];

    let currentStepIdx = 0;
    setLoadingStep(steps[0]);

    const stepInterval = setInterval(() => {
      if (currentStepIdx < steps.length - 1) {
        currentStepIdx++;
        setLoadingStep(steps[currentStepIdx]);
      }
    }, 1200);

    try {
      const response = await fetch("/api/discoveries/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: "Koh Samui, Thailand" }),
      });

      const resJson = await response.json();
      clearInterval(stepInterval);

      if (resJson.success) {
        setData(resJson.data);
        setSources(resJson.sources || []);
        setError(null);
      } else {
        // Handled server-side gracefully with fallback mock data
        setData(resJson.data);
        setSources(resJson.sources || []);
        if (resJson.isApiKeyMissing) {
          setIsApiKeyMissing(true);
        } else if (resJson.isQuotaExceeded) {
          setIsQuotaExceeded(true);
        } else {
          setError(resJson.error || "Failed to fetch real-time search data");
        }
      }
      setLastRefreshed(new Date());
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error("Discovery fetch error:", err);
      setError("Unable to connect to service. Displaying cached Koh Samui guide.");
      setLastRefreshed(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalDiscoveries();
  }, []);

  return (
    <section id="local-discoveries-bento" className="lg:col-span-12 bg-white rounded-[2rem] p-6 border border-black/5 shadow-sm relative overflow-hidden group">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute left-0 top-0 -ml-16 -mt-16 w-56 h-56 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute right-0 bottom-0 -mr-16 -mb-16 w-56 h-56 bg-orange-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-[#2D5A27] text-[10px] rounded-full font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-[#2D5A27]/10">
              <Sparkles className="w-3.5 h-3.5 text-[#2D5A27] fill-[#2D5A27]/10 animate-pulse" /> Live Grounded Exploration
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight mt-2 flex items-center gap-2">
            Local Discoveries <span className="text-gray-300 font-normal text-lg">|</span> <span className="text-[#2D5A27] text-lg font-bold">Koh Samui Live Guide</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-medium">
            Powered by Gemini with real-time Google Search grounding to discover accurate live weather and nearby dining reviews.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto self-stretch sm:self-auto justify-between sm:justify-end">
          {lastRefreshed && !loading && (
            <p className="text-[10px] text-gray-400 font-semibold font-mono">
              Updated: {lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
          <button
            onClick={fetchLocalDiscoveries}
            disabled={loading}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 border border-black/5 cursor-pointer ${
              loading 
                ? "bg-gray-100 text-gray-400" 
                : "bg-emerald-50 hover:bg-emerald-100/80 text-[#2D5A27] hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Grounding..." : "Scan Live Now"}
          </button>
        </div>
      </div>

      {/* Warning Alert if API key is missing */}
      {isApiKeyMissing && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-orange-800 flex items-center gap-1.5">
              <span>Demo Mode active: GEMINI_API_KEY Missing</span>
            </h4>
            <p className="text-orange-700 mt-1 font-medium leading-relaxed">
              We're displaying beautifully cached local discoveries for Koh Samui since no Gemini API key was detected in the workspace secrets. To fetch live grounded data, simply add your <strong>GEMINI_API_KEY</strong> inside <strong>Settings &gt; Secrets</strong>!
            </p>
          </div>
        </div>
      )}

      {/* Warning Alert if Rate Limit / Quota Exceeded */}
      {isQuotaExceeded && !isApiKeyMissing && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-amber-800 flex items-center gap-1.5">
              <span>Google Search Grounding Quota Exceeded</span>
            </h4>
            <p className="text-amber-700 mt-1 font-medium leading-relaxed">
              We've temporarily reached the free-tier daily quota limit for live Google Search Grounding. For your convenience, the dashboard has automatically loaded our hand-curated live directory for Koh Samui so your planning remains flawless.
            </p>
          </div>
        </div>
      )}

      {/* Error alert */}
      {error && !isApiKeyMissing && !isQuotaExceeded && (
        <div className="mb-6 bg-red-50 border border-red-150 rounded-2xl p-4 flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10 animate-pulse">
          {/* Weather Loader */}
          <div className="lg:col-span-4 bg-gray-50 rounded-[1.5rem] p-5 border border-black/[0.02] flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="w-16 h-4 bg-gray-200 rounded"></div>
              <div className="w-32 h-8 bg-gray-200 rounded mt-4"></div>
              <div className="w-24 h-4 bg-gray-200 rounded mt-2"></div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-full h-3 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Restaurant Loader */}
          <div className="lg:col-span-8 space-y-4">
            <div className="w-28 h-4 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 border border-black/[0.02] rounded-[1.5rem] p-4 flex flex-col justify-between min-h-[200px]">
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-16 h-3 bg-gray-200 rounded mt-2"></div>
                  </div>
                  <div className="space-y-1.5 mt-4">
                    <div className="w-full h-2.5 bg-gray-200 rounded"></div>
                    <div className="w-full h-2.5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic loading label */}
          <div className="col-span-12 flex justify-center items-center py-4 bg-emerald-50/20 rounded-xl border border-emerald-500/10 mt-2">
            <p className="text-xs text-[#2D5A27] font-bold tracking-wide flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2D5A27] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D5A27]"></span>
              </span>
              {loadingStep}
            </p>
          </div>
        </div>
      ) : (
        // Main Grid Content
        data && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
            {/* Weather Card */}
            <div className="lg:col-span-4 bg-emerald-50/30 rounded-[1.8rem] p-5 border border-[#2D5A27]/5 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div className="absolute right-0 top-0 -mr-8 -mt-8 w-24 h-24 bg-[#2D5A27]/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div>
                <div className="relative w-full h-32 rounded-2xl overflow-hidden mb-4 border border-black/[0.04] shadow-inner">
                  <img 
                    src="https://images.unsplash.com/photo-1540206395-68808572332f?auto=format&fit=crop&w=400&q=80" 
                    alt="Koh Samui Shoreline" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-3">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 drop-shadow">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Koh Samui Island
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Grounded Weather
                  </span>
                  <CloudSun className="w-8 h-8 text-amber-500 animate-pulse" />
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-gray-800 tracking-tight">{data.weather.temperature}</span>
                  <span className="text-sm font-bold text-[#2D5A27] uppercase">{data.weather.condition}</span>
                </div>

                <p className="text-xs text-gray-500 mt-3 leading-relaxed font-semibold">
                  {data.weather.summary}
                </p>
              </div>

              {/* Weather Indicators */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-[#2D5A27]/10">
                <div className="flex items-center gap-2.5 bg-white/70 rounded-xl p-2.5 border border-black/[0.02]">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <div>
                    <p className="text-[8px] text-gray-400 font-extrabold uppercase">Humidity</p>
                    <p className="text-xs font-bold text-gray-700">{data.weather.humidity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 bg-white/70 rounded-xl p-2.5 border border-black/[0.02]">
                  <Wind className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-[8px] text-gray-400 font-extrabold uppercase">Wind speed</p>
                    <p className="text-xs font-bold text-gray-700">{data.weather.wind}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurants Section */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-orange-500" /> Top Dining Recommendations
                  </h3>
                  <span className="text-[9px] bg-orange-100 text-orange-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    3 Live Top-Picks
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.restaurants.map((restaurant, idx) => (
                    <div 
                      key={idx}
                      className="bg-gray-50 hover:bg-white rounded-[1.5rem] p-4 border border-black/[0.02] hover:border-[#2D5A27]/20 flex flex-col justify-between hover:shadow-md transition-all duration-300 group/card cursor-pointer"
                    >
                      <div>
                        {/* Restaurant Photo Thumbnail */}
                        <div className="relative w-full h-24 rounded-xl overflow-hidden mb-3 border border-black/[0.03]">
                          <img 
                            src={getRestaurantImage(restaurant.name, idx)} 
                            alt={restaurant.name} 
                            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Name and Rating */}
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-black text-gray-800 leading-tight group-hover/card:text-[#2D5A27] transition-colors line-clamp-2">
                            {restaurant.name}
                          </h4>
                          <div className="bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-lg flex items-center gap-1 flex-shrink-0 text-[10px] font-bold">
                            <Star className="w-3 h-3 text-amber-600 fill-amber-600" />
                            <span>{restaurant.rating}</span>
                          </div>
                        </div>

                        {/* Cuisine / Reviews Count / Price */}
                        <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[9px] text-gray-400 font-bold uppercase">
                          <span>{restaurant.cuisine}</span>
                          <span>•</span>
                          <span className="text-[#2D5A27]">{restaurant.price}</span>
                        </div>

                        <p className="text-[10px] text-gray-500 mt-2.5 leading-relaxed font-semibold">
                          {restaurant.highlight}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-black/[0.03]">
                        <p className="text-[8px] text-gray-400 font-extrabold uppercase tracking-widest">Recommended dishes</p>
                        <p className="text-[9px] text-gray-600 font-semibold mt-0.5 italic line-clamp-1">
                          {restaurant.recommended}
                        </p>
                        <div className="mt-2.5 flex justify-between items-center">
                          <span className="text-[8px] text-gray-400 font-bold font-mono">{restaurant.reviews_count}</span>
                          <span className="text-[9px] text-[#2D5A27] font-bold flex items-center gap-1 group-hover/card:translate-x-0.5 transition-transform">
                            <Map className="w-3 h-3" /> View Maps
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Verification panel */}
              {sources.length > 0 && (
                <div className="mt-5 bg-gray-50 rounded-2xl p-3 border border-black/[0.01] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      Live Verified Grounding Sources:
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {sources.slice(0, 3).map((source, sIdx) => (
                      <a
                        key={sIdx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-blue-50/50 border border-gray-100 hover:border-blue-100 px-2.5 py-1 rounded-lg text-[9px] font-bold text-gray-600 hover:text-blue-600 flex items-center gap-1 transition-all"
                      >
                        <span className="truncate max-w-[120px]">{source.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </section>
  );
}
