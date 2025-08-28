
import React from 'react';
import { ChatMessage } from '../types';
import MenuOptions from './MenuOptions';
import { UserIcon, BotIcon } from './Icons';

interface MessageProps {
  message: ChatMessage;
  onOptionSelect: (key: string, label: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, onOptionSelect }) => {
  const isBot = message.sender === 'bot';

  const messageContainerClasses = isBot
    ? 'flex items-start gap-3 justify-start'
    : 'flex items-start gap-3 justify-end';

  const messageBubbleClasses = isBot
    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg rounded-tl-none'
    : 'bg-blue-500 text-white rounded-lg rounded-br-none';

  return (
    <div className={messageContainerClasses}>
      {isBot && <BotIcon className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" />}
      <div className="flex flex-col items-start max-w-md">
        <div className={`p-3 break-words ${messageBubbleClasses}`}>
            {typeof message.text === 'string' ? <p>{message.text}</p> : message.text}
        </div>
        {message.options && (
            <MenuOptions options={message.options} onSelect={onOptionSelect} />
        )}
      </div>
      {!isBot && <UserIcon className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" />}
    </div>
  );
};

export default Message;
