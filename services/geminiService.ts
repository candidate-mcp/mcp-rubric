import { type InterviewAnswer, type Level, type MiniReport, type ComprehensiveReport } from "../types";
import { getMiniReportPrompt, getComprehensiveReportPrompt } from "../constants";

const parseJsonFromText = <T>(text: string): T | null => {
  const match = text.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonString = match ? match[1] : text;
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    console.error("Original text from AI:", text);
    return null;
  }
};

/**
 * Generates a mini report by calling the Gemini API via the local proxy.
 */
export const getMiniReport = async (level: Level, question: string, answer: string): Promise<MiniReport | null> => {
  const model = "gemini-2.5-flash";
  // The app now calls the local proxy directly, removing the need for service worker interception.
  const url = `/api-proxy/v1beta/models/${model}:generateContent`;
  const prompt = getMiniReportPrompt(level, question, answer);
  const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("API call failed with status:", response.status, "Body:", errorBody);
        throw new Error(`API call failed with status: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      console.error("Empty response text from Gemini for mini report.");
      return null;
    }

    const report = parseJsonFromText<MiniReport>(responseText);
    if (!report) {
      console.error("Failed to parse mini report from Gemini response.");
      return null;
    }
    return report;

  } catch (error) {
    console.error("Error fetching mini report:", error);
    return null;
  }
};

/**
 * Generates a comprehensive report by calling the Gemini API via the local proxy.
 */
export const getComprehensiveReport = async (level: Level, answers: InterviewAnswer[]): Promise<ComprehensiveReport | null> => {
    const model = "gemini-2.5-flash";
    // The app now calls the local proxy directly.
    const url = `/api-proxy/v1beta/models/${model}:generateContent`;
    const userAnswersText = answers
        .map((item, index) => `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer || '(No answer provided)'}`)
        .join('\n\n');
    const prompt = getComprehensiveReportPrompt(level, userAnswersText);
    const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });

    try {
      const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: body,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API call failed with status:", response.status, "Body:", errorBody);
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
          console.error("Empty response text from Gemini for comprehensive report.");
          return null;
      }

      const report = parseJsonFromText<ComprehensiveReport>(responseText);
      if(!report) {
          console.error("Failed to parse comprehensive report from Gemini response.");
          return null;
      }
      return report;
    } catch (error) {
      console.error("Error fetching comprehensive report:", error);
      return null;
    }
  };