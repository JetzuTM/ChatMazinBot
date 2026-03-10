"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, MessageCircle, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface RagEntry {
  text: string;
  vector: number[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Bienvenido, piloto. Soy MAZIN-BOT, el asistente de Mazinger Z. Preguntame lo que quieras sobre el legendario Super Robot.",
    isBot: true,
    timestamp: new Date(),
  },
];

// Funcion para calcular similitud de coseno entre dos vectores
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

// Funcion simple para generar un vector basico desde texto (sin embeddings reales)
function simpleTextToVector(text: string, dimension: number = 384): number[] {
  const lowerText = text.toLowerCase();
  const vector = new Array(dimension).fill(0);
  
  // Keywords relacionados con Mazinger Z para mejorar la busqueda
  const keywords: Record<string, number[]> = {
    "mazinger": [0, 1, 2],
    "robot": [3, 4, 5],
    "koji": [6, 7, 8],
    "kabuto": [9, 10, 11],
    "rayo": [12, 13, 14],
    "fotonico": [15, 16, 17],
    "puño": [18, 19, 20],
    "cohete": [21, 22, 23],
    "hell": [24, 25, 26],
    "infierno": [27, 28, 29],
    "dr": [30, 31, 32],
    "doctor": [33, 34, 35],
    "pilder": [36, 37, 38],
    "sayaka": [39, 40, 41],
    "boss": [42, 43, 44],
    "ashura": [45, 46, 47],
    "baron": [48, 49, 50],
    "bestia": [51, 52, 53],
    "mecanica": [54, 55, 56],
    "aleacion": [57, 58, 59],
    "altura": [60, 61, 62],
    "peso": [63, 64, 65],
    "ataque": [66, 67, 68],
    "arma": [69, 70, 71],
    "enemigo": [72, 73, 74],
    "aliado": [75, 76, 77],
    "creador": [78, 79, 80],
    "nagai": [81, 82, 83],
    "volar": [84, 85, 86],
    "scrander": [87, 88, 89],
    "jet": [90, 91, 92],
    "fuego": [93, 94, 95],
    "pecho": [96, 97, 98],
    "viento": [99, 100, 101],
    "huracan": [102, 103, 104],
    "especificacion": [105, 106, 107],
    "tecnica": [108, 109, 110],
    "origen": [111, 112, 113],
    "historia": [114, 115, 116],
    "legado": [117, 118, 119],
    "grendizer": [120, 121, 122],
    "great": [123, 124, 125],
    "energia": [126, 127, 128],
    "fotonica": [129, 130, 131],
    "quien": [6, 30, 39, 45],
    "que": [0, 3, 66],
    "como": [36, 84, 93],
    "cual": [12, 18, 66],
    "piloto": [6, 7, 8],
    "shiro": [132, 133, 134],
    "yumi": [135, 136, 137],
    "minerva": [138, 139, 140],
    "aphrodite": [141, 142, 143],
    "brocken": [144, 145, 146],
    "conde": [147, 148, 149],
    "instituto": [150, 151, 152],
  };
  
  // Activar indices basados en palabras clave encontradas
  for (const [keyword, indices] of Object.entries(keywords)) {
    if (lowerText.includes(keyword)) {
      for (const idx of indices) {
        if (idx < dimension) {
          vector[idx] = 1;
        }
      }
    }
  }
  
  // Añadir algo de variacion basada en los caracteres
  for (let i = 0; i < lowerText.length && i < dimension; i++) {
    vector[(i * 7) % dimension] += lowerText.charCodeAt(i) / 1000;
  }
  
  return vector;
}

