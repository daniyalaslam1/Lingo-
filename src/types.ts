export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
];

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface LessonContent {
  id: string;
  title: string;
  type: 'vocabulary' | 'grammar' | 'conversation';
  content: string;
  translation?: string;
  examples: string[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
}

export interface FeedbackResponse {
  isCorrect: boolean;
  correction?: string;
  explanation: string;
  suggestions: string[];
}
