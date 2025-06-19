import { useAuth } from "@/utils/auth-context";
import axiosInstance from "@/utils/axions-instance";

export const claimMilestone = async (driverId: any, token: any,milestoneId:any) => {
  const response = await axiosInstance.post(
    `/claim-user-milestones.php`,
    {
      driver_id: driverId,
      mileStoneId: milestoneId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response

};


