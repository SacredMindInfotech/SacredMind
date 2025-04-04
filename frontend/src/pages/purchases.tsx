import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";

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
    const [purchases, setPurchases] = useState<Purchases[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useUser()
    const { getToken } = useAuth()
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
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
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/v1/course/${purchase.courseId}`);
                return response.data;
            });
            const resolvedCourses = await Promise.all(coursePromises);
            setCourses(resolvedCourses as Course[]);
        };
        fetchCourses();

    }, [purchases]);

    const ShimmerCard = () => (
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between h-full overflow-hidden relative">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-auto"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent shimmer"></div>
        </div>
    );

    const ShimmerHeader = () => (
        <div className="flex flex-col p-8 md:p-16 lg:p-28 bg-gray-100 justify-center overflow-hidden relative">
            <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent shimmer"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="relative min-h-screen w-full h-full">
                <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                    <section className="relative text-black">
                        <div className="relative z-10 container mx-auto">
                            <div className="flex flex-col gap-12">
                                <ShimmerHeader />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array(6).fill(0).map((_, index) => (
                                        <ShimmerCard key={`shimmer-${index}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <section className="relative text-black">
                    <div className="relative z-10 container mx-auto">
                        <div className="flex flex-col gap-12">
                            {/* Heading */}
                            <div className="flex flex-col p-8 md:p-16 lg:p-28 bg-gray-100 justify-center">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 montserrat-700">
                                    My Purchases
                                </h1>
                            </div>

                            {/* Courses */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.length === 0 ? (
                                    <div className="text-center text-gray-500">No courses purchased yet.</div>
                                ) : (
                                    courses.map((course) => {
                                        const purchase = purchases.find(p => p.courseId === course.id);
                                        const enrolledAt = purchase ? new Date(purchase.enrolledAt).toLocaleDateString('en-GB') : "Unknown date";
                                        return (
                                            <div 
                                                key={course.id} 
                                                className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                                onClick={() => window.location.href = `/course/${course.id}`}
                                            >
                                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                                    <img
                                                        src={course.imageUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"}
                                                        alt={course.title}
                                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                    <div className="absolute top-3 right-3">
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-black text-white shadow-md">
                                                            ENROLLED
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
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Purchases;

