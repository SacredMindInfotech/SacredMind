import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";


interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    categoryId: number;
    category: {
        name: string;
    };
    overview: string[] | null;
    learningOutcomes: string[] | null;
    requirements: string[] | null;
    forwhom: string[] | null;
    language: string;
}

const CourseContent = () => {
    const {id} = useParams();
    const [course,setCourse] = useState<Course | null>(null);
    const [loading,setLoading] = useState(true);
    const { user,isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isPurchased, setIsPurchased] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIsPurchased = async () => {
            if (!isLoaded || !user) return;
        
            const token = await getToken();
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            try{

            const res = await axios.get(`${backendUrl}api/v1/user/isPurchase/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    clerkuserId: user.id
                }
            });
            
            // @ts-ignore
            setIsPurchased(res.data.purchased);

            if (!loading && !isPurchased) {
                    navigate(`/course/${id}`); // Replace '/some-other-page' with the desired path
                }
            } catch (error:any) {
                if(error.status!==200){
                    setIsPurchased(false);
                    navigate(`/course/${id}`); 
                    return;
                }
                console.error("Error checking purchase:", error);
            }
        }
        fetchIsPurchased();
    }, [id,isLoaded,user]);


    
    useEffect(() => {
        const fetchCourse = async () => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const res = await axios.get(`${backendUrl}api/v1/course/${id}`);
            setCourse(res.data as Course);
            setLoading(false);
        }
        fetchCourse();
    }, [id]);

    // useEffect(() => {
    //     if (!loading && !isPurchased) {
    //         navigate(`/course/${id}`); // Replace '/some-other-page' with the desired path
    //     }
    // }, [loading, isPurchased]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="relative w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <section className="relative text-black">
                    <div className="relative z-10 container mx-auto">
                        <div className="flex flex-col gap-12">
                            {/* Hero Section */}
                            <div className="flex flex-col p-8 md:p-16 lg:p-28 bg-gray-100 justify-center">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 montserrat-700">
                                    {course?.title}
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-xl">
                                    Explore the course modules and lessons.
                                </p>
                            </div>

                            {/* Content Section */}
                            <div className="flex flex-col justify-center py-8 md:py-16">
                                <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-lg max-w-2xl mx-auto w-full">
                                    <div className="space-y-4 md:space-y-6">
                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold mb-4">Congratulations! You have enrolled in the course.</h2>
                                            <p className="text-gray-600 mb-4">Live Classes will begin on April 1st, 2025</p>
                                            {/* <p className="text-gray-600 mb-4">Then you will be joining through the live class</p> */}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default CourseContent;