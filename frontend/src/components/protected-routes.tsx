//this is not used anywhere till now, but it is used to protect the routes from unauthenticated users
//if the user is not signed in, then it will redirect to the landing page with query parameter sign-in=true and the user will be shown the sign in modal

import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }: any) => {
    const { isSignedIn, isLoaded } = useUser();

    //if the user is not signed in, then it will redirect to the landing page
    if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
        return <Navigate to="/?sign-in=true" />
    }
    return children;
}



export default ProtectedRoutes;