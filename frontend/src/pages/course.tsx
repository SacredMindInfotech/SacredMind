import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { enrolledClickedEvent } from "../lib/pixel-event";
import CoursePageShimmerEffect from "../components/ui/loaders/CoursePageLoader";
import PaymentCheckOutModal from "../components/ui/PaymentCheckOutModal";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    isActive: boolean;
    showCourseNotice: boolean;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
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
    duration: number;
    validityInDays: number;
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
    const { courseTitle } = useParams();
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

    // Decode the URL parameter to get the original title
    const decodedCourseTitle = courseTitle 
        ? courseTitle.replace(/-/g, ' ')         // First convert URL hyphens back to spaces
                     .replace(/_/g, '-')         // Then restore original hyphens
        : '';

    useEffect(() => {
        if (paymentSuccess) {
            toast.success("Payment Successful");
        }
    }, [paymentSuccess]);

    // Checking if the user has a pending payment for the course
    useEffect(() => {
        const hasPendingPayment = localStorage.getItem(`pendingPayment_${courseTitle}`) === 'true';
        if (isSignedIn && hasPendingPayment && isLoaded && user) {
            localStorage.removeItem(`pendingPayment_${courseTitle}`);
            coursePayment();
        }
    }, [isSignedIn, isLoaded, user, courseTitle]);

    // Fetching the course details by title from the URL
    const fetchCourse = async () => {
        try {
            const res = await axios.get(`${backendUrl}api/v1/course/titlefirsttwo/${decodedCourseTitle}`);
            setCourse(res.data as Course);
            setLoading(false);
        } catch (error) {
            console.log("Error fetching course details:", error);
            navigate("/");
        }
    }
    
    const fetchIsPurchased = async () => {
        if (!isLoaded || !user) return;

        const token = await getToken();

        try{
            // Returns boolean value
            const res = await axios.get(`${backendUrl}api/v1/user/isPurchase/${decodedCourseTitle}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                clerkuserId: user.id
            }
        });
        // @ts-ignore
        setIsPurchased(res.data.purchased);
        } catch (error) {
            console.log("Error fetching is purchased:", error);
            navigate("/");
        }
    }
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchCourse();
        fetchIsPurchased();
    }, [decodedCourseTitle, isLoaded, user]);

    const coursePayment = async () => {
        try {
            enrolledClickedEvent();
            setShowCheckoutModal(true);
            document.body.style.overflow = "hidden";
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="w-full bg-white">
            {loading ? (
                <CoursePageShimmerEffect />
            ) : course && (
                <>
                    {/* Hero Section with animated elements */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="w-full bg-gradient-to-r from-purple-50 to-gray-100"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-24">
                            <div className="text-center mb-8 sm:mb-16 p-4 sm:p-10 flex flex-col justify-center items-center">
                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.8 }}
                                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 montserrat-700 leading-tight"
                                >
                                    {course.title}
                                </motion.h1>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                    className="text-base sm:text-lg md:text-xl text-gray-600 montserrat-500 max-w-2xl"
                                >
                                    {course.description}
                                </motion.p>
                                
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6, duration: 0.8 }}
                                    className="flex flex-wrap justify-center items-center mt-8"
                                >
                                    <motion.span
                                        whileHover={{ scale: 1.05, backgroundColor: "#1F2937", color: "white" }}
                                        className="bg-white text-xs sm:text-sm m-2 sm:m-4 text-gray-800 px-4 sm:px-6 py-1 sm:py-2 rounded-full transition duration-200 montserrat-500"
                                    >
                                        <span className="mr-2">📚</span>
                                        {course.category?.name || 'Uncategorized'}
                                    </motion.span>
                                    <motion.span
                                        whileHover={{ scale: 1.05, backgroundColor: "#1F2937", color: "white" }}
                                        className="bg-white text-xs sm:text-sm m-2 sm:m-4 text-gray-800 px-4 sm:px-6 py-1 sm:py-2 rounded-full transition duration-200 montserrat-500"
                                    >
                                        <span className="mr-2">🌐</span>
                                        {course.language}
                                    </motion.span>
                                    <motion.span
                                        whileHover={{ scale: 1.05, backgroundColor: "#1F2937", color: "white" }}
                                        className="bg-white text-xs sm:text-sm m-2 sm:m-4 text-gray-800 px-4 sm:px-6 py-1 sm:py-2 rounded-full transition duration-200 montserrat-500"
                                    >
                                        <span className="mr-2">⏰</span>
                                        Duration: {course.duration/30} months
                                    </motion.span>
                                    <motion.span
                                        whileHover={{ scale: 1.05, backgroundColor: "#1F2937", color: "white" }}
                                        className="bg-white text-xs sm:text-sm m-2 sm:m-4 text-gray-800 px-4 sm:px-6 py-1 sm:py-2 rounded-full transition duration-200 montserrat-500"
                                    >
                                        <span className="mr-2">📅</span>
                                        {course.validityInDays > 0 ? (
                                            <>Validity: {course.validityInDays/30} months</>
                                        ) : (
                                            <>Validity: Lifetime Access</>
                                        )}
                                    </motion.span>
                                </motion.div>

                                {/* Button section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                    className="mt-8 sm:mt-10"
                                >
                                    {course.isActive ? (
                                        isPurchased === true ? (
                                            <motion.button
                                                whileHover={{ scale: 1.05, boxShadow: "4px 4px 0px 0px rgba(0,0,0)" }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate(`/course/${course.id}/content`)}
                                                className="cursor-pointer px-8 sm:px-12 py-2 sm:py-3 rounded-md border-2 border-gray-900 bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                            >
                                                View Course Content
                                            </motion.button>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.05, boxShadow: "4px 4px 0px 0px rgba(0,0,0)" }}
                                                whileTap={{ scale: 0.95 }}
                                                ref={enrollButtonRef}
                                                onClick={coursePayment}
                                                className="cursor-pointer px-8 sm:px-12 py-2 sm:py-3 rounded-md border-2 border-gray-900 bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                            >
                                                Enroll Now
                                            </motion.button>
                                        )
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.05, boxShadow: "4px 4px 0px 0px rgba(0,0,0)" }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => navigate("/contact")}
                                            className="cursor-pointer px-8 sm:px-12 py-2 sm:py-3 rounded-md border-2 border-gray-900 bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                        >
                                            Contact Us
                                        </motion.button>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                        {/* Course Overview Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0, duration: 0.8 }}
                            className="mb-16"
                        >
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 montserrat-700">Course Overview</h2>
                            <div className="bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex flex-col gap-4">
                                    {course.overview?.map((item, index) => (
                                        <motion.p 
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 1.0 + (index * 0.1), duration: 0.5 }}
                                            className="text-gray-700 montserrat-500 leading-relaxed"
                                        >
                                            {item}
                                        </motion.p>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Course Content Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            className="mb-16"
                        >
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 montserrat-700">Course Content Preview</h2>
                            {course.modules.length > 0 ? (
                                <div className="bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    {course.modules?.map((module, moduleIndex) => (
                                        <motion.div 
                                            key={moduleIndex}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 1.2 + (moduleIndex * 0.1), duration: 0.5 }}
                                            className="bg-white p-4 rounded-lg mb-4 border border-gray-200 shadow-sm"
                                        >
                                            <div
                                                className="flex justify-between items-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-gray-50 rounded-lg p-2"
                                                onClick={() => {
                                                    if (openedModule?.includes(moduleIndex)) {
                                                        setOpenedModule(openedModule.filter(index => index !== moduleIndex));
                                                    } else {
                                                        setOpenedModule([...(openedModule), moduleIndex]);
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
                                                <motion.div 
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    transition={{ duration: 0.3 }}
                                                    className="space-y-3 pl-3 mt-3"
                                                >
                                                    {module.topics?.map((topic, topicIndex) => (
                                                        <div key={`${moduleIndex}-${topicIndex}`} className="border-l-2 border-violet-500 pl-3">
                                                            <div 
                                                                className="flex gap-2 items-center cursor-pointer"
                                                                onClick={() => {
                                                                    const topicKey = `${moduleIndex}-${topicIndex}`;
                                                                    if (openedTopic?.includes(topicKey)) {
                                                                        setOpenedTopic(openedTopic.filter(index => index !== topicKey));
                                                                    } else {
                                                                        setOpenedTopic([...(openedTopic), topicKey]);
                                                                    }
                                                                }}
                                                            >
                                                                <h4 className="text-sm montserrat-600 font-medium mb-2">
                                                                    {topicIndex + 1}. {topic.title}
                                                                </h4>
                                                                <svg 
                                                                    className={`w-4 h-4 transition-transform duration-300 ease-in-out ${openedTopic?.includes(`${moduleIndex}-${topicIndex}`) ? 'rotate-180' : ''}`} 
                                                                    fill="none" 
                                                                    stroke="currentColor" 
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            </div>
                                                            {openedTopic?.includes(`${moduleIndex}-${topicIndex}`) && (
                                                                <motion.div 
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: "auto" }}
                                                                    transition={{ duration: 0.3 }}
                                                                    className="flex flex-col gap-3 mb-4"
                                                                >
                                                                    <p className="text-gray-600 text-sm mb-2">
                                                                        {topic.description}
                                                                    </p>
                                                                    {topic.contents?.map((content, contentIndex) => (
                                                                        <div 
                                                                            key={contentIndex}
                                                                            className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center"
                                                                        >
                                                                            <div className="flex text-sm flex-col gap-1">
                                                                                <span className="font-bold">{content.name}</span>
                                                                                <span className="text-gray-600 text-xs">{content.type}</span>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 bg-gradient-to-br from-purple-100 to-white rounded-xl border border-gray-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-lg text-gray-500 montserrat-500">Content will be updated soon</p>
                                    <p className="text-gray-400 mt-2">Check back for new content</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Course Learning Outcomes */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4, duration: 0.8 }}
                            className="mb-16"
                        >
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 montserrat-700">
                                What You'll Learn
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                                {course.learningOutcomes?.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.4 + (index * 0.05), duration: 0.5 }}
                                        whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                        className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                                    >
                                        <span className="text-green-500 text-lg flex-shrink-0 mt-0.5">✓</span>
                                        <span className="text-gray-700 montserrat-500">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                        
                        {/* Course Requirements */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.6, duration: 0.8 }}
                            className="mb-16"
                        >
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 montserrat-700">
                                Requirements
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                                {course.requirements?.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.6 + (index * 0.05), duration: 0.5 }}
                                        whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                        className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                                    >
                                        <span className="text-blue-500 text-lg flex-shrink-0 mt-0.5">●</span>
                                        <span className="text-gray-700 montserrat-500">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Who this course is for */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8, duration: 0.8 }}
                            className="mb-16"
                        >
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 montserrat-700">
                                Who This Course Is For
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                                {course.forwhom?.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.8 + (index * 0.05), duration: 0.5 }}
                                        whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                        className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                                    >
                                        <span className="text-purple-500 text-lg flex-shrink-0 mt-0.5">→</span>
                                        <span className="text-gray-700 montserrat-500">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Final CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.0, duration: 0.8 }}
                        className="w-full bg-gray-50 mb-20 py-10 sm:py-16"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 montserrat-700">
                                Ready to start your learning journey?
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl mx-auto montserrat-500">
                                Enroll now and take the first step towards mastering {course.title}
                            </p>
                            {course.isActive && !isPurchased && (
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "4px 4px 0px 0px rgba(0,0,0)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={coursePayment}
                                    className="px-8 py-3 rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                >
                                    Enroll Now
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                </>
            )}

            {showCheckoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/60 backdrop-blur-lg">
                    <PaymentCheckOutModal 
                        id={course!.id} 
                        price={course?.price!} 
                        clerkUserId={user?.id!} 
                        courseName={course?.title!} 
                        setShowCheckoutModal={setShowCheckoutModal} 
                        setPaymentSuccess={setPaymentSuccess} 
                    />
                </div>
            )}
            <Toaster />
        </div>
    );
};

export default Course;
