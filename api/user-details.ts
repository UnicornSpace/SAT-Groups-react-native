import { useAuth } from "@/utils/auth-context";
import axiosInstance from "@/utils/axions-instance";



export const getUserDetails = async ( driverId:any, token:any ) => {
  const response = await axiosInstance.post(
    "/user-details.php",
    { driver_id: driverId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data

};


