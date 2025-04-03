import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { LoadingScreen } from "../components/ui/loadingScreen";

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

    if (loading) {
        return  <LoadingScreen />
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
                                            <div key={course.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between h-full">
                                                <h1 className="text-xl font-bold mb-2 text-center">{course.title}</h1>
                                                <p className="text-center text-gray-600 mb-4">Enrolled at: {enrolledAt}</p>
                                                <div className="mt-4 flex justify-center">
                                                    <button
                                                        onClick={() => window.location.href = `/course/${course.id}`}
                                                        className="w-full md:w-36 px-4 py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer flex items-center justify-center"
                                                    >
                                                        View Course
                                                    </button>
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