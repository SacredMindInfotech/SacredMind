import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
interface Purchases {
    id: number;
    userId: number;
    courseId: number;
    enrolledAt: Date;
}

interface Course {
    category: {
        id: number,
        name: string,
        parentId: number | null
    },
    categoryId: number,
    createdAt: Date,
    description: string,
    forwhom: string[] | null,
    id: number,
    imageUrl: string | null,
    language: string,
    learningOutcomes: string[] | null,
    overview: string[] | null,
    price: number,
    published: boolean,
    requirements: string[] | null,
    title: string,
    updatedAt: Date,
}

const Purchases = () => {
    const { user } = useUser()
    const { getToken } = useAuth()
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState<Purchases[]>([]);
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        const fetchPurchases = async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/v1/user/${user!.id}/purchases`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                //@ts-ignore
                setPurchases(response.data);
                setLoading(false);
            } catch (error:any) {
                if(error.status!==200){
                    setPurchases([]);
                    setLoading(false);
                    return;
                }
                console.error("Error fetching purchases:", error);
            }
        };
        fetchPurchases();
    }, [user]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (purchases.length === 0) return;

            const coursePromises = purchases.map(async (purchase) => {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/v1/course/id/${purchase.courseId}`);
                return response.data;
            });
            const resolvedCourses = await Promise.all(coursePromises);
            setCourses(resolvedCourses as Course[]);
        };
        fetchCourses();
    }, [purchases]);

    const ShimmerEffect = () => (
        <div className="w-full bg-white">
            <motion.div className="w-full bg-gradient-to-r from-purple-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="animate-pulse mb-8 sm:mb-16 p-4 sm:p-10 flex flex-col justify-center items-center">
                        <div className="h-10 bg-gray-200 rounded-lg w-3/4 max-w-md mb-6"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-1/2 max-w-sm"></div>
                    </div>
                </div>
            </motion.div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array(6).fill(0).map((_, index) => (
                        <div key={index} className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-lg mb-4 sm:mb-6"></div>
                                <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-3"></div>
                                <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded-lg w-5/6 mb-4"></div>
                                <div className="flex justify-between">
                                    <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                                    <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return <ShimmerEffect />;
    }

    return (
        <div className="w-full bg-white">
            {/* Hero Section with animated elements */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full bg-gradient-to-r from-purple-50 to-gray-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="text-center mb-8 sm:mb-16 p-4 sm:p-10 flex flex-col justify-center items-center">
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 montserrat-700 leading-tight"
                        >
                            My Purchases
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-base sm:text-lg md:text-xl text-gray-600 montserrat-500 max-w-2xl"
                        >
                            Access all your enrolled courses and continue your learning journey
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {courses.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="bg-white p-8 sm:p-12 rounded-xl border border-gray-200 shadow-sm text-center"
                    >
                        <div className="flex flex-col items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <h2 className="text-xl font-bold montserrat-700 mb-2">No courses purchased yet</h2>
                            <p className="text-gray-600 mb-6">Explore our catalog and start your learning journey today</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => window.location.href = "/"}
                                className="px-6 py-3 rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                            >
                                Explore Courses
                            </motion.button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {courses.map((course, index) => {
                            const purchase = purchases.find(p => p.courseId === course.id);
                            const enrolledAt = purchase ? new Date(purchase.enrolledAt).toLocaleDateString('en-GB') : "Unknown date";
                            
                            return (
                                <motion.div 
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                                    whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                    className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer"
                                    onClick={() => {
                                        const firstTwoWords = course.title.toLowerCase().split(' ').slice(0, 3).join(' ');
                                        const encodedTitle = firstTwoWords
                                            .replace(/-/g, "_") // Temporarily replace existing hyphens
                                            .replace(/\s+/g, '-');         // Replace spaces with hyphens
                                        navigate(`/course/${encodedTitle}`);
                                    }
                                }
                                >
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        <img
                                            src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                            alt={course.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500 text-white shadow-md">
                                                ENROLLED
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="text-lg font-bold montserrat-700 line-clamp-2 group-hover:text-gray-900 transition-colors mb-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description || "No description available"}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                {course.category?.name || "Uncategorized"}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                Enrolled: {enrolledAt}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
            
            {/* Additional Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-full bg-gray-50 py-10 sm:py-16 mb-20"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 montserrat-700">
                        Need assistance with your courses?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl mx-auto montserrat-500">
                        We're here to help you get the most out of your learning experience
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = "/contact"}
                        className="px-6 py-3 rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                    >
                        Contact Support
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Purchases;

