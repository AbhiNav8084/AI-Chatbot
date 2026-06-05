import { forwardRef } from "react";
import ThreeDEffects from "./ThreeDEffects";

const ChatMessages = forwardRef(function ChatMessages(
  { connectionError, hasAttemptedChat, isAiTyping, messages },
  ref
) {
  const shouldShowMessageList =
    messages.length > 0 || (hasAttemptedChat && connectionError);
  const shouldShowWelcome = !shouldShowMessageList;

  return (
    <div
      className={`chat-body ${
        shouldShowWelcome ? "is-empty" : "has-messages"
      }`}
      ref={ref}
    >
      {shouldShowWelcome && (
        <div className="empty-state-wrapper">
          <ThreeDEffects />
          <div className="empty-state">
            <span className="preview-badge">Early Preview</span>

            <h2>ChatGPT Clone</h2>

            <p>
              Ask anything. Paste text, brainstorm ideas, or get quick
              explanations. Your chats stay in the sidebar so you can pick up
              where you left off.
            </p>
          </div>
        </div>
      )}

      {shouldShowMessageList && (
        <div className="message-list">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.role}`}>
              {msg.text}
            </div>
          ))}

          {isAiTyping && <div className="message assistant">Thinking...</div>}

          {connectionError && (
            <div className="message error-message">{connectionError}</div>
          )}
        </div>
      )}
    </div>
  );
});

export default ChatMessages;
