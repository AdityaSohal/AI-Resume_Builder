import OpenAI from "openai";

const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "AIzaSyC6tU_b1pIVP5w8DgN_-ysLaNeyMrT62N4",
    baseURL: process.env.OPENAI_BASE_URL,
});

export default ai;
