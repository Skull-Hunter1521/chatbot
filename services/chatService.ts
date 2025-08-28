import { ChatState, Language, MenuOption, Module, Category, FaqData, ConversationHistory } from '../types';
import { TRANSLATIONS } from '../constants';
import React from 'react';

/**
 * This function simulates a GET request to your backend API to fetch data from the PostgreSQL database.
 */
const getFaqFromDatabase = async (module: string, category: string, language: Language): Promise<FaqData | null> => {
    console.log(`Simulating API call: GET /api/faq?module=${module}&category=${category}&language=${language}`);
    
    // In a real app, this would be a fetch call:
    /*
    try {
        const response = await fetch(`/api/faq?module=${encodeURIComponent(module)}&category=${encodeURIComponent(category)}&language=${encodeURIComponent(language)}`);
        if (!response.ok || response.status === 204) { // 204 No Content
            return null; 
        }
        const data: FaqData = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch FAQ data from API:", error);
        return null;
    }
    */

    // For demonstration, we return a mock response to show the flow.
    // This data would come from your PostgreSQL database via your Express API.
    if (module === 'Appointment' && category === 'Step-by-Step Process' && language === 'English') {
        return {
            id: 1,
            module: 'Appointment',
            category: 'Step-by-Step Process',
            question: 'How to book an appointment?',
            answer: 'This answer now comes from a simulated database API call! To book: 1. Go to Calendar. 2. Click a time slot. 3. Select client. 4. Choose services. 5. Save.',
            language: 'English'
        };
    }
    
    return null; // Simulate not finding an entry in the database.
}

// This function contains the core logic for the chatbot.
const getBotResponseLogic = async (
  currentState: ChatState,
  userSelectionKey: string,
  userSelectionLabel: string,
  language: Language,
  currentModule: string | null
): Promise<{ text: string | React.ReactNode; options?: MenuOption[]; newState: ChatState }> => {
  const T = TRANSLATIONS[language];

  switch (currentState) {
    case ChatState.GREETING:
      return {
        text: T.greeting,
        options: [
          { key: Language.English, label: 'English' },
          { key: Language.Hindi, label: 'हिन्दी' },
          { key: Language.Gujarati, label: 'ગુજરાતી' },
        ],
        newState: ChatState.GREETING,
      };
    
    case ChatState.SELECTING_LANGUAGE:
      return {
        text: T.mainMenuPrompt,
        options: [
            { key: Module.Appointment, label: T.appointment },
            { key: Module.Billing, label: T.billing },
            { key: Module.Configuration, label: T.configuration },
        ],
        newState: ChatState.MAIN_MENU,
      };

    case ChatState.MAIN_MENU:
      const selectedModule = userSelectionKey as Module;
      const nextStateMap: Record<Module, ChatState> = {
        [Module.Appointment]: ChatState.APPOINTMENT_MENU,
        [Module.Billing]: ChatState.BILLING_MENU,
        [Module.Configuration]: ChatState.CONFIGURATION_MENU,
      };
      const moduleKey = selectedModule.toLowerCase() as keyof typeof T;
      return {
        text: T.subMenuPrompt.replace('{module}', T[moduleKey]),
        options: [
            { key: Category.Key_Features, label: T.keyFeatures },
            { key: Category.Step_by_Step_Process, label: T.stepByStep },
            { key: Category.Troubleshooting, label: T.troubleshooting },
            { key: Category.FAQs, label: T.faqs },
            { key: 'back', label: T.backToMainMenu },
        ],
        newState: nextStateMap[selectedModule],
      };

    case ChatState.APPOINTMENT_MENU:
    case ChatState.BILLING_MENU:
    case ChatState.CONFIGURATION_MENU:
      if (userSelectionKey === 'back') {
         return getBotResponseLogic(ChatState.SELECTING_LANGUAGE, '', '', language, null);
      }
      
      const category = userSelectionKey as Category;
      const moduleName = currentModule || '';
      
      // Fetch the answer from your backend API, which queries the database
      const faqEntry = await getFaqFromDatabase(moduleName, category, language);
      
      const answerText = faqEntry ? (
        React.createElement('div', null,
          React.createElement('p', { className: "font-semibold mb-2" }, faqEntry.question),
          React.createElement('p', null, faqEntry.answer)
        )
      ) : T.noData;

      return {
        text: (
            React.createElement('div', null,
                React.createElement('p', { className: "mb-4 text-gray-500 italic dark:text-gray-400" }, T.confirmation.replace('{option}', userSelectionLabel)),
                answerText
            )
        ),
        options: [
            { key: 'main_menu', label: T.backToMainMenu },
            { key: 'exit', label: T.exit },
        ],
        newState: ChatState.ASK_RESTART,
      };

    case ChatState.ASK_RESTART:
        if(userSelectionKey === 'main_menu') {
            return getBotResponseLogic(ChatState.SELECTING_LANGUAGE, '', '', language, null);
        } else {
            return {
                text: T.thankYou,
                newState: ChatState.ENDED
            }
        }
        
    default:
      return getBotResponseLogic(ChatState.GREETING, '', '', Language.English, null);
  }
};

/**
 * PUBLIC API-LIKE FUNCTIONS
 * These functions simulate network calls to a backend.
 */

export const fetchBotResponse = async (
  currentState: ChatState,
  userSelectionKey: string,
  userSelectionLabel: string,
  language: Language,
  currentModule: string | null
): Promise<{ text: string | React.ReactNode; options?: MenuOption[]; newState: ChatState }> => {
  console.log('Simulating API call to fetch bot response...');
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1000));
  const result = await getBotResponseLogic(currentState, userSelectionKey, userSelectionLabel, language, currentModule);
  console.log('Received response from simulated API.');
  return result;
};

export const saveHistory = async (
    entry: Omit<ConversationHistory, 'id' | 'timestamp'>
): Promise<ConversationHistory> => {
    console.log('Simulating API call to save history:', entry);
    // In a real app, this would be a fetch call:
    /*
    try {
        const response = await fetch('/api/history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry),
        });
        const savedEntry: ConversationHistory = await response.json();
        return savedEntry;
    } catch (error) {
        console.error("Failed to save history:", error);
        // Fallback or re-throw
        throw error;
    }
    */

    return new Promise(resolve => {
        setTimeout(() => {
            const savedEntry: ConversationHistory = {
                ...entry,
                id: Date.now().toString(),
                timestamp: new Date().toISOString()
            };
            console.log('History saved in simulated DB:', savedEntry);
            resolve(savedEntry);
        }, 500);
    });
};
