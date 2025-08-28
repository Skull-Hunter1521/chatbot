import React, { useState, useEffect, useCallback } from 'react';
import { ChatMessage, ChatState, Language, MenuOption, ConversationHistory } from './types';
import { fetchBotResponse, saveHistory } from './services/chatService';
import ChatWindow from './components/ChatWindow';
import { BotIcon } from './components/Icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatState, setChatState] = useState<ChatState>(ChatState.GREETING);
  const [language, setLanguage] = useState<Language>(Language.English);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [history, setHistory] = useState<ConversationHistory[]>([]);

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    setMessages(prev => [...prev, { ...message, id: Date.now().toString() + Math.random() }]);
  }, []);

  const processBotResponse = useCallback((response: { text: string | React.ReactNode; options?: MenuOption[]; newState: ChatState; }) => {
    const botMessage = {
      sender: 'bot' as const,
      text: response.text,
      options: response.options,
    };
    addMessage(botMessage);
    setChatState(response.newState);
    setIsLoading(false);
    return botMessage;
  }, [addMessage]);
  
  const handleUserSelection = useCallback(async (key: string, label: string) => {
    const userMessage = { sender: 'user' as const, text: label };
    addMessage(userMessage);
    setIsLoading(true);

    // This is to prevent the old options from being clickable
    setMessages(prev => prev.map(msg => ({ ...msg, options: undefined })));

    let response;
    if (chatState === ChatState.GREETING) {
      const selectedLang = key as Language;
      setLanguage(selectedLang);
      response = await fetchBotResponse(ChatState.SELECTING_LANGUAGE, key, label, selectedLang, null);
    } else if (chatState === ChatState.MAIN_MENU) {
      setCurrentModule(key);
      response = await fetchBotResponse(ChatState.MAIN_MENU, key, label, language, null);
    } else if (chatState === ChatState.ASK_RESTART) {
      response = await fetchBotResponse(ChatState.ASK_RESTART, key, label, language, null);
    } else {
      response = await fetchBotResponse(chatState, key, label, language, currentModule);
    }
    
    const botMessage = processBotResponse(response);

    // Save history
    const historyEntry: Omit<ConversationHistory, 'id' | 'timestamp'> = {
        userQuery: userMessage.text,
        // Ensure botResponse is a string for the database
        botResponse: typeof botMessage.text === 'string' ? botMessage.text : 'Interactive Content',
        language: language,
        module: currentModule,
        category: key,
    };
    
    const savedEntry = await saveHistory(historyEntry);
    setHistory(prev => [...prev, savedEntry]);


  }, [addMessage, chatState, language, currentModule, processBotResponse]);

  useEffect(() => {
    const initializeChat = async () => {
      const initialResponse = await fetchBotResponse(ChatState.GREETING, '', '', Language.English, null);
      processBotResponse(initialResponse);
    };
    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-screen items-center justify-center p-4 bg-gray-100 dark:bg-gray-800 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center mb-4 pl-2">
            <BotIcon className="h-8 w-8 text-blue-500"/>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white ml-2">SaloonSoft Assistant</h1>
        </div>
        <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onOptionSelect={handleUserSelection}
        />
      </div>
    </div>
  );
};

export default App;