import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Course = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            const res = await axios.get(`${backendUrl}api/v1/course/${id}`);
            setCourse(res.data);
            setLoading(false);
        }
        fetchCourse();
    }, [id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);


    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : course && (
                <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
                    {/* Hero Section */}
                    <div className="text-center mb-8 sm:mb-16 p-4 sm:p-10 min-h-[40vh] sm:min-h-[50vh] flex flex-col justify-center items-center bg-gray-100">
                        <h1 className="text-3xl sm:text-6xl font-bold mb-4 montserrat-700">{course.title}</h1>
                        <span
                            className="bg-white text-xs sm:text-sm m-2 sm:m-4 text-gray-800 px-4 sm:px-6 py-1 sm:py-2 rounded-full cursor-pointer hover:bg-gray-900 hover:text-white transition duration-200 montserrat-500"
                        >
                            {course.category.name}
                        </span>
                        <p className="text-base sm:text-xl text-gray-600">{course.description}</p>
                        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-4 sm:gap-6">
                            <button
                                onClick={() => navigate("/contact")}
                                className="cursor-pointer px-8 sm:px-12 py-2 sm:py-3 rounded-md border border-white bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary">
                                Contact Us
                            </button>
                        </div>
                    </div>

                    {/* Course Details Section */}
                    <div className="flex flex-col gap-6 sm:gap-8 max-w-7xl mx-auto px-2 sm:px-4 py-8 sm:py-16">
                        <div className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 montserrat-500">~Course Overview~</div>

                        {/* Course Features Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                            <div className="text-center p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 montserrat-500">What you'll learn</h2>
                                <p className="text-sm sm:text-base text-gray-600 montserrat-400">
                                    Comprehensive curriculum designed to ensure your success in mastering the subject matter.
                                </p>
                            </div>

                            <div className="text-center p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 montserrat-500">Course Duration</h2>
                                <p className="text-sm sm:text-base text-gray-600 montserrat-400">
                                    Self-paced learning with lifetime access to all course materials.
                                </p>
                            </div>

                            <div className="text-center p-4 sm:p-6">
                                <h2 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 montserrat-500">Certificate</h2>
                                <p className="text-sm sm:text-base text-gray-600 montserrat-400">
                                    Earn a certificate of completion to showcase your new skills.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Course;