export default function MazingerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [ragData, setRagData] = useState<RagEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar datos RAG al montar el componente
  useEffect(() => {
    const loadRagData = async () => {
      try {
        const response = await fetch("/rag-data.json");
        if (response.ok) {
          const data: RagEntry[] = await response.json();
          setRagData(data);
        }
      } catch (error) {
        console.error("Error loading RAG data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRagData();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Buscar respuestas relevantes usando similitud de texto simple
  const findRelevantResponses = useCallback((query: string): string[] => {
    if (ragData.length === 0) return [];
    
    const queryLower = query.toLowerCase();
    const queryVector = simpleTextToVector(query);
    
    // Calcular similitud para cada entrada
    const scored = ragData
      .filter(entry => entry.text && entry.text.length > 10) // Filtrar entradas muy cortas
      .map(entry => {
        // Similitud basada en vectores
        const vectorSim = cosineSimilarity(queryVector, entry.vector);
        
        // Similitud basada en texto (keywords matching)
        const textLower = entry.text.toLowerCase();
        let textSim = 0;
        
        // Buscar palabras clave de la consulta en el texto
        const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
        for (const word of queryWords) {
          if (textLower.includes(word)) {
            textSim += 0.3;
          }
        }
        
        // Bonus por coincidencias exactas de frases importantes
        const importantPhrases = [
          "koji kabuto", "dr. hell", "rayo fotonico", "puño cohete",
          "pilder", "sayaka", "mazinger z", "aleacion z", "jet scrander",
          "breast fire", "fuego de pecho", "baron ashura", "boss borot"
        ];
        
        for (const phrase of importantPhrases) {
          if (queryLower.includes(phrase) && textLower.includes(phrase)) {
            textSim += 0.5;
          }
        }
        
        // Combinar ambas similitudes
        const combinedScore = (vectorSim * 0.4) + (textSim * 0.6);
        
        return { text: entry.text, score: combinedScore };
      })
      .filter(item => item.score > 0.1) // Filtrar resultados con baja similitud
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 resultados
    
    return scored.map(item => item.text);
  }, [ragData]);

  // Generar respuesta del bot
  const generateBotResponse = useCallback((userQuery: string): string => {
    const relevantTexts = findRelevantResponses(userQuery);
    
    if (relevantTexts.length === 0) {
      // Respuestas por defecto si no hay coincidencias
      const defaultResponses = [
        "Interesante pregunta, piloto. Mazinger Z fue creado por Go Nagai en 1972 y revoluciono el genero mecha al ser el primer robot gigante pilotado desde su interior.",
        "Como asistente de Mazinger Z, te recomiendo preguntar sobre sus ataques como el Rayo Fotonico, el Puño Cohete o el Fuego de Pecho.",
        "Mazinger Z mide 18 metros y pesa 20 toneladas. Esta construido con la super aleacion Z, un material indestructible.",
        "Koji Kabuto es el valiente piloto que hereda Mazinger Z de su abuelo, el Dr. Juzo Kabuto.",
      ];
      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
    
    // Construir respuesta basada en los textos relevantes encontrados
    if (relevantTexts.length === 1) {
      return relevantTexts[0];
    }
    
    // Si hay multiples resultados relevantes, combinarlos inteligentemente
    const queryLower = userQuery.toLowerCase();
    
    // Detectar tipo de pregunta para formatear mejor la respuesta
    if (queryLower.includes("quien") || queryLower.includes("quién")) {
      return relevantTexts[0];
    }
    
    if (queryLower.includes("ataque") || queryLower.includes("arma") || queryLower.includes("poder")) {
      return `Los principales ataques de Mazinger Z incluyen: ${relevantTexts.slice(0, 3).join(" ")}`;
    }
    
    if (queryLower.includes("enemigo") || queryLower.includes("villano")) {
      return `Los enemigos principales son: ${relevantTexts.slice(0, 3).join(" ")}`;
    }
    
    if (queryLower.includes("especificacion") || queryLower.includes("tecnica") || queryLower.includes("mide") || queryLower.includes("pesa")) {
      return relevantTexts.slice(0, 3).join(" ");
    }
    
    // Respuesta general combinando los mejores resultados
    return relevantTexts.slice(0, 2).join(" ");
  }, [findRelevantResponses]);

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue;
    setInputValue("");
    setIsTyping(true);

    // Generar respuesta usando RAG
    setTimeout(() => {
      const botResponse = generateBotResponse(query);
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  }, [inputValue, isTyping, generateBotResponse]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-primary/50 ${
          isOpen ? "rotate-90 scale-90" : ""
        }`}
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 transition-all duration-300 ${
          isOpen
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="relative flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-3">
          {/* Decorative line */}
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
            <Bot className="h-5 w-5 text-primary" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-green-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-sm font-bold tracking-wide text-foreground">
              MAZIN-BOT
            </h3>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Cargando base de conocimiento..." : "Asistente de Mazinger Z"}
            </p>
          </div>
          <Sparkles className="h-5 w-5 text-secondary" />
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.isBot ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    message.isBot
                      ? "bg-primary/20 text-primary"
                      : "bg-accent/20 text-accent"
                  }`}
                >
                  {message.isBot ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    message.isBot
                      ? "rounded-tl-sm bg-muted text-foreground"
                      : "rounded-tr-sm bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span
                    className={`mt-1 block text-[10px] ${
                      message.isBot ? "text-muted-foreground" : "text-primary-foreground/70"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:150ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-muted/30 p-3">
          <div className="flex items-center gap-2 rounded-xl bg-input px-3 py-2 ring-1 ring-border transition-all focus-within:ring-2 focus-within:ring-primary">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isLoading ? "Cargando..." : "Escribe tu mensaje..."}
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || isTyping}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary"
              aria-label="Enviar mensaje"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Pulsa Enter para enviar - Base de conocimiento RAG activa
          </p>
        </div>
      </div>
    </>
  );
}
