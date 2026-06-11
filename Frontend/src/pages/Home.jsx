import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";

import ChatInput from "../components/ChatInput.jsx";
import ChatMessages from "../components/ChatMessages.jsx";
import ChatSidebar from "../components/ChatSidebar.jsx";
import ChatTopbar from "../components/ChatTopbar.jsx";
import "../styles/home.css";
import {
  addChat,
  appendMessage,
  clearMessages,
  setChats,
  setCurrentChat,
} from "../store/chatSlice.js";

const API_URL = "http://localhost:3000";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [hasAttemptedChat, setHasAttemptedChat] = useState(false);

  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat?.messages ?? []);
  const previousChats = useSelector((state) => state.chat?.chats ?? []);
  const activeChat = useSelector((state) => state.chat?.currentChat ?? null);

  const canvasRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/chat`, {
          withCredentials: true,
        });

        const chats = res.data.chats || [];
        dispatch(setChats(chats));
        if (chats.length > 0) {
          dispatch(setCurrentChat(chats[0]));
        }
      } catch (err) {
        console.warn("Failed to load chats:", err);
      }
    };

    fetchChats();
  }, [dispatch]);

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

      dispatch(appendMessage(aiMessage));
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


  const createChat = async (titleInput = "") => {
    const title = titleInput.trim() ? titleInput.trim().slice(0, 42) : "New Chat";

    const res = await axios.post(
      `${API_URL}/api/chat`,
      { title },
      { withCredentials: true }
    );

    const chat = res.data.chat;

    dispatch(addChat(chat));
    dispatch(setCurrentChat(chat));
    dispatch(clearMessages());

    return chat;
  };

  const handleNewChat = async () => {
    const titlePrompt = window.prompt("Enter a title for the new chat:", "New Chat");
    if (titlePrompt === null) return;

    setUserInput("");
    setIsAiTyping(false);
    setConnectionError("");
    setHasAttemptedChat(false);
    setMobileOpen(false);
    dispatch(clearMessages());

    try {
      await createChat(titlePrompt);
    } catch (err) {
      setConnectionError(
        err?.response?.data?.message || err.message || "Unable to create new chat."
      );
    }
  };

  const handleSelectChat = (chat) => {
    dispatch(setCurrentChat(chat));
    dispatch(clearMessages());
    setMobileOpen(false);
    setConnectionError("");
    setHasAttemptedChat(false);
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

    dispatch(appendMessage(userMessage));
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
