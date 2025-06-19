import MilestoneComponent from "@/components/milestone/milestone-component";
import { useEffect, useState } from "react";
import { useAuth } from "@/utils/auth-context";
import { getMilestoneData } from "@/api/milestone/milestone-data";

const milestone = () => {
  const { token, driverId } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Milestone[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await getMilestoneData(driverId, token);

        if (
          !response.data ||
          !response.data.mileStones ||
          response.status !== 200
        ) {
          setError("error fetching milestones");
          return;
        }
        const fetchedMilestones = response.data.mileStones;
        const fetchedTotalPoints = response.data.totalPoints;

        // Validate that milestones is an array and has valid data
        if (Array.isArray(fetchedMilestones) && fetchedMilestones.length > 0) {
          // Validate each milestone has required properties
          const validMilestones = fetchedMilestones.filter(
            (milestone) =>
              milestone &&
              milestone.hasOwnProperty("requiredPoints") &&
              milestone.requiredPoints !== undefined &&
              milestone.requiredPoints !== null
          );

          if (validMilestones.length > 0) {
            setData(validMilestones);
          } else {
            console.warn("No valid milestones found");
            setError("No valid milestones found");
          }
        } else {
          setError("Invalid milestones data format");
        }

        // Set total points with validation
        setTotalPoints(
          typeof fetchedTotalPoints === "number"
            ? fetchedTotalPoints
            : Number(fetchedTotalPoints) || 0
        );
      } catch (error) {
        console.error("Error fetching milestones:", error);
        // Use default data on error
        setData(data);
        setTotalPoints(0);
      }
    };

    if (driverId && token) {
      // Only fetch if we have required data
      fetchMilestones();
    }
  }, [driverId, token]);

  return <MilestoneComponent milestones={data} totalPoints={totalPoints} />;
};

export default milestone;
