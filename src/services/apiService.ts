import { Work } from '@/models/work';
import { Report } from '@/models/report';

export interface ApiService {
  getWorks(): Promise<Work[]>;
  getWorkContent(workId: string): Promise<string[]>;
  startThinkingSession(workId: string): Promise<string>;
  getGuidance(workId: string, userAnswer: string): Promise<{
    text: string;
    is_finish: boolean;
    report?: Report;
  }>;
  submitResult(workId: string, logs: unknown): Promise<Record<string, unknown>>;
}
