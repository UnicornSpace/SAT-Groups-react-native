// Milestone data structure
type Milestone = {
  id: string;
  status: "unclaimed" | "claimed" | "pending";
  requiredPoints: string | number ; // Points required to reach this milestone
  isCurrent?: boolean;
  rewardPoints: string,
  rewardType?: "Gift" | "Points"
  position: number;
};
// Component props
interface MilestonePathProps {
  milestones: Milestone[]; // Optional: Allow passing custom milestones
  totalPoints: number; // Total points earned by the user
}


export type { Milestone, MilestonePathProps };


