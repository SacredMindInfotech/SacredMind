import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const OnlyAdmin = ({ children }: any) => {

    const { user, isLoaded } = useUser();
    const navigate = useNavigate();
    const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS as string

    useEffect(() => {

        const checkIsAdmin = async () => {
            if (!isLoaded || !user) return;
            try {
                const userEmail = user.emailAddresses[0]
                if (ADMIN_EMAILS) {
                    const adminEmails = ADMIN_EMAILS.split(',')
                    if (!adminEmails.includes(userEmail.emailAddress)) {
                        navigate('/')
                        return
                    }
                }else{
                    navigate('/');
                }

            } catch (error: any) {
                navigate(`/`);
                console.error("Error checking purchase:", error);
                return;
            }
        }
        checkIsAdmin();
    }, [isLoaded, user])

    return children;
}

export default OnlyAdmin;