"use client";
import { useState, useRef, useEffect } from "react";

export default function BarAgent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callAPI = async (msgs) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: msgs }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.content;
  };

  const startChat = async () => {
    setStarted(true);
    setLoading(true);
    try {
      const reply = await callAPI([{ role: "user", content: "Hola" }]);
      setMessages([
        { role: "user", content: "Hola", hidden: true },
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages([{ role: "assistant", content: "Error al conectar." }]);
    }
    setLoading(false);
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    const apiMessages = newMessages.filter((m) => !m.hidden).map(({ role, content }) => ({ role, content }));
    try {
      const reply = await callAPI(apiMessages);
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Error de connexió." }]);
    }
    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#1a1208 0%,#0e0e0a 60%)", fontFamily:"Georgia,serif", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ textAlign:"center", marginBottom:"24px" }}>
        <div style={{ fontSize:"30px", marginBottom:"6px" }}>🏔️</div>
        <h1 style={{ color:"#d4a853", fontSize:"24px", fontWeight:"normal", letterSpacing:"3px", textTransform:"uppercase", margin:0 }}>Bar La Quintana</h1>
        <p style={{ color:"#7a6b45", fontSize:"11px", margin:"4px 0 0", letterSpacing:"1.5px" }}>EL MIRADOR · CASTELLCIR · MOIANÈS</p>
      </div>
      <div style={{ width:"100%", maxWidth:"520px", background:"#111109", border:"1px solid #2c2412", borderRadius:"6px", overflow:"hidden", boxShadow:"0 12px 50px rgba(0,0,0,0.7)" }}>
        <div style={{ background:"#1a1408", borderBottom:"1px solid #2c2412", padding:"10px 16px", display:"flex", alignItems:"center", gap:"8px" }}>
          <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:"#4caf50" }} />
          <span style={{ color:"#7a6b45", fontSize:"12px", letterSpacing:"1px" }}>Reservas · 658 398 156</span>
        </div>
        <div style={{ height:"420px", overflowY:"auto", padding:"20px", display:"flex", flexDirection:"column", gap:"14px" }}>
          {!started && (
            <div style={{ margin:"auto", textAlign:"center" }}>
              <p style={{ color:"#5a4e30", fontSize:"14px", lineHeight:"1.8", marginBottom:"8px" }}>Bar, restaurant i local social<br/>al Parc Esportiu de Castellcir.</p>
              <p style={{ color:"#3d3420", fontSize:"12px", lineHeight:"1.6", marginBottom:"24px" }}>Concerts · Botifarra · Chill-out · Sopars</p>
              <button onClick={startChat} style={{ background:"#d4a853", color:"#0e0e0a", border:"none", padding:"12px 36px", fontSize:"12px", letterSpacing:"2px", textTransform:"uppercase", cursor:"pointer", borderRadius:"3px", fontFamily:"inherit", fontWeight:"bold" }}>Fer una reserva</button>
            </div>
          )}
          {messages.filter((m) => !m.hidden).map((msg, i) => (
            <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start" }}>
              {msg.role==="assistant" && <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"#2a1f08", border:"1px solid #3d2d10", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", marginRight:"8px", flexShrink:0, marginTop:"2px" }}>🏔️</div>}
              <div style={{ maxWidth:"78%", padding:"10px 14px", borderRadius:"4px", fontSize:"14px", lineHeight:"1.65", background:msg.role==="user"?"#261c07":"#1a1609", color:msg.role==="user"?"#d4a853":"#c5b88a", border:msg.role==="user"?"1px solid #3d2d10":"1px solid #252015" }}>{msg.content}</div>
            </div>
          ))}
          {loading && <div style={{ display:"flex", alignItems:"center", gap:"8px" }}><div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"#2a1f08", border:"1px solid #3d2d10", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px" }}>🏔️</div><div style={{ background:"#1a1609", border:"1px solid #252015", borderRadius:"4px", padding:"10px 16px", color:"#4a3f20", fontSize:"18px", letterSpacing:"5px" }}>···</div></div>}
          <div ref={bottomRef} />
        </div>
        {started && (
          <div style={{ borderTop:"1px solid #1f1a08", padding:"12px 14px", display:"flex", gap:"10px", background:"#0d0d08" }}>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Escriu el teu missatge…" rows={1} style={{ flex:1, background:"transparent", border:"1px solid #2c2412", borderRadius:"3px", color:"#c5b88a", fontSize:"14px", padding:"8px 12px", resize:"none", fontFamily:"inherit", outline:"none", lineHeight:"1.5" }} />
            <button onClick={send} disabled={loading||!input.trim()} style={{ background:input.trim()&&!loading?"#d4a853":"#1f1a08", color:input.trim()&&!loading?"#0d0d08":"#4a3f20", border:"none", borderRadius:"3px", padding:"8px 18px", fontSize:"12px", cursor:input.trim()&&!loading?"pointer":"default", fontFamily:"inherit", fontWeight:"bold", textTransform:"uppercase" }}>Enviar</button>
          </div>
        )}
      </div>
      <p style={{ color:"#2a2210", fontSize:"11px", marginTop:"14px" }}>📍 Avda. Moianès, Parc Esportiu La Quintana · @laquintanacir</p>
    </div>
  );
}

