
import React from 'react';
import { BotIcon } from './Icons';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 justify-start">
        <BotIcon className="h-6 w-6 text-gray-500 flex-shrink-0 mt-1" />
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 inline-flex items-center space-x-1.5">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
        </div>
    </div>
  );
};

export default TypingIndicator;
