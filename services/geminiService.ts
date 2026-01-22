
import { GoogleGenAI } from "@google/genai";

export const getPDFSummary = async (text: string): Promise<string> => {
  try {
    // Initializing GoogleGenAI with apiKey as a named property of an object
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `নিম্নলিখিত পিডিএফ টেক্সটটি বিশ্লেষণ করো এবং একটি সংক্ষেপে সারসংক্ষেপ তৈরি করো বাংলায়: \n\n${text.substring(0, 10000)}`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      },
    });

    return response.text || "দুঃখিত, এআই সারসংক্ষেপ তৈরি করা সম্ভব হয়নি।";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "এআই প্রসেসিংয়ের সময় একটি সমস্যা হয়েছে।";
  }
};
