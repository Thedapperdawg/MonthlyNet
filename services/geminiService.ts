import { GoogleGenAI, Type } from "@google/genai";
import { HistoryEntry, ParsedBalances, InsightResponse } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const parseNaturalLanguageInput = async (input: string): Promise<ParsedBalances> => {
  if (!apiKey) return {};

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Extract financial balance updates from this text. Map them to the following categories: cash, savings, investments, realEstate, creditCards, loans, mortgage. Return ONLY a JSON object.
      
      Text: "${input}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cash: { type: Type.NUMBER },
            savings: { type: Type.NUMBER },
            investments: { type: Type.NUMBER },
            realEstate: { type: Type.NUMBER },
            creditCards: { type: Type.NUMBER },
            loans: { type: Type.NUMBER },
            mortgage: { type: Type.NUMBER },
          }
        }
      }
    });

    const text = response.text;
    if (!text) return {};
    return JSON.parse(text) as ParsedBalances;
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return {};
  }
};

export const generateFinancialInsights = async (history: HistoryEntry[]): Promise<InsightResponse> => {
  if (!apiKey || history.length < 2) {
    return {
      summary: "Not enough data for insights yet.",
      projection: "Keep tracking to see projections.",
      actionableTip: "Update your balances monthly for best results."
    };
  }

  // Sort by date ascending
  const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
  const recentHistory = sortedHistory.slice(-6); // Last 6 months

  const prompt = `Analyze this net worth history and provide a brief financial health check.
  
  Data (Chronological):
  ${JSON.stringify(recentHistory.map(h => ({
    date: h.date,
    netWorth: h.netWorth,
    assets: h.totalAssets,
    liabilities: h.totalLiabilities
  })), null, 2)}

  Provide a JSON response with 3 fields:
  1. summary: A 1-sentence summary of the trend.
  2. projection: A 1-sentence projection for next month based on the trend.
  3. actionableTip: A short, friendly tip based on the data.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            projection: { type: Type.STRING },
            actionableTip: { type: Type.STRING },
          },
          required: ["summary", "projection", "actionableTip"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as InsightResponse;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      summary: "Could not generate insights at this time.",
      projection: "",
      actionableTip: "Check your internet connection or API key."
    };
  }
};
