// import InstallReferrer from 'react-native-install-referrer';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const fetchAndStoreReferral = async () => {
//   try {
//     const referrerDetails = await InstallReferrer.getInstallReferrer();
//     const rawReferrer = referrerDetails.installReferrer;

//     console.log("Install Referrer Received:", rawReferrer);

//     if (rawReferrer?.startsWith("ref_")) {
//       const referralCode = rawReferrer.split("ref_")[1];
//       await AsyncStorage.setItem("referredBy", referralCode);
//       console.log("Referral code saved:", referralCode);
//     }
//   } catch (err) {
//     console.error("Error reading Install Referrer", err);
//   }
// };
