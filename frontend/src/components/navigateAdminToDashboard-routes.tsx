// import { useUser } from "@clerk/clerk-react";
// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import axios from "axios";

// const NavigateAdminToDashboard = ({ children }: any) => {
//     const { isSignedIn, isLoaded, user } = useUser();
//     const [isAdmin, setIsAdmin] = useState(false);

//     const backendUrl = import.meta.env.VITE_BACKEND_URL;
//     const clerkuserId = user?.id;

//     useEffect(() => {
//         if (!clerkuserId || !backendUrl) return; // Ensure necessary values exist before making a request

//         const fetchUser = async () => {
//             try {
//                 console.log("Fetching user data for:", clerkuserId);
//                 const res = await axios.get(`${backendUrl}/api/v1/user/${clerkuserId}`);

//                 if (res.data.role === "ADMIN") {
//                     setIsAdmin(true);
//                 }
//             } catch (error) {
//                 console.error("Error fetching user data:", error);
//             }
//         };

//         fetchUser();
//     }, [clerkuserId, backendUrl]); // Added dependencies

//     if (isLoaded && isSignedIn && isAdmin) {
//         return <Navigate to="/admin" />;
//     }

//     return children;
// };

// export default NavigateAdminToDashboard;
