import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Course = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
                <div className="max-w-7xl mx-auto px-4 py-16">
                    {/* Hero Section */}
                    <div className="text-center mb-16 p-10 min-h-[50vh] flex flex-col justify-center items-center bg-gray-100">
                        <h1 className="text-6xl font-bold mb-4 montserrat-700">{course.title}</h1>
                        <span
                            className="bg-white text-sm m-4 text-gray-800 px-6 py-2 rounded-full cursor-pointer hover:bg-gray-900 hover:text-white transition duration-200 montserrat-500"
                        >
                            {course.category.name}
                        </span>
                        <p className="text-xl text-gray-600">{course.description}</p>
                        <div className="mt-8 flex flex-col items-center gap-6">
                            <span className="text-xl font-bold text-gray-900 montserrat-700">${course.price}/-</span>
                            <button className=" cursor-pointer px-12 py-3 rounded-md border border-white bg-gray-900 text-white text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary">
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    {/* Course Details Section */}
                    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-16">
                        
                        <div className="text-2xl font-semibold mb-4 montserrat-500">~Course Overview~</div>

                        {/* Course Features Grid */}
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-6">
                                <h2 className="text-2xl font-semibold mb-4 montserrat-500">What you'll learn</h2>
                                <p className="text-gray-600 montserrat-400">
                                    Comprehensive curriculum designed to ensure your success in mastering the subject matter.
                                </p>
                            </div>

                            <div className="text-center p-6">
                                <h2 className="text-2xl font-semibold mb-4 montserrat-500">Course Duration</h2>
                                <p className="text-gray-600 montserrat-400">
                                    Self-paced learning with lifetime access to all course materials.
                                </p>
                            </div>

                            <div className="text-center p-6">
                                <h2 className="text-2xl font-semibold mb-4 montserrat-500">Certificate</h2>
                                <p className="text-gray-600 montserrat-400">
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
