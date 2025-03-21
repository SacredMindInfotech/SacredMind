import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";


const OnlyPaidUsers = ({ children }: any) => {
    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { id } = useParams();

    useEffect(() => {

        const fetchIsPurchased = async () => {
            if (!isLoaded || !user) return;

            const token = await getToken();
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            try {

                const res = await axios.get(`${backendUrl}api/v1/user/isPurchase/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        clerkuserId: user.id
                    }
                });

                // @ts-ignore
                if (!res.data.purchased) {
                    navigate(`/course/${id}`);
                    return;
                }



            } catch (error: any) {
                if (error.status !== 200) {
                    navigate(`/course/${id}`);
                    return;
                }
                console.error("Error checking purchase:", error);
            }
        }
        fetchIsPurchased();
    }, [id, isLoaded, user]);

    return children;
}

export default OnlyPaidUsers;