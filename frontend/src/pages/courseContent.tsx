import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import CourseContentPageLoader from "../components/ui/loaders/CourseContentPageLoader";


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
    showCourseNotice: boolean;
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
    courseNotice: string | null;
}

const CourseContent = () => {
    const { courseId } = useParams();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [openedModule, setOpenedModule] = useState<number[]>([0]);
    const [openedTopic, setOpenedTopic] = useState<string[]>([]);



    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);



    //fetching the course content
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const token = await getToken();
                const res = await axios.get(`${backendUrl}api/v1/course/id/${courseId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                // if (res.status === 204) {
                //     navigate("/");
                // }
                setCourse(res.data as Course);
            } catch (error) {
                // navigate("/");
            }
        }
        fetchCourse();
        setLoading(false);
    }, [courseId]);


    if (loading) return <CourseContentPageLoader />;

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
                                <p className="text-md md:text-lg lg:text-xl mb-6 max-w-xl montserrat-500">
                                    Explore the course modules and lessons.
                                </p>
                                <button
                                    className="w-full max-w-40 md:w-36 px-4 py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer flex items-center justify-center sm:w-auto"
                                    onClick={() => {
                                        const firstThreeWords = course!.title.toLowerCase().split(' ').slice(0, 3).join(' ');
                                        const encodedTitle = firstThreeWords
                                            .replace(/-/g, "_") 
                                            .replace(/\s+/g, '-');
                                        navigate(`/course/${encodedTitle}`);
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Overview
                                </button>
                            </div>

                            {/* Course Notice Section */}
                            {course?.showCourseNotice && course?.courseNotice ? (
                                <div className="flex flex-col justify-center py-6">
                                    <div className="bg-gradient-to-br from-gray-300 to-white p-4 rounded-lg shadow-sm">
                                        <div className="text-center montserrat-500 text-gray-700">
                                            {course.courseNotice}
                                        </div>
                                    </div>
                                </div>
                            ) : null }

                            {/* Modules Section */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl montserrat-700">Course Content</span>
                                    <span className="text-xl">📚</span>
                                </div>
                                <div className="bg-gradient-to-br from-gray-300 to-white p-4 rounded-lg shadow-sm">
                                    {course?.modules?.map((module, moduleIndex) => (
                                        <div key={moduleIndex} className="bg-gray-100 p-4 rounded-lg mb-4">
                                            <div
                                                className="flex justify-between items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-200 rounded-lg p-2"
                                                onClick={() => {
                                                    if (openedModule?.includes(moduleIndex)) {
                                                        setOpenedModule(openedModule.filter(index => index !== moduleIndex))
                                                    } else {
                                                        setOpenedModule([...(openedModule), moduleIndex])
                                                    }
                                                }}
                                            >
                                                <h3 className="text-lg montserrat-700">
                                                    Module {moduleIndex + 1} - {module.title}
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
                                                            <div
                                                                className="flex gap-2 items-center cursor-pointer"
                                                                onClick={() => {
                                                                    const topicKey = `${moduleIndex}-${topicIndex}`;
                                                                    if (openedTopic?.includes(topicKey)) {
                                                                        setOpenedTopic(openedTopic.filter(index => index !== topicKey))
                                                                    } else {
                                                                        setOpenedTopic([...(openedTopic), topicKey])
                                                                    }
                                                                }}
                                                            >
                                                                <h4 className="text-sm montserrat-500 font-medium mb-2">
                                                                    {topicIndex + 1}. {topic.title}
                                                                </h4>
                                                                <svg
                                                                    className={`w-5 h-5 transition-transform duration-300 ease-in-out ${openedTopic?.includes(`${moduleIndex}-${topicIndex}`) ? 'rotate-180' : ''}`}
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </div>
                                                            {openedTopic?.includes(`${moduleIndex}-${topicIndex}`) && (
                                                                <div className="flex flex-col gap-1">
                                                                    <p className="text-gray-600 text-sm mb-1 montserrat-400">
                                                                        {topic.description}
                                                                    </p>
                                                                    {topic.contents?.map((content, contentIndex) => (
                                                                        <div key={contentIndex} className="p-2 max-w-xl bg-white rounded-lg shadow-sm flex justify-between items-center">
                                                                            <div className="flex text-sm flex-col gap-1">
                                                                                <span className="font-bold montserrat-500">{content.name}</span>
                                                                                <span className="text-gray-600 text-xs montserrat-400">{content.type}</span>
                                                                            </div>
                                                                            <button
                                                                                className="w-full max-w-20 px-4 py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer flex items-center justify-center"
                                                                                onClick={() => navigate(`/course/${courseId}/content/${encodeURIComponent(content.key)}`)}
                                                                            >
                                                                                View
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
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