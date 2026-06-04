import { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiPlusCircle,
  FiPaperclip,
  FiArrowUp,
  FiClock,
  FiArchive,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";

import "../styles/home.css";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    text: "Imagine you're trying to find a specific name in a giant phone book.\n\nA regular computer is like reading every single name, one by one, from the first page to the last until you find it. It works, but it takes time.\n\nA quantum computer is like magically looking at every single page in the book at the exact same time.",
  },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.scrollTop = canvasRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMsg]);

    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "This is a sample assistant reply.",
        },
      ]);
    }, 700);
  };

  return (
    <main className="home">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="profile">
          <div className="avatar" />

          <div>
            <h3>AI_ASSISTANT</h3>
            <span>PRO_PLAN</span>
          </div>
        </div>

        <button className="new-chat">
          <FiPlusCircle />
          NEW_CHAT
        </button>

        <nav>
          <a href="#">
            <FiPlusCircle />
            NEW_CHAT
          </a>

          <a href="#">
            <FiClock />
            HISTORY
          </a>

          <a href="#">
            <FiArchive />
            ARCHIVE
          </a>

          <a href="#" className="active">
            <FiSettings />
            SETTINGS
          </a>
        </nav>

        <div className="sidebar-bottom">
          <a href="#">
            <FiHelpCircle />
            HELP
          </a>

          <a href="#">
            <FiLogOut />
            LOGOUT
          </a>
        </div>
      </aside>

      {mobileOpen && (
        <div className="overlay" onClick={() => setMobileOpen(false)} />
      )}

      <section className="chat-section">
        <header className="topbar">
          <button
            className="icon-btn mobile-only"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu />
          </button>

          <h1>GPT-40</h1>

          <button className="icon-btn">
            <FiPlusCircle />
          </button>
        </header>

        <div className="chat-body" ref={canvasRef}>
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="robot">🤖</div>

              <h2>HOW CAN I HELP YOU TODAY?</h2>

              <div className="suggestion">
                Explain quantum computing in simple terms.
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}
        </div>

        <form className="input-wrapper" onSubmit={handleSend}>
          <FiPaperclip />

          <input
            placeholder="Message GPT-40..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button type="submit">
            <FiArrowUp />
          </button>
        </form>

        <div className="footer-note">
          AI CAN MAKE MISTAKES. CHECK IMPORTANT INFO.
        </div>
      </section>
    </main>
  );
}
