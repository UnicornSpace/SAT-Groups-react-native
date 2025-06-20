
import { useAuth } from "@/utils/auth-context";
import axiosInstance from "@/utils/axions-instance";



export const getAllBranchList = async (driverId: any, token: any) => {
  const response = await axiosInstance.get("/get-location.php", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data

};


