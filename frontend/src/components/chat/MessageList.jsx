import Message from './Message';
import styles from '../../styles/components/Chat.module.css';

const MessageList = ({ messages, isTyping, messagesEndRef }) => {
  return (
    <div className={styles.messageList}>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}

      {isTyping && (
        <div className={styles.messageWrapper}>
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.messageHeader}>
              <span className={styles.messageAvatar}>🤖</span>
              <span className={styles.messageSender}>Asistente Legal</span>
            </div>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;