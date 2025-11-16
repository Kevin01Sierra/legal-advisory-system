import { useRef, useEffect } from 'react';
import styles from '../../styles/components/Chat.module.css';

const ChatInput = ({ value, onChange, onSend, disabled, placeholder }) => {
  const textareaRef = useRef(null);

  // Auto-resize del textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
  }, [value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSend(value);
    }
  };

  const handleKeyDown = (e) => {
    // Enviar con Enter (sin Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <form className={styles.chatInputContainer} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.chatTextarea}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Escribe tu consulta...'}
          disabled={disabled}
          rows={1}
          maxLength={2000}
        />

        <div className={styles.inputActions}>
          <span className={styles.charCounter}>
            {value.length}/2000
          </span>

          <button
            type="submit"
            className={styles.sendButton}
            disabled={disabled || !value.trim()}
            title="Enviar mensaje (Enter)"
          >
            <span className={styles.sendIcon}>➤</span>
          </button>
        </div>
      </div>

      <div className={styles.inputHint}>
        <span className={styles.hintText}>
          Presiona <kbd>Enter</kbd> para enviar, <kbd>Shift + Enter</kbd> para nueva línea
        </span>
      </div>
    </form>
  );
};

export default ChatInput;