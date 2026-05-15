import React, { useState } from 'react';
import ChatWindow from './ChatWindow';
import './ChatWidget.css';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chat-widget-container">
      {isOpen && <ChatWindow onClose={() => setIsOpen(false)} />}
      
      {!isOpen && (
        <button 
          className="chat-trigger" 
          onClick={() => setIsOpen(true)}
          aria-label="Abrir asistente de chat"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
