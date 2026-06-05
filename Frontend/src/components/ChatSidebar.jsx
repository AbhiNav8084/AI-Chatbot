import {
  FiArchive,
  FiClock,
  FiHelpCircle,
  FiLogOut,
  FiPlusCircle,
  FiSettings,
} from "react-icons/fi";

export default function ChatSidebar({
  activeChat,
  mobileOpen,
  onNewChat,
  onSelectChat,
  previousChats,
}) {
  return (
    <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
      <div className="profile">
        <div className="avatar" />

        <div>
          <h3>AI_ASSISTANT</h3>
          <span>PRO_PLAN</span>
        </div>
      </div>

      <button className="new-chat" onClick={onNewChat}>
        <FiPlusCircle />
        NEW_CHAT
      </button>

      <nav className="chat-list" aria-label="Previous chats">
        <span className="sidebar-label">
          <FiClock />
          PREVIOUS_CHATS
        </span>

        {previousChats.length === 0 ? (
          <p className="empty-chat-list">NO_CHATS_YET</p>
        ) : (
          previousChats.map((chat) => (
            <button
              className={`chat-list-item ${
                activeChat?._id === chat._id ? "active" : ""
              }`}
              key={chat._id}
              onClick={() => onSelectChat(chat)}
            >
              <FiClock />
              <span>{chat.title}</span>
            </button>
          ))
        )}
      </nav>

      <div className="sidebar-bottom">
        <a href="#">
          <FiArchive />
          ARCHIVE
        </a>

        <a href="#">
          <FiSettings />
          SETTINGS
        </a>

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
  );
}
