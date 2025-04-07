import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { enrolledClickedEvent } from "../lib/pixel-event";
import CoursePageShimmerEffect from "../components/ui/loaders/CoursePageLoader";
import PaymentCheckOutModal from "../components/ui/PaymentCheckOutModal";
import { toast, Toaster } from "react-hot-toast";


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
    name: string;
    type: string;
}

const Course = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const { getToken } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const { user, isLoaded } = useUser();
    const [isPurchased, setIsPurchased] = useState<boolean | null>(null);
    const enrollButtonRef = useRef<HTMLButtonElement | null>(null);
    const [openedModule, setOpenedModule] = useState<number[]>([0]);
    const [openedTopic, setOpenedTopic] = useState<string[]>([]);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        if (paymentSuccess) {
            toast.success("Payment Successful");
        }
    }, [paymentSuccess]);


    //checking if the user has a pending payment for the course
    useEffect(() => {
        const hasPendingPayment = localStorage.getItem(`pendingPayment_${id}`) === 'true';
        if (isSignedIn && hasPendingPayment && isLoaded && user) {
            localStorage.removeItem(`pendingPayment_${id}`);
            coursePayment();
        }
    }, [isSignedIn, isLoaded, user, id]);



    //fetching the course details, by id from the url
    const fetchCourse = async () => {
        try {
            const res = await axios.get(`${backendUrl}api/v1/course/${id}`);
            setCourse(res.data as Course);
            setLoading(false);
        } catch (error) {
            navigate("/");
        }
    }
    const fetchIsPurchased = async () => {
        if (!isLoaded || !user) return;

        const token = await getToken();

        //returns boolean value
        const res = await axios.get(`${backendUrl}api/v1/user/isPurchase/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                clerkuserId: user.id
            }
        });
        // @ts-ignore
        setIsPurchased(res.data.purchased);
    }
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchCourse();
        fetchIsPurchased()

    }, [id, isLoaded, user]);



    const coursePayment = async () => {
        try {
            enrolledClickedEvent();

            setShowCheckoutModal(true);
            document.body.style.overflow="hidden";
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {loading ? (
                <CoursePageShimmerEffect />
            ) : course && (
                <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
                    {/* Hero Section */}
                    <div className="text-center mb-8 sm:mb-16 p-4 sm:p-10 min-h-[40vh] sm:min-h-[50vh] flex flex-col justify-center items-center bg-gray-100">
                        <h1 className="text-3xl sm:text-6xl font-bold mb-4 montserrat-700">{course.title}</h1>
                        <div className="flex flex-wrap justify-center items-center">
                            <span
                                className="bg-white text-xs sm:text-sm m-2 sm:m-4 text-gray-800 px-4 sm:px-6 py-1 sm:py-2 rounded-full  hover:bg-gray-900 hover:text-white transition duration-200 montserrat-500"
                            >
                                <span className="mr-2">📚</span>
                                {course.category.name}
                            </span>
                            <p className="bg-white text-xs sm:text-sm m-2 sm:m-4 text-gray-800 px-4 sm:px-6 py-1 sm:py-2 rounded-full  hover:bg-gray-900 hover:text-white transition duration-200 montserrat-500">
                                <span className="mr-2">🌐</span>
                                {course.language}
                            </p>
                        </div>

                        <p className="text-base montserrat-500 text-gray-600">{course.description}</p>
                        {/* button section */}
                        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-4 sm:gap-6">
                            {course.isActive ? (
                                isPurchased === true ? (
                                    <div>
                                        <button
                                            onClick={() => navigate(`/course/${id}/content`)}
                                            className="cursor-pointer px-8 sm:px-12 py-2 sm:py-3 rounded-md border border-white bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary"
                                        >
                                            View Course Content
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        ref={enrollButtonRef}
                                        onClick={coursePayment}
                                        className="cursor-pointer px-8 sm:px-12 py-2 sm:py-3 rounded-md border border-white bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary">
                                        Enroll Now
                                    </button>
                                ) 
                            ) : (
                                <button
                                    onClick={() => navigate("/contact")}
                                    className="cursor-pointer px-8 sm:px-12 py-2 sm:py-3 rounded-md border border-white bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary">
                                    Contact Us
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Course Content Preview and Overview */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-12">
                        {/* Course Overview */}
                        <div className="flex flex-col gap-6 sticky top-24 h-fit w-full lg:w-1/3">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <span className="text-xl sm:text-2xl montserrat-500 text-gray-900">Course Overview</span>
                                <span className="text-2xl">📖</span>
                            </div>
                            <div className="bg-gradient-to-br from-gray-300 to-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex flex-col gap-2">
                                    {course.overview?.map((item, index) => (
                                        <p key={index} className="text-gray-700 montserrat-400 leading-relaxed text-base">{item}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Course Content Preview */}
                        <div className="flex flex-col gap-4 w-full lg:w-2/3">
                            <div className="flex items-center  gap-2">
                                <span className="text-xl sm:text-2xl montserrat-500">Course Content Preview</span>
                                <span className="text-xl">📝</span>
                            </div>
                            <div className="bg-gradient-to-br from-gray-300 to-white p-4 rounded-lg shadow-sm w-full">
                                {course.modules?.map((module, moduleIndex) => (
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
                                                            <h4 className="text-sm montserrat-500 font-medium mb-2">
                                                                {topicIndex + 1}. {topic.title}
                                                            </h4>
                                                            <svg className={`w-5 h-5 transition-transform duration-300 ease-in-out ${openedTopic?.includes(`${moduleIndex}-${topicIndex}`) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                        {openedTopic?.includes(`${moduleIndex}-${topicIndex}`) && (
                                                            <div className="flex flex-col gap-1">
                                                                <p className="text-gray-600 text-sm mb-1">
                                                                    {topic.description}
                                                                </p>
                                                                {topic.contents?.map((content, contentIndex) => (
                                                                    <div key={contentIndex} className="p-2 max-w-xl bg-gray-100 rounded-lg shadow-sm flex justify-between items-center">
                                                                        <div className="flex text-sm flex-col gap-1">
                                                                            <span className="font-bold">{content.name}</span>
                                                                            <span className="text-gray-600 text-xs">{content.type}</span>
                                                                        </div>
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

                    {/* Course Details  */}
                    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl montserrat-700">What you'll learn</span>
                                <span className="text-xl">📚</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gradient-to-br from-gray-300 to-white p-4 rounded-lg shadow-sm">
                                {course.learningOutcomes?.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2 bg-white p-3 montserrat-500 rounded-md">
                                        <span className="text-green-500 text-lg">✓</span>
                                        <span className="text-gray-700 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl montserrat-700">Requirements</span>
                                <span className="text-xl">⚡</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gradient-to-br from-gray-300 to-white p-4 rounded-lg shadow-sm">
                                {course.requirements?.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2 bg-white p-3 rounded-md">
                                        <span className="text-blue-500 text-lg">●</span>
                                        <span className="text-gray-700 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl montserrat-700">Who this course is for</span>
                                <span className="text-xl">👥</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gradient-to-br from-gray-300 to-white p-4 rounded-lg shadow-sm">
                                {course.forwhom?.map((item, index) => (
                                    <div key={index} className="flex items-start gap-2 bg-white p-3 rounded-md">
                                        <span className="text-purple-500 text-lg">→</span>
                                        <span className="text-gray-700 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCheckoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/60 backdrop-blur-lg" >
                    <PaymentCheckOutModal id={id!} price={course?.price!} clerkUserId={user?.id!} courseName={course?.title!} setShowCheckoutModal={setShowCheckoutModal} setPaymentSuccess={setPaymentSuccess} />
                </div>
            )}
            <Toaster />
        </div>
    )
}


export default Course;
