import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const OnlyPaidUsers = ({ children }: any) => {
    const { courseId } = useParams();

    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const { getToken } = useAuth();

    useEffect(() => {

        const fetchIsPurchased = async () => {
            if (!isLoaded || !user) return;

            const token = await getToken();
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            try {

                console.log(courseId);
                const course=await axios.get(`${backendUrl}api/v1/course/id/${courseId}`);
                // @ts-ignore
                const firstThreeWords=course.data.title.split(" ").slice(0, 3).join(" ");
                
                const res = await axios.get(`${backendUrl}api/v1/user/isPurchase/${firstThreeWords}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        clerkuserId: user.id
                    }
                });
                console.log(res.data);

                // @ts-ignore
                if (!res.data.purchased) {
                    // navigate(`/course/${courseId}`);
                    return;
                }

            } catch (error: any) {
                if (error.status !== 200) {
                    // navigate(`/course/${courseId}`);
                    return;
                }
                console.error("Error checking purchase:", error);
            }
        }
        fetchIsPurchased();
    }, [courseId, isLoaded, user]);

    return children;
}

export default OnlyPaidUsers;