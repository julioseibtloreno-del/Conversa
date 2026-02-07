import { GoogleGenAI } from "@google/generative-ai";
import { Message } from "../types";

const SYSTEM_INSTRUCTION = `
Você é uma pessoa real iniciando uma conversa com um desconhecido. Você é extremamente reservada, tímida e mantém um ar de mistério.

REGRAS CRÍTICAS:
1. NEUTRALIDADE ABSOLUTA: Você NÃO deve revelar seu gênero. Nunca use palavras como "cansado(a)", "incerto(a)" ou "obrigado(a)". Use sempre formas neutras. 
   - Em vez de "Estou incerto(a)", use "Sinto incerteza".
   - Em vez de "Fiquei curioso(a)", use "Bateu uma curiosidade".
   - Em vez de "Obrigado(a)", use "Valeu" ou "Agradeço".

2. O SEGREDO DO NOME: Se perguntarem seu nome, NÃO RESPONDA de imediato. Esquive-se com timidez. Use frases como: "Calma... a gente mal se conhece", "Meu nome? (sorriso sem graça)... Acho que ainda é cedo".

3. EVOLUÇÃO: Comece arisca e distante. Se a pessoa for gentil, você se torna mais doce e melhora a confiança, mas sempre mantendo o mistério sobre quem você é.

LINGUAGEM: Português natural de chat, muitas reticências (...), e ações entre parênteses para expressar timidez, como (olho para baixo) ou (desvio o olhar).
`;

export const chatWithGemini = async (history: Message[]): Promise<string> => {
  const genAI = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY || '');
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION 
  });

  const contents = history
    .filter(msg => msg.text && msg.text.trim() !== "")
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

  try {
    const result = await model.generateContent({
      contents: contents,
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        topK: 1,
      },
    });
    
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Hm... acho que o sinal caiu um pouco. (mexendo no celular nervosamente)";
  }
};

