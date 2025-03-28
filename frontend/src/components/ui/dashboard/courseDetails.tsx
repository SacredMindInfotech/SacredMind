import { useEffect } from "react";
import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";


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
        categoryId: 0
    });
    const [categories, setCategories] = useState<Category[]>([]);
    const [categorySearch, setCategorySearch] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const navigate = useNavigate();

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
            categoryId: course?.categoryId || 0
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
                                    <span className="inline-block w-4 h-4 rounded-full bg-green-100 text-green-600  items-center justify-center mr-2 mt-1">•</span>
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
                                    <span className="inline-block w-4 h-4 rounded-full bg-purple-100 text-purple-600 items-center justify-center mr-2 mt-1">•</span>
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
                                    <span className="inline-block w-4 h-4 rounded-full bg-orange-100 text-orange-600  items-center justify-center mr-2 mt-1">•</span>
                                    <span className="text-gray-700">{item}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic">No target audience specified.</p>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setIsEditModalOpen(false)}
                >
                    <div 
                        className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-6">Edit Course Details</h2>
                        
                        <div className="mb-4 relative">
                            <label className="block text-gray-700 font-bold mb-2">Category</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={categorySearch}
                                    onChange={(e) => {
                                        setCategorySearch(e.target.value);
                                        setShowCategoryDropdown(true);
                                    }}
                                    onFocus={() => setShowCategoryDropdown(true)}
                                    placeholder={selectedCategoryName || "Search for a category..."}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                                {selectedCategoryName && (
                                    <div className="mt-1 text-sm text-blue-600">
                                        Selected: {selectedCategoryName}
                                    </div>
                                )}
                                
                                {showCategoryDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                        {filteredCategories.length > 0 ? (
                                            filteredCategories.map(category => (
                                                <div 
                                                    key={category.id} 
                                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${editData.categoryId === category.id ? 'bg-blue-100' : ''}`}
                                                    onClick={() => handleCategorySelect(category.id)}
                                                >
                                                    {category.name}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-gray-500">No categories found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2">Title (Name of the course must be unique)</label>
                            <input
                                type="text"
                                name="title"
                                value={editData.title}
                                onChange={(e) => {
                                    const newValue = e.target.value.replace(/\./g, '');
                                    if (e.target.value.includes('.')) {
                                        toast.error('Course title cannot contain periods.');
                                    }
                                    setEditData({...editData, title: newValue});
                                }}
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
                            <textarea
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
                            <p className="text-gray-600 text-sm mt-1">18% GST will be charged on this amount from student at the time of payment</p>
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
                                        published: false,
                                        categoryId: 0
                                    })
                                    setIsEditModalOpen(false)}}
                                className="px-6 py-3 bg-white border border-gray-300  text-gray-800 font-medium rounded-lg  hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={isLoading || !editData.categoryId}
                                className={`px-6 py-3 rounded-md border border-white ${!editData.categoryId ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white'} text-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap`}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div 
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteConfirmation('');
                    }}
                >
                    <div 
                        className="bg-white rounded-lg p-8 max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Delete Course</h2>
                        <p className="mb-6">
                            Are you sure you want to delete <strong>{course.title}</strong>? This action cannot be undone.
                        </p>
                        <p className="mb-4 text-sm text-gray-600">
                            To confirm, please type <strong>"delete"</strong> in the field below:
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmation}
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Type 'delete' to confirm"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-6"
                        />
                        <div className="flex justify-end gap-4">
                            <button 
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setDeleteConfirmation('');
                                }}
                                className="px-6 py-3 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDeleteCourse}
                                disabled={isLoading}
                                className="px-6 py-3 rounded-md border border-white bg-red-600 text-white hover:shadow-[4px_4px_0px_0px_rgba(255,0,0,0.3)] hover:text-white hover:border-red-700 hover:bg-red-700 transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                            >
                                {isLoading ? 'Deleting...' : 'Delete Course'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Details;