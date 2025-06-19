import { useAuth } from "@/utils/auth-context";
import axiosInstance from "@/utils/axions-instance";

export const getMilestoneData = async (driverId: any, token: any) => {
  const response = await axiosInstance.post(
    `/get-user-milestones.php`,
    {
      driver_id: driverId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response

};


