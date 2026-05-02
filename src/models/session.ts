export interface LearningSession {
  id: string;
  documentId: string;
  status: string;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export type LearningStep = 'loading' | 'chatting' | 'report';
