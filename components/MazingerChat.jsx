// --- LÓGICA DE CONEXIÓN CON EL INSTITUTO FOTÓNICO (Hugging Face) ---
const handleSend = async () => {
  if (!input.trim() || loading) return;

  const userMsg = input;
  setInput("");
  setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
  setLoading(true);

  try {
    const response = await fetch("https://jetzu-mazingerpage.hf.space/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userMsg }),
    });

    if (!response.ok) throw new Error("Falla en los sistemas de defensa");

    const data = await response.json();

    // Usamos la respuesta que viene de tu lógica en rag_api.py
    setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
  } catch (e) {
    setMessages(prev => [...prev, { role: 'assistant', content: "¡Interferencia del Dr. Hell! No se pudo contactar con el Instituto Fotónico." }]);
  } finally {
    setLoading(false);
  }
};