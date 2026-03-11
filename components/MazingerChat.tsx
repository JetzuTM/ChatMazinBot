"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, X, MessageCircle, Bot, User, Sparkles, AlertCircle } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  isError?: boolean;
}

const API_URL = "https://jetzu-mazingerpage.hf.space/chat";

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Bienvenido, piloto. Soy MAZIN-BOT, el asistente de Mazinger Z. Preguntame lo que quieras sobre el legendario Super Robot.",
    isBot: true,
    timestamp: new Date(),
  },
];

export default function MazingerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enviar mensaje a la API de Hugging Face
  const handleSendMessage = useCallback(async () => {
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

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.response || "No pude procesar tu solicitud. Intenta de nuevo.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error conectando con el Instituto Fotonico:", error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Error de conexion con el Instituto Fotonico. Por favor, intenta de nuevo mas tarde.",
        isBot: true,
        timestamp: new Date(),
        isError: true,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputValue, isTyping]);

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
        className={`fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 hover:shadow-primary/50 ${
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
        className={`fixed bottom-24 right-6 z-[9998] flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 transition-all duration-300 ${
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
            <h3 className="text-sm font-bold tracking-wide text-foreground uppercase">
              MAZIN-BOT
            </h3>
            <p className="text-xs text-muted-foreground">
              Asistente de Mazinger Z
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
                    message.isError
                      ? "bg-destructive/20 text-destructive"
                      : message.isBot
                        ? "bg-primary/20 text-primary"
                        : "bg-accent/20 text-accent"
                  }`}
                >
                  {message.isError ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : message.isBot ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                    message.isError
                      ? "rounded-tl-sm bg-destructive/10 text-destructive border border-destructive/20"
                      : message.isBot
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
              placeholder="Escribe tu mensaje..."
              disabled={isTyping}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary"
              aria-label="Enviar mensaje"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Pulsa Enter para enviar - Conectado al Instituto Fotonico
          </p>
        </div>
      </div>
    </>
  );
}
