
import { GoogleGenAI } from "@google/genai";

export const getPDFSummary = async (text: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API Key is missing. AI summary feature will not work.");
      return "এআই প্রসেসিংয়ের জন্য এপিআই কি (API Key) প্রয়োজন।";
    }

    // Initializing GoogleGenAI with apiKey
    const ai = new GoogleGenAI({ apiKey });
    
    // Ensure text is not too long to avoid token limits, though 1.5 Flash has a large context window.
    // Truncating to ~30k characters is a safe safe-guard for reasonable response times.
    const safeText = text.substring(0, 30000); 

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `নিম্নলিখিত পিডিএফ টেক্সটটি বিশ্লেষণ করো এবং একটি সংক্ষেপে সারসংক্ষেপ (Summary) তৈরি করো বাংলায়। বুলেট পয়েন্ট ব্যবহার করতে পারো:\n\n${safeText}`,
      config: {
        temperature: 0.5, // Lower temperature for more factual summaries
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    return response.text || "দুঃখিত, এআই সারসংক্ষেপ তৈরি করা সম্ভব হয়নি।";
  } catch (error: any) {
    console.error("Gemini Error:", error);
    // Return a user-friendly error message based on common issues
    if (error.message?.includes('API_KEY')) {
        return "এপিআই কি (API Key) সঠিক নয়।";
    }
    return "এআই প্রসেসিংয়ের সময় একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।";
  }
};
