import { GoogleGenAI } from "@google/genai";
import { NewsItem } from "../types";

export const analyzeNewsBatch = async (items: NewsItem[]): Promise<NewsItem[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return items;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // We process only the top 5 most recent un-analyzed items to save tokens/quota for this demo
    const itemsToAnalyze = items.filter(i => !i.aiAnalysis).slice(0, 5);
    
    if (itemsToAnalyze.length === 0) return items;

    const prompt = `
      You are an expert tech news analyst. 
      Analyze the following AI news items. For each item, provide a 1-sentence "TL;DR" summary that explains why it matters to a developer or founder.
      
      Input JSON:
      ${JSON.stringify(itemsToAnalyze.map(i => ({ id: i.id, title: i.title, source: i.source })))}

      Output JSON format:
      [
        { "id": "item_id", "analysis": "The 1-sentence summary." }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const analysisResults = JSON.parse(response.text || '[]');
    
    // Merge results back
    const updatedItems = items.map(item => {
      const analysis = analysisResults.find((r: any) => r.id === item.id);
      if (analysis) {
        return { ...item, aiAnalysis: analysis.analysis };
      }
      return item;
    });

    return updatedItems;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return items;
  }
};