"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, X, MessageSquare } from 'lucide-react';

export default function MazingerChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Pilder On! Soy el asistente del Instituto Fotónico. ¿Qué deseas saber sobre Mazinger Z?' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // --- LÓGICA RAG ---
  const buscarContextoLocal = async (pregunta) => {
    try {
      const res = await fetch('/rag-data.json');
      const data = await res.json();

      // Similitud simple por palabras clave para el RAG en el navegador
      const palabras = pregunta.toLowerCase().split(' ');
      const relevantes = data.map(item => {
        let score = 0;
        palabras.forEach(p => { if (item.text.toLowerCase().includes(p)) score++; });
        return { ...item, score };
      }).sort((a, b) => b.score - a.score);

      return relevantes.slice(0, 2).map(r => r.text).join(" ");
    } catch (e) {
      return "No se pudo cargar la base de datos.";
    }
  };

  // --- LÓGICA DE IA (GROQ) ---
  const enviarAGroq = async (pregunta, contexto) => {
    const API_KEY = "TU_API_KEY_DE_GROQ"; // REEMPLAZA ESTO
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: `Eres un experto en Mazinger Z. Responde de forma heroica y técnica usando este contexto: ${contexto}` },
            { role: "user", content: pregunta }
          ],
          temperature: 0.5
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e) {
      return "Error de conexión con el Laboratorio del Dr. Hell.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const contexto = await buscarContextoLocal(userMsg);
    const respuesta = await enviarAGroq(userMsg, contexto);

    setMessages(prev => [...prev, { role: 'assistant', content: respuesta }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Botón Flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center gap-2"
        >

          <MessageSquare size={24} />
          <span className="font-bold">Consultar Archivos Z</span>
        </button>
      )}

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="bg-zinc-900 border-2 border-red-600 w-80 h-[450px] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-red-600 p-3 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-bold text-sm uppercase tracking-widest">Mazinger AI</span>
            </div>

            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
          </div>

          {/* Mensajes */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-gray-200'}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-red-500 text-xs animate-pulse">Analizando datos fotónicos...</div>}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-800 flex gap-2 bg-zinc-900">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta a la IA..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:border-red-500"
            />
            <button onClick={handleSend} className="text-red-500 hover:text-red-400">
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}