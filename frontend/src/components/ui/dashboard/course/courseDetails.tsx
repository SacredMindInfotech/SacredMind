import { useEffect } from "react";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import EditCourseModal from "./editCourseModal";
import DeleteCourseModal from "./deleteCourseModal";




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
    overview: string[];
    learningOutcomes: string[];
    requirements: string[];
    forwhom: string[];
    language: string;
    modules: Module[];
    category:Category;
    showCourseNotice:boolean;
    courseNotice:string | null;
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
    parentId: number ;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;


const Details = ({ course }:{course: Course}) => {
    const { getToken } = useAuth();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState('');
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
        published: false,
        categoryId: 0,
        imageUrl: ''
    });
    const [selectedImage, setSelectedImage] = useState<File | null>(null);  
    const [categories, setCategories] = useState<Category[]>([]);
    const [categorySearch, setCategorySearch] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);


    useEffect(() => {
        const fetchCategories = async () => {
            const res = await axios.get(`${backendUrl}api/v1/category/onlySubcategories`);
            setCategories(res.data as Category[]);
        }
        fetchCategories();
    }, []);

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
            published: course?.published || false,
            categoryId: course?.categoryId || 0,
            imageUrl: course?.imageUrl || ``
        });
        setIsEditModalOpen(true);
        console.log(editData);
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

        const formData = new FormData();
        formData.append('title', editData.title);
        formData.append('description', editData.description);
        formData.append('price', editData.price.toString());
        formData.append('language', editData.language);
        formData.append('isActive', editData.isActive.toString());
        formData.append('published', editData.published.toString());
        formData.append('categoryId', editData.categoryId.toString());
        if(editData.imageUrl.length > 4){   
            formData.append('imageUrl', editData.imageUrl);
        }
        editData.learningOutcomes.forEach((item: string, index: number) => {
            formData.append(`learningOutcomes[${index}]`, item);
        });

        editData.requirements.forEach((item: string, index: number) => {
            formData.append(`requirements[${index}]`, item);
        });

        editData.forwhom.forEach((item: string, index: number) => {
            formData.append(`forwhom[${index}]`, item);
        });
        
        formData.append('image', selectedImage!);

        const response = await axios.put(`${backendUrl}api/v1/admin/courses/${course.id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
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

    const handleDeleteCourse = async () => {
        if (deleteConfirmation !== 'delete') {
            toast.error('Please type "delete" to confirm');
            return;
        }
        
        setIsLoading(true);
        try {
            const token = await getToken();
            
            const response = await axios.delete(`${backendUrl}api/v1/admin/courses/${course.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.status === 200) {
                toast.success("Course deleted successfully");
                // Redirect to courses page after successful deletion
                setTimeout(() => {
                    navigate('/admin/courses');
                }, 1500);
            } else {
                toast.error("Failed to delete course");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting course");
        }
        setIsLoading(false);
        setIsDeleteModalOpen(false);
    };

    // Filter categories based on search input
    const filteredCategories = categories.filter(category => 
        category.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // Handle category selection
    const handleCategorySelect = (categoryId: number) => {
        setEditData({...editData, categoryId});
        setShowCategoryDropdown(false);
    };

    // Get selected category name
    const selectedCategoryName = categories.find(c => c.id === editData.categoryId)?.name || '';

    return (
        <div className="flex flex-col gap-8 bg-white rounded-xl shadow-sm">
            {/* Header with actions */}
            <div className="p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${course?.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {course?.published ? 'Published' : 'Draft'}
                        </span>
                        <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${course?.isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                            {course?.isActive ? 'Enrollment Open' : 'Enrollment Closed'}
                        </span>
                        <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {course?.category?.name}
                        </span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={openEditModal}
                        className="px-6 py-3 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                    >
                        Edit Details
                    </button>
                    <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-6 py-3 rounded-md border border-white bg-red-600 text-white hover:shadow-[4px_4px_0px_0px_rgba(255,0,0,0.3)] hover:text-white hover:border-red-700 hover:bg-red-700 transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                    >
                        Delete Course
                    </button>
                </div>
            </div>
            
            {/* Course stats */}
            <div className="px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center transition-all hover:shadow-md">
                        <div className="text-gray-500 text-sm font-medium mb-1">Price</div>
                        <div className="text-2xl font-bold text-gray-900">₹{course?.price}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center transition-all hover:shadow-md">
                        <div className="text-gray-500 text-sm font-medium mb-1">Language</div>
                        <div className="text-xl font-bold text-gray-900">{course?.language || 'Not specified'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center transition-all hover:shadow-md">
                        <div className="text-gray-500 text-sm font-medium mb-1">Course Notice</div>
                        <div className="text-xl font-bold text-gray-900">{course?.showCourseNotice ? 'Visible' : 'Hidden'}</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center transition-all hover:shadow-md">
                        <div className="text-gray-500 text-sm font-medium mb-1">Category</div>
                        <div className="text-xl font-bold text-gray-900">{course?.category?.name}</div>
                    </div>
                </div>
            </div>
            
            {/* Course content */}
            <div className="px-6 pb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Description
                    </h2>
                    <p className="text-gray-700 whitespace-pre-line">{course?.description || 'No description provided.'}</p>
                </div>
                
                {/* Course Notice */}
                {course?.courseNotice && (
                    <div className="bg-yellow-50 rounded-xl p-6 hover:shadow-md transition-all">
                        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Course Notice
                        </h2>
                        <p className="text-gray-700">{course?.courseNotice}</p>
                        <div className="mt-2 text-sm text-gray-500">
                            {course?.showCourseNotice ? 'This notice is visible to students' : 'This notice is currently hidden from students'}
                        </div>
                    </div>
                )}
                
                {/* Overview */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Overview
                    </h2>
                    {course?.overview?.length > 0 ? (
                        <ul className="space-y-2">
                            {course?.overview?.map((item: string, index: number) => (
                                <li key={index} className="flex gap-2 items-start">
                                  <span className="text-gray-700">•</span> <span className="text-gray-700"> {item}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">No overview provided.</p>
                    )}
                </div>
                
                {/* Learning Outcomes */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Learning Outcomes
                    </h2>
                    {course?.learningOutcomes?.length > 0 ? (
                        <ul className="space-y-2">
                            {course?.learningOutcomes?.map((item: string, index: number) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block w-4 h-4 rounded-full bg-green-100 text-green-600 items-center justify-center mr-2 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">No learning outcomes provided.</p>
                    )}
                </div>
                
                {/* Requirements */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Requirements
                    </h2>
                    {course?.requirements?.length > 0 ? (
                        <ul className="space-y-2">
                            {course?.requirements?.map((item: string, index: number) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block w-4 h-4 rounded-full bg-green-100 text-green-600 items-center justify-center mr-2 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">No requirements specified.</p>
                    )}
                </div>
                
                {/* For Whom */}
                <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-all">
                    <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        For Whom
                    </h2>
                    {course?.forwhom?.length > 0 ? (
                        <ul className="space-y-2">
                            {course?.forwhom?.map((item: string, index: number) => (
                                <li key={index} className="flex items-start">
                                    <span className="inline-block w-4 h-4 rounded-full bg-green-100 text-green-600 items-center justify-center mr-2 mt-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">No target audience specified.</p>
                    )}
                </div>
            </div>

            {/* Edit Course Modal */}
            <EditCourseModal 
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                editData={editData}
                setEditData={setEditData}
                handleInputChange={handleInputChange}
                handleArrayInputChange={handleArrayInputChange}
                handleAddArrayItem={handleAddArrayItem}
                handleRemoveArrayItem={handleRemoveArrayItem}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
                categories={categories}
                categorySearch={categorySearch}
                setCategorySearch={setCategorySearch}
                showCategoryDropdown={showCategoryDropdown}
                setShowCategoryDropdown={setShowCategoryDropdown}
                filteredCategories={filteredCategories}
                handleCategorySelect={handleCategorySelect}
                selectedCategoryName={selectedCategoryName}
                setSelectedImage={setSelectedImage}
            />

            {/* Delete Course Modal */}
            <DeleteCourseModal 
                isDeleteModalOpen={isDeleteModalOpen}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                deleteConfirmation={deleteConfirmation}
                setDeleteConfirmation={setDeleteConfirmation}
                handleDeleteCourse={handleDeleteCourse}
                isLoading={isLoading}
            />

            {/* Main content wrapper - adjusts width when any sidebar is open */}
            <div className={`transition-all duration-300 ${isEditModalOpen || isDeleteModalOpen ? 'pr-80' : ''}`}>
              
            </div>
            
            {/* Course Banner Image */}
            <div className="px-6 pb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Course Banner Image
                </h2>
                
                {course?.imageUrl ? (
                    <div className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all">
                        <img 
                            src={course.imageUrl} 
                            alt={`${course.title} banner`} 
                            className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                        />
                    </div>
                ) : (
                    <div className="bg-gray-50 rounded-xl p-8 hover:shadow-md transition-all flex flex-col items-center justify-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-center">No banner image available for this course</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Details;