import { useEffect, useState } from "react";
import { getMilestoneData } from "@/api/milestone/milestone-data";

export const useMilestoneState = (initialPoints: any, milestoneData: Milestone[], driverId: any, token: any) => {
  const [totalPoints, setTotalPoints] = useState(initialPoints);
  const [milestones, setMilestones] = useState<Milestone[]>(milestoneData);

  useEffect(() => {
    setTotalPoints(initialPoints);
    setMilestones(milestoneData);
  }, [initialPoints, milestoneData]);

  const fetchMilestones = async () => {
    const response = await getMilestoneData(driverId, token);
    if (response.data?.milestones) {
      setMilestones(response.data.milestones);
      if (response.data.totalPoints !== undefined) {
        setTotalPoints(response.data.totalPoints);
      }
    }
  };

  return { totalPoints, milestones, setTotalPoints, setMilestones, fetchMilestones };
};
