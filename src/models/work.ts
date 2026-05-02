export interface Work {
  id: string;
  title: string;
  author: string;
  category: string;
  baseColor: string;
  patternColor: string;
  spineColor: string;
  completedSets?: number;
  studyTime?: string;
  difficulty?: string;
}
