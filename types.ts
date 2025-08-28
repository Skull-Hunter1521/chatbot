import React from 'react';

export interface MenuOption {
  key: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  text: string | React.ReactNode;
  sender: 'user' | 'bot';
  options?: MenuOption[];
}

export interface ConversationHistory {
    id: string;
    userQuery: string;
    botResponse: string;
    language: Language;
    module: string | null;
    category: string;
    timestamp: string;
}

export enum Language {
  English = 'English',
  Hindi = 'Hindi',
  Gujarati = 'Gujarati',
}

export enum ChatState {
  GREETING,
  SELECTING_LANGUAGE,
  MAIN_MENU,
  APPOINTMENT_MENU,
  BILLING_MENU,
  CONFIGURATION_MENU,
  SHOWING_ANSWER,
  ASK_RESTART,
  ENDED,
}

export enum Module {
  Appointment = 'Appointment',
  Billing = 'Billing',
  Configuration = 'Configuration',
}

export enum Category {
  Key_Features = 'Key Features',
  Step_by_Step_Process = 'Step-by-Step Process',
  Troubleshooting = 'Troubleshooting',
  FAQs = 'FAQs',
}

export interface FaqData {
  id: number;
  module: string;
  category: string;
  question: string;
  answer: string;
  language: string;
}