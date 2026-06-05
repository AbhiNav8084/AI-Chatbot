import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import ChatInput from "../components/ChatInput.jsx";
import ChatMessages from "../components/ChatMessages.jsx";
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatTopbar from "../components/ChatTopbar.jsx";
import "../styles/home.css";

const API_URL = "http://localhost:3000";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [previousChats, setPreviousChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [hasAttemptedChat, setHasAttemptedChat] = useState(false);

  const canvasRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(API_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnectionError("");
    });

    socket.on("connect_error", (err) => {
      setIsAiTyping(false);
      setConnectionError(err.message || "Unable to connect to AI.");
    });

    socket.on("ai-response", (payload) => {
      const aiMessage = {
        id: `${payload.chat}-${Date.now()}`,
        role: "assistant",
        text: payload.content,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsAiTyping(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.scrollTop = canvasRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const createChat = async (firstMessage = "") => {
    const fallbackTitle = "New Chat";
    const title = firstMessage.trim()
      ? firstMessage.trim().slice(0, 42)
      : fallbackTitle;

    const res = await axios.post(
      `${API_URL}/api/chat`,
      { title },
      { withCredentials: true }
    );

    const chat = res.data.chat;

    setPreviousChats((prev) => {
      const chatAlreadyExists = prev.some((item) => item._id === chat._id);
      return chatAlreadyExists ? prev : [chat, ...prev];
    });

    setActiveChat(chat);
    return chat;
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveChat(null);
    setUserInput("");
    setIsAiTyping(false);
    setConnectionError("");
    setHasAttemptedChat(false);
    setMobileOpen(false);
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setMessages([]);
    setMobileOpen(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    const content = userInput.trim();
    if (!content || isAiTyping) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setConnectionError("");
    setHasAttemptedChat(true);
    setIsAiTyping(true);

    try {
      const chat = activeChat || (await createChat(content));

      socketRef.current?.emit("ai-message", {
        chat: chat._id,
        content,
      });
    } catch (err) {
      setIsAiTyping(false);
      setConnectionError(
        err?.response?.data?.message || err.message || "Message failed."
      );
    }
  };

  return (
    <main className="home">
      <ChatSidebar
        activeChat={activeChat}
        mobileOpen={mobileOpen}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        previousChats={previousChats}
      />

      {mobileOpen && (
        <div className="overlay" onClick={() => setMobileOpen(false)} />
      )}

      <section className="chat-section">
        <ChatTopbar
          onNewChat={handleNewChat}
          onOpenSidebar={() => setMobileOpen(true)}
        />

        <ChatMessages
          connectionError={connectionError}
          hasAttemptedChat={hasAttemptedChat}
          isAiTyping={isAiTyping}
          messages={messages}
          ref={canvasRef}
        />

        <ChatInput
          isAiTyping={isAiTyping}
          onInputChange={setUserInput}
          onSend={handleSend}
          userInput={userInput}
        />

        <div className="footer-note">
          AI CAN MAKE MISTAKES. CHECK IMPORTANT INFO.
        </div>
      </section>
    </main>
  );
}
