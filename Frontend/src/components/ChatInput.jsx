import { FiArrowUp, FiPaperclip } from "react-icons/fi";

export default function ChatInput({
  isAiTyping,
  onInputChange,
  onSend,
  userInput,
}) {
  return (
    <form className="input-wrapper" onSubmit={onSend}>
      <FiPaperclip />

      <input
        placeholder="Message Ai_bot_1.0..."
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
      />

      <button type="submit" disabled={isAiTyping || !userInput.trim()}>
        <FiArrowUp />
      </button>
    </form>
  );
}
