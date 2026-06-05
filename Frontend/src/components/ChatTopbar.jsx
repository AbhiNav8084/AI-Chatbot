import { FiMenu, FiPlusCircle } from "react-icons/fi";

export default function ChatTopbar({ onNewChat, onOpenSidebar }) {
  return (
    <header className="topbar">
      <button
        className="icon-btn mobile-only"
        onClick={onOpenSidebar}
        type="button"
        aria-label="Open sidebar"
      >
        <FiMenu />
      </button>

      <h1>Ai_bot_1.0</h1>

      <button
        className="icon-btn"
        onClick={onNewChat}
        type="button"
        aria-label="Start new chat"
      >
        <FiPlusCircle />
      </button>
    </header>
  );
}
