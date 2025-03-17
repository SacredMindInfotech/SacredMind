import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";


interface Module {
    id: number;
    title: string;
    topics: Topic[];
}

interface Topic {
    id: number;
    title: string;
    description: string;
    contents: Content[];
}

interface Content {
    id: number;
    name: string;
    type: string;
    key: string;
}

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    isActive: boolean;
    isStarted: boolean;
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
    modules: Module[];
}

const CourseContent = () => {
    const { id } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const [isPurchased, setIsPurchased] = useState<boolean>(false);
    const navigate = useNavigate();
    const [openedModule, setOpenedModule] = useState<number[]>([0]);
    const [openedTopic, setOpenedTopic] = useState<string[]>([]);


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
                setIsPurchased(res.data.purchased);

                if (!loading && !isPurchased) {
                    navigate(`/course/${id}`);
                }
            } catch (error: any) {
                if (error.status !== 200) {
                    setIsPurchased(false);
                    navigate(`/course/${id}`);
                    return;
                }
                console.error("Error checking purchase:", error);
            }
        }
        fetchIsPurchased();
    }, [id, isLoaded, user]);



    useEffect(() => {
        const fetchCourse = async () => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const token = await getToken();
            const res = await axios.get(`${backendUrl}api/v1/content/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            // @ts-ignore
            console.log(res.data.modules);
            setCourse(res.data as Course);
            setLoading(false);
        }
        fetchCourse();
    }, [id]);


    if (loading) return <div>Loading...</div>;

    return (
        <div className="relative w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-8">
                <section className="relative text-black">
                    <div className="relative z-10 container mx-auto">
                        <div className="flex flex-col gap-8">
                            {/* Hero Section */}
                            <div className="flex flex-col p-6 md:p-12 lg:p-20 bg-gray-100 justify-center">
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 montserrat-700">
                                    {course?.title}
                                </h1>
                                <p className="text-md md:text-lg lg:text-xl mb-6 max-w-xl">
                                    Explore the course modules and lessons.
                                </p>
                            </div>

                            {/* Content Section */}
                            {course?.isStarted === false && (
                                <div className="flex flex-col justify-center py-6 md:py-12">
                                    <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg max-w-2xl mx-auto w-full">
                                        <div className="space-y-4 md:space-y-5">
                                            <div className="text-center">
                                                <h2 className="text-xl font-bold mb-3">Congratulations! You have enrolled in the course.</h2>
                                                <p className="text-gray-600 mb-3">Live Classes will begin on April 1st, 2025</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                {course?.modules?.map((module, moduleIndex) => {
                                    return (
                                        <div key={moduleIndex} className="bg-white/10 backdrop-blur-md p-4 rounded-lg mb-4">
                                            <div
                                                className="flex justify-between items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 rounded-lg p-2"
                                                onClick={() => {
                                                    if (openedModule?.includes(moduleIndex)) {
                                                        setOpenedModule(openedModule.filter(index => index !== moduleIndex))
                                                    } else {
                                                        setOpenedModule([...(openedModule), moduleIndex])
                                                    }
                                                }}
                                            >
                                                <h3 className="text-lg font-semibold mb-3 montserrat-700">
                                                    Module {moduleIndex + 1}: {module.title}
                                                </h3>
                                                <svg
                                                    className={`w-5 h-5 transition-transform duration-300 ease-in-out ${openedModule?.includes(moduleIndex) ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                            {openedModule?.includes(moduleIndex) && (
                                                <div className="space-y-3 pl-3">
                                                    {module.topics?.map((topic, topicIndex) => (
                                                        <div key={`${moduleIndex}-${topicIndex}`} className="border-l-2 border-gray-500 pl-3">
                                                            <div className="flex gap-2 items-center cursor-pointer" onClick={
                                                                () => {
                                                                    const topicKey = `${moduleIndex}-${topicIndex}`;
                                                                    if (openedTopic?.includes(topicKey)) {
                                                                        setOpenedTopic(openedTopic.filter(index => index !== topicKey))
                                                                    } else {
                                                                        setOpenedTopic([...(openedTopic), topicKey])
                                                                    }
                                                                }
                                                            } >
                                                                <h4 className="text-md font-medium mb-2">
                                                                    {topicIndex + 1}. {topic.title}
                                                                </h4>
                                                                <svg className={`w-5 h-5 transition-transform duration-300 ease-in-out ${openedTopic?.includes(`${moduleIndex}-${topicIndex}`) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </div>
                                                            {openedTopic?.includes(`${moduleIndex}-${topicIndex}`) && (
                                                                <p className="text-gray-600 text-sm">
                                                                    {topic.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default CourseContent;