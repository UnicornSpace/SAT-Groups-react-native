// types.ts
interface MilestoneStage {
  id: string;
  targetLiters: number;
  points: number;
  gift?: string;
  position: { x: number; y: number };
  label: string;
  isSpecial?: boolean; // For START point
}

interface UserProgress {
  currentLiters: number;
  completedStages: string[]; // Array of stage IDs
  totalPoints: number;
  unlockedGifts: string[];
}

// Example stages configuration
const MILESTONE_STAGES: MilestoneStage[] = [
  {
    id: 'start',
    targetLiters: 0,
    points: 0,
    position: { x: 160, y: 490 },
    label: 'START',
    isSpecial: true
  },
  {
    id: '50L',
    targetLiters: 50,
    points: 50,
    position: { x: 30, y: 448 },
    label: '50 L'
  },
  // Add all other stages...
];