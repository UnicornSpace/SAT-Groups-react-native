// Milestone data structure
type Milestone = {
  label: string;
  points?: number;
  isCurrent?: boolean;
  isAchieved?: boolean;
  iconType?: "gift" | "coins" | "check" | "star" | "flag";
};
// Component props
interface MilestonePathProps {
  milestones: Milestone[]; // Optional: Allow passing custom milestones
  totalPoints: number; // Total points earned by the user
}




type MilestonePath = {
  id: string;
  position: number;
  requiredPoints: string;
  rewardPoints: string;
  rewardType: string;
  status: string;
}[]
