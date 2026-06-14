import React, { useCallback, useEffect, useState } from 'react';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import ChatMobileBar from '../components/chat/ChatMobileBar.jsx';
import ChatSidebar from '../components/chat/ChatSidebar.jsx';
import ChatMessages from '../components/chat/ChatMessages.jsx';
import ChatComposer from '../components/chat/ChatComposer.jsx';
import '../components/chat/ChatLayout.css';
import { fakeAIReply } from '../components/chat/aiClient.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  ensureInitialChat,
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  addUserMessage,
  addAIMessage,
  setChats
} from '../store/chatSlice.js';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const chats = useSelector(state => state.chat.chats);
  const activeChatId = useSelector(state => state.chat.activeChatId);
  const input = useSelector(state => state.chat.input);
  const isSending = useSelector(state => state.chat.isSending);
  const [ sidebarOpen, setSidebarOpen ] = React.useState(false);
  const [ socket, setSocket ] = useState(null);
  const [ user, setUser ] = useState(null);
  const [ authChecking, setAuthChecking ] = useState(true);
  const [ settingsOpen, setSettingsOpen ] = useState(false);
  const [ loggingOut, setLoggingOut ] = useState(false);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const [ messages, setMessages ] = useState([
  ]);

  const handleNewChat = async () => {
    // Prompt user for title of new chat, fallback to 'New Chat'
    let title = window.prompt('Enter a title for the new chat:', '');
    if (title) title = title.trim();
    if (!title) return

    const response = await axios.post("https://ai-chatbot-8mzp.onrender.com/api/chat", {
      title
    }, {
      withCredentials: true
    })
    getMessages(response.data.chat._id);
    dispatch(startNewChat(response.data.chat));
    setSidebarOpen(false);
  }

  // Ensure the user is logged in before loading chats.
  useEffect(() => {

    let tempSocket;
    let cancelled = false;

    async function bootChat() {
      try {
        const authResponse = await axios.get("https://ai-chatbot-8mzp.onrender.com/api/auth/me", { withCredentials: true });

        if (cancelled) return;

        setUser(authResponse.data.user);

        const chatsResponse = await axios.get("https://ai-chatbot-8mzp.onrender.com/api/chat", { withCredentials: true });

        if (cancelled) return;

        dispatch(setChats(chatsResponse.data.chats.reverse()));

        tempSocket = io("https://ai-chatbot-8mzp.onrender.com", {
          withCredentials: true,
        })

        tempSocket.on("ai-response", (messagePayload) => {
          console.log("Received AI response:", messagePayload);

          if (messagePayload.chat !== activeChatId) {
            dispatch(sendingFinished());
            return;
          }
          setMessages((prevMessages) => [ ...prevMessages, {
            type: 'ai',
            content: messagePayload.content
          } ]);

          dispatch(sendingFinished());
        });

        setSocket(tempSocket);
      } catch (err) {
        console.error(err);
        navigate('/login', { replace: true });
      } finally {
        if (!cancelled) setAuthChecking(false);
      }
    }

    bootChat();

    return () => {
      cancelled = true;
      tempSocket?.disconnect();
    };

  }, [ dispatch, navigate ]);

  const sendMessage = async () => {

    const trimmed = input.trim();
    console.log("Sending message:", trimmed);
    if (!trimmed || !activeChatId || isSending) return;
    dispatch(sendingStarted());

    const newMessages = [ ...messages, {
      type: 'user',
      content: trimmed
    } ];

    console.log("New messages:", newMessages);

    setMessages(newMessages);
    dispatch(setInput(''));

    if (!socket) {
      dispatch(sendingFinished());
      return;
    }

    socket.emit("ai-message", {
      chat: activeChatId,
      content: trimmed
    })

  }

  const getMessages = async (chatId) => {

   const response = await  axios.get(`https://ai-chatbot-8mzp.onrender.com/api/chat/messages/${chatId}`, { withCredentials: true })

   console.log("Fetched messages:", response.data.messages);

   setMessages(response.data.messages.map(m => ({
     type: m.role === 'user' ? 'user' : 'ai',
     content: m.content
   })));

  }

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await axios.post("https://ai-chatbot-8mzp.onrender.com/api/auth/logout", {}, {
        withCredentials: true
      });
    } catch (err) {
      console.error(err);
    } finally {
      socket?.disconnect();
      setLoggingOut(false);
      navigate('/login', { replace: true });
    }
  }

  const displayName = user?.fullName
    ? `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim()
    : '';

  if (authChecking) {
    return (
      <div className="chat-layout minimal">
        <main className="chat-main auth-loading" role="main">
          <div className="chat-welcome" aria-hidden="true">
            <div className="chip">Loading</div>
            <h1>Checking session</h1>
            <p>Please wait while your account is verified.</p>
          </div>
        </main>
      </div>
    );
  }


return (
  <div className="chat-layout minimal">
    <ChatMobileBar
      onToggleSidebar={() => setSidebarOpen(o => !o)}
      onNewChat={handleNewChat}
      onOpenSettings={() => setSettingsOpen(true)}
    />
    <ChatSidebar
      chats={chats}
      activeChatId={activeChatId}
      onSelectChat={(id) => {
        dispatch(selectChat(id));
        setSidebarOpen(false);
        getMessages(id);
      }}
      onNewChat={handleNewChat}
      onOpenSettings={() => {
        setSidebarOpen(false);
        setSettingsOpen(true);
      }}
      user={user}
      open={sidebarOpen}
    />
    <main className="chat-main" role="main">
      {messages.length === 0 && (
        <div className="chat-welcome" aria-hidden="true">
          <div className="chip">Early Preview</div>
          <h1>ChatGPT Clone</h1>
          <p>Ask anything. Paste text, brainstorm ideas, or get quick explanations. Your chats stay in the sidebar so you can pick up where you left off.</p>
        </div>
      )}
      <ChatMessages messages={messages} isSending={isSending} />
      {
        activeChatId &&
        <ChatComposer
          input={input}
          setInput={(v) => dispatch(setInput(v))}
          onSend={sendMessage}
          isSending={isSending}
        />}
    </main>
    {sidebarOpen && (
      <button
        className="sidebar-backdrop"
        aria-label="Close sidebar"
        onClick={() => setSidebarOpen(false)}
      />
    )}
    {settingsOpen && (
      <div className="settings-overlay" role="presentation" onMouseDown={() => setSettingsOpen(false)}>
        <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title" onMouseDown={(e) => e.stopPropagation()}>
          <header className="settings-header">
            <div>
              <p>Settings</p>
              <h2 id="settings-title">Account</h2>
            </div>
            <button className="settings-close" type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings">Close</button>
          </header>
          <div className="settings-profile">
            <div className="settings-profile-avatar" aria-hidden="true">
              {(displayName || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <span>Username</span>
              <strong>{displayName || 'User'}</strong>
            </div>
          </div>
          <div className="settings-row">
            <span>Email</span>
            <strong>{user?.email || 'Not available'}</strong>
          </div>
          <button className="logout-btn" type="button" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </section>
      </div>
    )}
  </div>
);
};

export default Home;
