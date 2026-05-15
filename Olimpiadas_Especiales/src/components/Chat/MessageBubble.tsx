import React from 'react';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ role, content }) => {
  return (
    <div className={`message-bubble ${role}`}>
      {content}
    </div>
  );
};

export default MessageBubble;
