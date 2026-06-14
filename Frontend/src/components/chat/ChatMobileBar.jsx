import React from 'react';
import './ChatMobileBar.css';
import './ChatLayout.css';


const ChatMobileBar = ({ onToggleSidebar, onNewChat, onOpenSettings }) => (
  <header className="chat-mobile-bar">
    <button className="chat-icon-btn" onClick={onToggleSidebar} aria-label="Toggle chat history">Menu</button>
    <h1 className="chat-app-title">Chat</h1>
    <button className="chat-icon-btn" onClick={onOpenSettings} aria-label="Open settings">Set</button>
    <button className="chat-icon-btn" onClick={onNewChat} aria-label="New chat">New</button>
  </header>
);

export default ChatMobileBar;
