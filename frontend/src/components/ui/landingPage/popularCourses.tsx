import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LoadingScreen } from '../loadingScreen';

interface Course {
    id: number;
    title: string;
    description: string;
    isActive: boolean;
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
    courseNotice: string | null;
    enrollmentCount: number;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const PopularCourses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredCourse, setHoveredCourse] = useState<Course | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPopularCourses = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${backendUrl}api/v1/course/popular`);
                setCourses(Array.isArray(response.data) ? response.data : []);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching popular courses:', err);
                setError('Failed to load popular courses');
                setLoading(false);
            }
        };

        fetchPopularCourses();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (scrollContainerRef.current && !scrollContainerRef.current.contains(event.target as Node)) {
                setHoveredCourse(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    // Fallback content for when there are no courses or during loading/error states
    const renderFallbackContent = () => {
        if (loading) return <LoadingScreen></LoadingScreen>;
        if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
        if (courses.length === 0) return <p className="text-center py-10">No popular courses available at the moment.</p>;
    };

    return (
        <div className="relative w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold montserrat-700">
                        Our most popular courses
                    </h1>
                    <p className="text-xl text-gray-600 lg:max-w-[50%]">
                        Join thousands of students who have already enhanced their skills with our top-rated courses. Discover why these courses are loved by our community.
                    </p>
                </div>

                {loading || error || courses.length === 0 ? (
                    renderFallbackContent()
                ) : (
                    <div className="relative">
                        <div
                            ref={scrollContainerRef}
                            className="grid grid-flow-col auto-cols-[70%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:auto-cols-[23%] gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pr-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="group relative overflow-hidden rounded-lg aspect-square snap-start"
                                    onClick={() => setHoveredCourse(course)}
                                    onMouseEnter={() => setHoveredCourse(course)}
                                    onMouseLeave={() => setHoveredCourse(null)}
                                >
                                    {hoveredCourse === course ? <>
                                        <img
                                            src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                            alt={course.title}
                                            className="w-full h-full object-cover brightness-50 group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-0 left-0 p-6 w-full">
                                            <div className="flex justify-center items-center mb-2">
                                                <motion.button 
                                                    onClick={()=>navigate(`/course/${hoveredCourse.id}`)}
                                                    className="px-5 py-2 rounded-md border shadow-[4px_4px_0px_0px_rgba(0,0,0)] text-black border-gray-900 bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                    whileHover={{ 
                                                        scale: 1.05,
                                                        backgroundColor: "#f8f8f8"
                                                    }}
                                                >
                                                    view course
                                                </motion.button>
                                            </div>
                                        </div>
                                    </> : <>
                                        <img
                                            src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                            alt={course.title}
                                            className="w-full h-full object-cover brightness-50 group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-0 left-0 p-6 w-full">
                                            <div className="flex flex-col gap-7 justify-between items-center mb-2">
                                                <h3 className="text-xl font-semibold text-white montserrat-500">
                                                    {course.title}
                                                </h3>
                                                <span className=" montserrat-300 text-white text-xs px-2 py-1 rounded">
                                                    {course.category.name}
                                                </span>
                                            </div>
                                        </div>

                                    </>}

                                </div>
                            ))}
                        </div>

                        {courses.length > 4 && (
                            <>
                                <button
                                    onClick={scrollLeft}
                                    className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-10"
                                    aria-label="Scroll left"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    onClick={scrollRight}
                                    className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-10"
                                    aria-label="Scroll right"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PopularCourses;
