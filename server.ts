import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Fallback mock data in case Gemini API is unconfigured or fails
const FALLBACK_DISCOVERIES = {
  weather: {
    temperature: "31°C",
    condition: "Tropical Breeze & Sunny",
    humidity: "74%",
    wind: "11 km/h",
    summary: "Perfect tropical beach weather with clear blue skies and a soft sea breeze."
  },
  restaurants: [
    {
      name: "The Cliff Bar & Grill",
      rating: 4.7,
      reviews_count: "840+ reviews",
      cuisine: "Mediterranean / Seafood",
      price: "$$$",
      highlight: "Stunning ocean vistas from a rocky cliffside setting, known for award-winning steaks and local lobsters.",
      recommended: "Seafood Platter, Ribeye Steak, Passion Fruit Panna Cotta"
    },
    {
      name: "Sabienglae Restaurant",
      rating: 4.5,
      reviews_count: "1,200+ reviews",
      cuisine: "Authentic Southern Thai",
      price: "$$",
      highlight: "A beloved local beachfront joint in Lamai serving fiery, authentic Koh Samui specialties.",
      recommended: "Gaeng Som (Sour Curry), Deep Fried King Mackerel, Coconut Crab"
    },
    {
      name: "Jungle Club Restaurant",
      rating: 4.6,
      reviews_count: "950+ reviews",
      cuisine: "Thai-French Fusion",
      price: "$$",
      highlight: "Panoramic hillside views over Chaweng Bay with colorful beanbags and cozy wooden terraces.",
      recommended: "Massaman Lamb Curry, Chicken Satay, Mango Sticky Rice"
    }
  ]
};

// API Endpoint for Koh Samui Search Grounding (Local Discoveries)
app.post("/api/discoveries/search", async (req, res) => {
  const { location = "Koh Samui, Thailand" } = req.body;

  try {
    const ai = getGeminiClient();

    const prompt = `Provide real-time weather information and 3 highly rated nearby restaurants with their exact Google Maps ratings (if available), reviews, cuisine type, price level, recommended dishes, and key highlights for ${location}.
    Return a JSON object with two fields: 'weather' and 'restaurants'. Format the output strictly as JSON with this structure:
    {
      "weather": {
        "temperature": "string (e.g. 29°C)",
        "condition": "string (e.g. Partly Cloudy)",
        "humidity": "string (e.g. 78%)",
        "wind": "string (e.g. 14 km/h)",
        "summary": "string (short weather summary)"
      },
      "restaurants": [
        {
          "name": "string",
          "rating": "number (e.g. 4.6)",
          "reviews_count": "string (e.g. 340+ reviews)",
          "cuisine": "string (e.g. Traditional Thai / Seafood)",
          "price": "string (e.g. $$ or $$$)",
          "highlight": "string",
          "recommended": "string"
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    // Extract search sources
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = chunks
      ? chunks
          .map((chunk: any) => ({
            title: chunk.web?.title || "Google Search Result",
            uri: chunk.web?.uri || "",
          }))
          .filter((c: any) => c.uri)
      : [];

    const data = JSON.parse(text);

    return res.json({
      success: true,
      data,
      sources,
      fromAI: true
    });

  } catch (error: any) {
    // Check if it's an API Key error or Quota Exceeded to handle logs gently
    const isApiKeyMissing = !process.env.GEMINI_API_KEY;
    const errMsg = error?.toString() || error?.message || "";
    const isQuotaExceeded = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.toLowerCase().includes("quota");
    
    if (isApiKeyMissing) {
      console.log("Notice: Gemini API key is missing. Serving pre-compiled local guide.");
    } else if (isQuotaExceeded) {
      console.log("Notice: Gemini API Search Grounding rate limit reached. Serving pre-compiled local guide.");
    } else {
      console.log("Notice: Serving pre-compiled local guide. Source details:", errMsg.substring(0, 120));
    }
    
    const formattedError = isQuotaExceeded
      ? "Gemini API Search Grounding Quota Exceeded. Using hand-curated Koh Samui live directory."
      : (error.message || "Failed to fetch real-time info");

    // Return gracefully with fallback data to keep app functional
    return res.json({
      success: false,
      error: formattedError,
      isApiKeyMissing,
      isQuotaExceeded,
      data: FALLBACK_DISCOVERIES,
      sources: [
        { title: "Koh Samui Travel Guide (Local Cache)", uri: "https://www.tourismthailand.org/Destinations/Provinces/Ko-Samui/555" }
      ],
      fromAI: false
    });
  }
});

// Serve Frontend using Vite or static assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
