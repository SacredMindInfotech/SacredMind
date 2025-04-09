import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";

interface Course {
    id: number;
    title: string;
    description: string;
    isActive: boolean;
    isStarted: boolean;
    price: number;
    discountedPrice?: number;
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
    courseNotice: string | null;
}

const OngoingOffers = () => {
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    // Animation controls
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [controls, isInView]);

    // Scroll controls
    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: scrollContainerRef.current.offsetWidth,
                behavior: 'smooth'
            });
        }
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -scrollContainerRef.current.offsetWidth,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        // Fetch all courses first
        const fetchCoursesWithDiscounts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${backendUrl}api/v1/course/`);
                const allCourses = response.data as Course[];
                
                // Process each course to get its discount
                const coursesWithDiscountPromises = allCourses.map(async (course) => {
                    try {
                        const discountRes = await axios.get(`${backendUrl}api/v1/course/${course.id}/discountAmount`);
                        const discountAmount = discountRes.data as number;
                        
                        return {
                            ...course,
                            discountedPrice: discountAmount
                        };
                    } catch (error) {
                        return {
                            ...course,
                            discountedPrice: 0
                        };
                    }
                });
                
                // Wait for all discount requests to complete
                const coursesWithDiscounts = await Promise.all(coursesWithDiscountPromises);
                
                // Filter to only keep courses with active discounts
                const discountedCourses = coursesWithDiscounts.filter(
                    course => course.discountedPrice > 0 && course.published
                );
                
                setCourses(discountedCourses);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setLoading(false);
            }
        };
        
        fetchCoursesWithDiscounts();
    }, [backendUrl]);

    const OffersLoader = () => {
        return (
            <div className="grid grid-flow-col auto-cols-[70%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[23%] gap-4 overflow-x-auto pb-4 pr-4">
                {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                        <div className="h-40 bg-gray-200 animate-pulse">
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer-effect"></div>
                        </div>
                        <div className="p-4 flex flex-col">
                            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
                            <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse mb-3"></div>
                            <div className="mt-auto flex items-center justify-between">
                                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="relative w-full h-full bg-gradient-to-r from-purple-100 via-gray-100 to-gray-200" ref={ref}>
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-16">
                    <motion.h2 
                        className="text-4xl md:text-5xl lg:text-6xl font-bold montserrat-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        Special <span className="text-yellow-600 relative">
                            Offers
                            <svg
                                className="absolute -left-2 -right-2 -bottom-1 translate-y-1" 
                                viewBox="0 0 452 18" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{
                                        duration: 1.25,
                                        ease: "easeInOut",
                                    }}
                                    d="M0.949448 16.8373C147.022 2.27447 225.974 -4.0579 384.378 14.2907" 
                                    stroke="#F4CC15" 
                                    strokeWidth="4"
                                />
                            </svg>
                        </span>
                    </motion.h2>
                    <motion.p 
                        className="text-xl text-gray-600 montserrat-400 lg:max-w-[50%]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Don't miss out on these. Upgrade at unbeatable prices.
                    </motion.p>
                </div>

                {loading ? (
                    <OffersLoader />
                ) : courses.length > 0 ? (
                    <div className="relative">
                        <motion.div 
                            ref={scrollContainerRef}
                            className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[60%] md:auto-cols-[45%] lg:auto-cols-[32%] gap-6 overflow-x-auto snap-x snap-mandatory pb-6 pr-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            variants={containerVariants}
                            animate={controls}
                        >
                            {courses.map((course) => (
                                <motion.div
                                    key={course.id}
                                    className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1 snap-start"
                                    onClick={() => navigate(`/course/${course.id}`)}
                                    variants={itemVariants}
                                >
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        {course.imageUrl ? (
                                            <img
                                                src={course.imageUrl}
                                                alt={course.title}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-md">
                                                OFFER
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold montserrat-700 line-clamp-2 group-hover:text-gray-900 transition-colors">{course.title}</h3>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                {course.category.name}
                                            </span>
                                            <div className="text-right">
                                                <span className="text-sm line-through text-gray-500">₹{course.price}</span>
                                                <span className="text-sm font-extrabold text-red-600 ml-2">₹{course.discountedPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {courses.length > 3 && (
                            <>
                                <button
                                    onClick={scrollLeft}
                                    className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-900 p-3 rounded-full shadow-lg z-10 border-2 border-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200"
                                    aria-label="Scroll left"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={scrollRight}
                                    className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-100 text-gray-900 p-3 rounded-full shadow-lg z-10 border-2 border-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200"
                                    aria-label="Scroll right"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <motion.div 
                        className="text-center py-16 bg-white rounded-xl shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 montserrat-700">No ongoing offers at the moment</h3>
                        <p className="text-gray-600 montserrat-400">Check back soon for new discounts and special offers</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default OngoingOffers;
