export interface Report {
  report_id?: string;
  summary?: string;
  score?: number;
  feedback?: string;
  [key: string]: unknown;
}
