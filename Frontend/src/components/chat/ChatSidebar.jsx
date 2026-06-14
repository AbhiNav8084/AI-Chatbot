import React from 'react';
import './ChatSidebar.css';


const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, onOpenSettings, user, open }) => {

  const displayName = user?.fullName
    ? `${user.fullName.firstName || ''} ${user.fullName.lastName || ''}`.trim()
    : '';

  
  return (
    <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Previous chats">
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>New</button>
      </div>
      <nav className="chat-list" aria-live="polite">
        {chats.map(c => (
          <button
            key={c._id}
            className={"chat-list-item " + (c._id === activeChatId ? 'active' : '')}
            onClick={() => onSelectChat(c._id)}
          >
            <span className="title-line">{c.title}</span>
          </button>
        ))}
        {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
      </nav>
      <div className="sidebar-footer">
        <button className="settings-btn" onClick={onOpenSettings} type="button">
          <span className="settings-avatar" aria-hidden="true">
            {(displayName || user?.email || 'U').charAt(0).toUpperCase()}
          </span>
          <span className="settings-user">
            <span>{displayName || 'Account'}</span>
            <small>{user?.email || 'Settings'}</small>
          </span>
        </button>
      </div>
    </aside>
  );
};

export default ChatSidebar;
