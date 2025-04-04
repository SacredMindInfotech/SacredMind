import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        if (loading) return <PopularCoursesLoader />;
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
                            className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[60%] md:auto-cols-[45%] lg:auto-cols-[32%] gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 pr-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {courses.map((course) => (
                                <div
                                    key={course.id}
                                    className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1 snap-start"
                                    onClick={() => navigate(`/course/${course.id}`)}
                                >
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        <img
                                            src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                            alt={course.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black text-white shadow-md">
                                                POPULAR
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold montserrat-700 line-clamp-2 group-hover:text-gray-900 transition-colors">
                                                {course.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                {course.category.name}
                                            </span>
                                            {/* <span className="text-sm font-medium text-gray-900">
                                                ₹{course.price.toFixed(2)}
                                            </span> */}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

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
                )}
            </div>
        </div>
    );
};

export default PopularCourses;

const PopularCoursesLoader = () => {
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
