import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface Course {
    id: number;
    title: string;
    description: string;
    isActive: boolean;
    isStarted: boolean;
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
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const UpcomingCourses = () => {
    const [upcomingCourses, setUpcomingCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${backendUrl}api/v1/course/`);
                const data = response.data as Course[];
                const filteredCourses = data.filter(
                    (course: Course) => !course.isActive && course.published
                );
                setUpcomingCourses(filteredCourses);
            } catch (err) {
                setError('Error fetching upcoming courses');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Fallback content for when there are no courses or during loading/error states
    const renderFallbackContent = () => {
        if (loading) return <p className="text-center py-10">Loading upcoming courses...</p>;
        if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
        if (upcomingCourses.length === 0) return <p className="text-center py-10">No upcoming courses available at the moment.</p>;
    };

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

    return (
        <div className="relative w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold montserrat-700">
                    Explore our upcoming courses
                    </h1>
                    <p className="text-xl text-gray-600 lg:max-w-[50%]">
                    Discover our upcoming courses, where industry experts and thought leaders will guide you in acquiring new expertise, expanding your horizons, and reaching your full potential.
                    </p>
                </div>

                {loading || error || upcomingCourses.length === 0 ? (
                    renderFallbackContent()
                ) : (
                    <div className="relative">
                        <div 
                            ref={scrollContainerRef}
                            className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[60%] md:auto-cols-[45%] lg:auto-cols-[32%] gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 pr-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {upcomingCourses.map((course) => (
                                <div 
                                    key={course.id} 
                                    className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1 snap-start"
                                >
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        <img 
                                            src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                            alt={course.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-3 right-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black text-white shadow-md">
                                                COMING SOON
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold montserrat-700 line-clamp-2 group-hover:text-gray-900 transition-colors">
                                                {course.title}
                                            </h3>
                                            <span className="text-xl font-extrabold text-gray-900 ml-2">₹{course.price}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                {course.category.name}
                                            </span>
                                            <button
                                                className="px-4 py-2 rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                            >
                                                Notify Me
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {upcomingCourses.length > 3 && (
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
}

export default UpcomingCourses;
