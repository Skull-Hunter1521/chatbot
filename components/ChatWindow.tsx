
import React, { useRef, useEffect } from 'react';
import { ChatMessage, MenuOption } from '../types';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onOptionSelect: (key: string, label: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onOptionSelect }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg h-[75vh] flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} onOptionSelect={onOptionSelect} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
