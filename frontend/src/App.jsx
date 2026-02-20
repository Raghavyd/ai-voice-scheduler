import { useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey 👋 I’m your AI scheduler. Just speak naturally and I’ll handle everything.",
      time: new Date(),
    },
  ]);

  const [session, setSession] = useState({});
  const [listening, setListening] = useState(false);
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  const scroll = () =>
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

  const addMessage = (role, text, link = null) => {
    setMessages((prev) => [
      ...prev,
      { role, text, link, time: new Date() },
    ]);
    scroll();
  };

  const speak = (text) => {
    speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.lang = "en-IN";
    speechSynthesis.speak(utter);
  };

  const listen = async () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Speech recognition not supported");

    const rec = new SR();
    rec.lang = "en-IN";

    setListening(true);
    rec.start();

    rec.onresult = async (e) => {
      const text = e.results[0][0].transcript;
      addMessage("user", text);
      setTyping(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, session }),
        });

        const data = await res.json();
        setSession(data.session);

        setTyping(false);
        addMessage("assistant", data.reply, data.link);
        speak(data.reply);
      } catch {
        setTyping(false);
        addMessage("assistant", "⚠️ Server error. Try again.");
      }
    };

    rec.onend = () => setListening(false);
  };

  const formatTime = (date) =>
    new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "numeric",
    }).format(date);

  return (
    <div className="app">
      {/* HEADER */}
      <div className="header">
        <div className="logo">🤖</div>
        <div>
          <h1>AI Voice Scheduler</h1>
          <p>Natural conversations. Real scheduling.</p>
        </div>
      </div>

      {/* CHAT */}
      <div className="chat">
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <div className="bubble">
              {msg.text}

              {msg.link && (
                <a href={msg.link} target="_blank" className="calendar-btn">
                  Open in Calendar →
                </a>
              )}
            </div>
            <span className="time">{formatTime(msg.time)}</span>
          </div>
        ))}

        {typing && (
          <div className="msg assistant">
            <div className="bubble typing">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      {/* MIC */}
      <button
        className={`mic ${listening ? "active" : ""}`}
        onClick={listen}
      >
        <div className="pulse" />
        {listening ? "Listening..." : "Tap to Speak"}
      </button>
    </div>
  );
}