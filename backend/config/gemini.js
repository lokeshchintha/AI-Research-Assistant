import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-1.5-flash (latest stable model)
export const getGeminiModel = (modelName = "gemini-2.0-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

export default genAI;
