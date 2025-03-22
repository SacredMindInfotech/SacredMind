import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingScreen } from "../loadingScreen";
import { FiBook, FiBookOpen } from "react-icons/fi";
import toast,{  Toaster } from "react-hot-toast";
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
    title: string;
    courseId: number;
    topics: Topic[];
}
interface Topic {
    id: number;
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

const Details = ({ course }: any) => {
    const { getToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        title: '',
        description: '',
        courseNotice: '',
        showCourseNotice: true,
        overview: [] as string[],
        learningOutcomes: [] as string[],
        requirements: [] as string[],
        forwhom: [] as string[],
        language: '',
        price: 0,
        isActive: false,
        published: false
    });

    const openEditModal = () => {
        setEditData({
            title: course?.title || '',
            showCourseNotice: course?.showCourseNotice || false,
            description: course?.description || '',
            courseNotice: course?.courseNotice || '',
            overview: course?.overview || [],
            learningOutcomes: course?.learningOutcomes || [],
            requirements: course?.requirements || [],
            forwhom: course?.forwhom || [],
            language: course?.language || '',
            price: course?.price || 0,
            isActive: course?.isActive || false,
            published: course?.published || false
        });
        setIsEditModalOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value
        });
    };

    const handleArrayInputChange = (field: string, index: number, value: string) => {
        const newArray = [...(editData[field as keyof typeof editData] as string[])];
        newArray[index] = value;
        setEditData({
            ...editData,
            [field]: newArray
        });
    };

    const handleAddArrayItem = (field: string) => {
        setEditData({
            ...editData,
            [field]: [...(editData[field as keyof typeof editData] as string[]), '']
        });
    };

    const handleRemoveArrayItem = (field: string, index: number) => {
        const newArray = [...(editData[field as keyof typeof editData] as string[])];
        newArray.splice(index, 1);
        setEditData({
            ...editData,
            [field]: newArray
        });
    };

    const handleSubmit = async () => {
        setIsLoading(true);
       try {
        const token=await getToken();
        const response = await axios.put(`${backendUrl}api/v1/admin/courses/${course.id}`, editData,{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        if(response.status === 200){
            setIsEditModalOpen(false);
            toast.success("Course updated successfully");
            window.location.reload();
        }
        else{
            toast.error("Failed to update course");
        }
       } catch (error) {
        console.log(error);
        toast.error("Error updating course");
       }
       setIsLoading(false);
    };

    return (
        <div className="flex flex-col p-8 gap-8 bg-gray-50 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">Course Details</h1>
                <button 
                    onClick={openEditModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Edit Details
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="flex flex-col items-center bg-white shadow p-6 rounded-lg">
                    <h1 className="text-lg font-semibold text-gray-700">Open for Enrollment</h1>
                    <p className={`text-lg ${course?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                        {course?.isActive ? 'Yes' : 'No'}
                    </p>
                </div>
                <div className="flex flex-col items-center bg-white shadow p-6 rounded-lg">
                    <h1 className="text-lg font-semibold text-gray-700">Show Course Notice</h1>
                    <p className={`text-lg ${course?.showCourseNotice ? 'text-blue-600' : 'text-gray-600'}`}>
                        {course?.showCourseNotice ? 'Show' : 'Hide'}
                    </p>
                </div>
                <div className="flex flex-col items-center bg-white shadow p-6 rounded-lg">
                    <h1 className="text-lg font-semibold text-gray-700">Price</h1>
                    <p className="text-lg text-purple-600">Rs.{course?.price}</p>
                </div>
                <div className="flex flex-col items-center bg-white shadow p-6 rounded-lg">
                    <h1 className="text-lg font-semibold text-gray-700">Published</h1>
                    <p className={`text-lg ${course?.published ? 'text-blue-600' : 'text-gray-600'}`}>
                        {course?.published ? 'Published' : 'Not Published'}
                    </p>
                </div>
                <div className="flex flex-col items-center bg-white shadow p-6 rounded-lg">
                    <h1 className="text-lg font-semibold text-gray-700">Category</h1>
                    <p className=" border-2 mt-1 border-gray-300 p-1 rounded-3xl text-lg">{course?.category?.name}</p>
                </div>
            </div>
            <div className="bg-white shadow p-6 rounded-lg">
                <h1 className="text-xl font-bold text-gray-800">Description</h1>
                <p className="text-gray-700">{course?.description}</p>
            </div>
            <div className="bg-white shadow p-6 rounded-lg">
                <h1 className="text-xl font-bold text-gray-800">Overview</h1>
                {course?.overview?.map((item: any, index: any) => (
                    <p key={index} className="text-gray-700">• {item}</p>
                ))}
            </div>
            <div className="bg-white shadow p-6 rounded-lg">
                <h1 className="text-xl font-bold text-gray-800">Learning Outcomes</h1>
                {course?.learningOutcomes?.map((item: any, index: any) => (
                    <p key={index} className="text-gray-700">• {item}</p>
                ))}
            </div>
            <div className="bg-white shadow p-6 rounded-lg">
                <h1 className="text-xl font-bold text-gray-800">Requirements</h1>
                {course?.requirements?.map((item: any, index: any) => (
                    <p key={index} className="text-gray-700">• {item}</p>
                ))}
            </div>
            <div className="bg-white shadow p-6 rounded-lg">
                <h1 className="text-xl font-bold text-gray-800">For Whom</h1>
                {course?.forwhom?.map((item: any, index: any) => (
                    <p key={index} className="text-gray-700">• {item}</p>
                ))}
            </div>
            <div className="bg-white shadow p-6 rounded-lg">
                <h1 className="text-xl font-bold text-gray-800">Language</h1>
                <p className="text-gray-700">{course?.language}</p>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Edit Course Details</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Title (Name of the course must be unique)</label>
                            <input
                                type="text"
                                name="title"
                                value={editData.title}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Published</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={editData.published}
                                    onChange={(e) => setEditData({...editData, published: e.target.checked})}
                                    className="mr-2"
                                />
                                <span>Yes</span>
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Open for Enrollment</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={editData.isActive}
                                    onChange={(e) => setEditData({...editData, isActive: e.target.checked})}
                                    className="mr-2"
                                />
                                <span>Yes</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Show course notice</label>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={editData.showCourseNotice}
                                    onChange={(e) => setEditData({...editData, showCourseNotice: e.target.checked})}
                                    className="mr-2"
                                />
                                <span>Show course notice</span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Course Notice</label>
                            <input
                                type="text"
                                name="courseNotice"
                                value={editData.courseNotice}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                        

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Price (Rs.)</label>
                            <input
                                type="number"
                                name="price"
                                value={editData.price}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Description</label>
                            <textarea
                                name="description"
                                value={editData.description}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Language</label>
                            <input
                                type="text"
                                name="language"
                                value={editData.language}
                                onChange={handleInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        {/* Overview */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 font-bold">Overview</label>
                                <button 
                                    type="button" 
                                    onClick={() => handleAddArrayItem('overview')}
                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                                >
                                    + Add Item
                                </button>
                            </div>
                            {editData.overview.map((item, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleArrayInputChange('overview', index, e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveArrayItem('overview', index)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Learning Outcomes */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 font-bold">Learning Outcomes</label>
                                <button 
                                    type="button" 
                                    onClick={() => handleAddArrayItem('learningOutcomes')}
                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                                >
                                    + Add Item
                                </button>
                            </div>
                            {editData.learningOutcomes.map((item, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleArrayInputChange('learningOutcomes', index, e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveArrayItem('learningOutcomes', index)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Requirements */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 font-bold">Requirements</label>
                                <button 
                                    type="button" 
                                    onClick={() => handleAddArrayItem('requirements')}
                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                                >
                                    + Add Item
                                </button>
                            </div>
                            {editData.requirements.map((item, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleArrayInputChange('requirements', index, e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveArrayItem('requirements', index)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* For Whom */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-gray-700 font-bold">For Whom</label>
                                <button 
                                    type="button" 
                                    onClick={() => handleAddArrayItem('forwhom')}
                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                                >
                                    + Add Item
                                </button>
                            </div>
                            {editData.forwhom.map((item, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handleArrayInputChange('forwhom', index, e.target.value)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => handleRemoveArrayItem('forwhom', index)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button 
                                onClick={() =>{
                                    setEditData({
                                        title: course?.title || '',
                                        description: '',
                                        overview: [] as string[],
                                        learningOutcomes: [] as string[],
                                        requirements: [] as string[],
                                        forwhom: [] as string[],
                                        language: '',
                                        price: 0,
                                        isActive: false,
                                        courseNotice: '',
                                        showCourseNotice: true,
                                        published: false
                                    })
                                    setIsEditModalOpen(false)}}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const Modules = ({course}: any) => {
    return (
        <div className="p-16">
            <h1 className="text-2xl font-bold">Modules</h1>
            {course?.modules?.map((module: any, index: any) => (
                <div key={index} className="mb-8">
                    <h2 className="text-xl font-bold">{module.title}</h2>
                    <div className="ml-4">
                        {module.topics?.map((topic: any, topicIndex: any) => (
                            <div key={topicIndex} className="mb-4">
                                <h3 className="text-lg font-semibold">{topic.title}</h3>
                                <div className="ml-4">
                                    {topic.contents?.map((content: any, contentIndex: any) => (
                                        <p key={contentIndex} className="text-gray-700">• {content.name} ({content.type})</p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

const EditCourse = () => {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'details' | 'module'>('details');
    const { id } = useParams();

    useEffect(() => {
        const fetchCourse = async () => {
            const res = await axios.get(`${backendUrl}api/v1/course/${id}`);
            setCourse(res.data as Course);
            setLoading(false);
        }
        fetchCourse();
    }, [id]);

    if (loading) {
        return <LoadingScreen />;
    }
    
    return (
        <div className="flex">
            <div className="flex gap-10 montserrat-400 flex-col mt-10">
                <button 
                    className={`p-2 ${selectedTab === 'details' ? 'font-bold border-l-2 border-black' : ''}`} 
                    onClick={() => setSelectedTab('details')}
                >
                    <FiBook className="inline-block mr-2" />
                    Details
                </button>
                <button
                    className={`p-2 ${selectedTab === 'module' ? 'font-bold border-l-2 border-black' : ''}`} 
                    onClick={() => setSelectedTab('module')}
                >
                    <FiBookOpen className="inline-block mr-2" />
                    Modules
                </button>
            </div>
            <div className="pl-10 flex-grow">
                <div className="flex text-3xl montserrat-700 items-center m-10">
                    <h1 className="text-4xl font-bold">{course?.title}</h1>
                </div>
                {selectedTab === 'details' && (
                    <div>
                        <Details course={course} />
                    </div>
                )}
                {selectedTab === 'module' && (
                    <div>
                        <Modules course={course} />
                    </div>
                )}
            </div>
            <Toaster />
        </div>
    )
}

export default EditCourse;