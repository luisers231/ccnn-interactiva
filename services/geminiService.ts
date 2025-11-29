import { GoogleGenAI, Type } from "@google/genai";
import { Topic, ActivityItem, QuizQuestion, GalileanQuestion, JeopardyCategory } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const modelName = 'gemini-2.5-flash';

// --- Activities Generator ---
export const generateActivities = async (topic: Topic): Promise<ActivityItem[]> => {
  try {
    const prompt = `Genera una lista de 10 conceptos o actividades educativas interactivas relacionadas con el tema: "${topic}". 
    Para cada uno, provee el término o concepto clave, una definición detallada y un ejemplo de la vida real o dato curioso.
    Responde estrictamente en formato JSON.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.INTEGER },
              term: { type: Type.STRING },
              definition: { type: Type.STRING },
              example: { type: Type.STRING }
            },
            required: ["id", "term", "definition", "example"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ActivityItem[];
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Error generating activities:", error);
    // Fallback data
    return Array(10).fill(null).map((_, i) => ({
      id: i,
      term: `Concepto ${i + 1} (${topic})`,
      definition: "Información no disponible por el momento. Intente recargar.",
      example: "N/A"
    }));
  }
};

// --- Quiz Generator ---
export const generateQuiz = async (topic: Topic): Promise<QuizQuestion[]> => {
  try {
    const prompt = `Genera un examen tipo quiz de 20 preguntas desafiantes sobre el tema: "${topic}".
    Cada pregunta debe tener 4 opciones, una respuesta correcta clara y una breve explicación.
    Responde estrictamente en formato JSON.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

// --- Galileans Say Generator ---
export const generateGalileanRound = async (topic: Topic): Promise<GalileanQuestion> => {
  try {
    const prompt = `Genera una pregunta estilo '100 personas dijeron' (Family Feud) sobre el tema: "${topic}".
    Provee entre 5 y 8 respuestas posibles con sus respectivos puntajes (de 1 a 40 puntos, sumando aprox 100).
    Responde estrictamente en formato JSON.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  points: { type: Type.INTEGER }
                },
                required: ["text", "points"]
              }
            }
          },
          required: ["question", "answers"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GalileanQuestion;
    }
    throw new Error("No data returned");
  } catch (error) {
    console.error("Error generating Galilean round:", error);
    return { question: "Error loading question", answers: [] };
  }
};

// --- Jeopardy Generator ---
export const generateJeopardyBoard = async (topic: Topic): Promise<JeopardyCategory[]> => {
  try {
    const prompt = `Crea un tablero de Jeopardy simplificado con 3 categorías relacionadas con "${topic}".
    Cada categoría debe tener 3 preguntas con valores 100, 200 y 300 puntos.
    La respuesta debe ser breve.
    Responde estrictamente en formato JSON.`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    points: { type: Type.INTEGER },
                    question: { type: Type.STRING },
                    answer: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });
    
    if (response.text) {
       return JSON.parse(response.text) as JeopardyCategory[];
    }
    throw new Error("No data");
  } catch (e) {
    return [];
  }
};

// --- Hangman Word Generator ---
export const generateHangmanWord = async (topic: Topic): Promise<{word: string, hint: string}> => {
    try {
        const prompt = `Dame UNA sola palabra o término corto (máximo 15 letras, sin espacios si es posible) relacionado con "${topic}" para un juego de ahorcado, y una pista breve. JSON format.`;
        const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        word: {type: Type.STRING},
                        hint: {type: Type.STRING}
                    }
                }
            }
        });
        if(response.text) return JSON.parse(response.text);
        return {word: "CIENCIA", hint: "Estudio de la naturaleza"};
    } catch(e) {
        return {word: "CELULA", hint: "Unidad básica de vida"};
    }
}
