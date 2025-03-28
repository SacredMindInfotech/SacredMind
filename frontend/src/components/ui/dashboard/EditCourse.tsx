import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingScreen } from "../loadingScreen";
import { FiBook, FiBookOpen } from "react-icons/fi";
import { Toaster } from "react-hot-toast";
import CourseModules from "./courseModules";
import Details from "./courseDetails";
import { useAuth } from "@clerk/clerk-react";

interface Course {
    id: number;
    title: string;
    description: string;
    isActive: boolean;
    showCourseNotice: boolean;
    price: number;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    categoryId: number;
    category: Category | null;
    overview: string[];
    learningOutcomes: string[];
    requirements: string[];
    forwhom: string[];
    language: string;
    courseNotice: string | null;
    modules: Module[];
}
interface Module {
    id: number;
    serialNumber: number;
    title: string;
    courseId: number;
    topics: Topic[];
}
interface Topic {
    id: number;
    serialNumber: number;
    title: string;
    description: string;
    moduleId: number;
    contents: Content[];
}
interface Content {
    id: number;
    name: string;
    topicId: number;
    type: "VIDEO" | "PDF" | "EXCEL" | "TEXT" | "IMAGE";
    key: string;
}

interface Category {
    id: number;
    name: string;
    parentId: number | null;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const EditCourse = () => {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'details' | 'module'>('details');
    const { id } = useParams();
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const token = await getToken();
                const res = await axios.get(`${backendUrl}api/v1/course/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCourse(res.data as Course);
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCourse();
    }, [id, getToken]);

    if (loading) {
        return <LoadingScreen />;
    }
    
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-gray-900 text-white p-6">
                            <h2 className="text-xl font-bold mb-8 border-b border-gray-700 pb-4">Course Management</h2>
                            <div className="flex flex-col gap-3">
                                <button 
                                    className={`p-3 rounded-md flex items-center transition-all ${selectedTab === 'details' ? 'bg-white text-gray-900 font-medium' : 'hover:bg-gray-800'}`} 
                                    onClick={() => setSelectedTab('details')}
                                >
                                    <FiBook className="inline-block mr-3" />
                                    Course Details
                                </button>
                                <button
                                    className={`p-3 rounded-md flex items-center transition-all ${selectedTab === 'module' ? 'bg-white text-gray-900 font-medium' : 'hover:bg-gray-800'}`} 
                                    onClick={() => setSelectedTab('module')}
                                >
                                    <FiBookOpen className="inline-block mr-3" />
                                    Course Modules
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="p-6 border-b border-gray-200">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{course?.title}</h1>
                                <div className="flex items-center mt-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${course?.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {course?.published ? 'Published' : 'Draft'}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500">
                                        Category: <span className="font-medium">{course?.category?.name}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                {selectedTab === 'details' && (
                                    <Details course={course} />
                                )}
                                {selectedTab === 'module' && (
                                    <CourseModules course={course!} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default EditCourse;