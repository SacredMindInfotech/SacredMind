import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

import { LoadingScreen } from "./loadingScreen";
import { SecureVideo, VideoProtection } from "./videoPlayer";

const ViewContent = () => {

    const { id } = useParams();
    const [fileUrl, setFileUrl] = useState("");
    const { contentKey } = useParams();
    const { isLoaded, user } = useUser();
    const { getToken } = useAuth();
    const navigate = useNavigate();


    const fetchFile = async (filePath: string) => {
        try {
            const token = await getToken();
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.get(`${backendUrl}api/v1/content/${id}/stream-file`, {
                params: { filePath },
                responseType: "blob", // Ensures response is treated as a binary file
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            //@ts-ignore
            const url = URL.createObjectURL(response.data);
            setFileUrl(url);
        } catch (error) {
            console.error("Error fetching file:", error);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (isLoaded) {
            if (!user) {
                navigate("/");
                return;
            }
        }
        if (isLoaded && user) {
            fetchFile(contentKey as string);
        }
    }, [contentKey, isLoaded, user]);

    if (!fileUrl) {
        return  <LoadingScreen />
    }

   

    return (
        <div className="min-h-screen mt-10 flex flex-col items-center">
            <div className="w-full ml-4 flex justify-start">
                <button 
                    onClick={() => navigate(`/course/${id}/content`)} 
                    className="w-full hidden md:flex max-w-44 px-4 py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer  items-center justify-center sm:w-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to Course
                </button>
            </div>
            <div className="flex justify-center">
                {fileUrl && (
                    <div className="flex flex-col md:flex-row min-w-full md:min-w-2/3 justify-center mt-7">
                        {contentKey?.endsWith(".pdf") ? (
                            <a href={fileUrl} target="_blank" download={`${contentKey}`} className="cursor-pointer underline text-center">
                                Click here to download the PDF file
                            </a>
                        ) : contentKey?.match(/\.(mp4|webm|ogg)$/) ? (
                            <div className="w-full sm:mt-20 md:w-3/5 h-60 md:h-96 flex justify-center items-center">
                                <VideoProtection>
                                <SecureVideo src={fileUrl} />
                                </VideoProtection>
                            </div>
                        ) : contentKey?.match(/\.(jpg|jpeg|png|gif)$/) ? (
                            <img src={fileUrl} alt="File Preview" className="w-full md:w-auto h-60 md:h-96" style={{ objectFit: 'contain' }} />
                        ) : contentKey?.match(/\.(xlsx|xls|csv)$/) ? (
                            <a href={fileUrl} target="_blank" download={`${contentKey}`} className="underline cursor-pointer text-center">
                                Click here to download the Excel file
                            </a>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewContent;