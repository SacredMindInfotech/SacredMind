import { useAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


interface Category {
    id: number;
    name: string;
    parentId: number;
}



const AddCourse = () => {

    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState({
        title: '',
        description: '',
        price: 0,
        published: false,
        categoryId: 0,
        overview: [] as string[],
        learningOutcomes: [] as string[],
        requirements: [] as string[],
        forwhom: [] as string[],
        language: 'English',
    });
    const [subCategories,setSubCategories]=useState<Category[] | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // Add state for language dropdown
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const languageOptions = ['English', 'Hindi', 'Punjabi'];

    // Handle input changes for simple fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setCourse({ ...course, [name]: checked });
        } else if (name === 'price' || name === 'categoryId') {
            setCourse({ ...course, [name]: Number(value) });
        } else {
            setCourse({ ...course, [name]: value });
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await axios.get(`${backendUrl}api/v1/category/onlySubcategories`);
            setSubCategories(res.data as Category[]);
        }
        fetchCategories();
    }, []);

    // Handle array fields 
    const handleArrayChange = (index: number, value: string, field: string) => {
        const updatedArray = [...course[field as keyof typeof course] as string[]];
        updatedArray[index] = value;
        setCourse({ ...course, [field]: updatedArray });
    };

    // Add new item to array fields
    const addArrayItem = (field: string) => {
        const updatedArray = [...course[field as keyof typeof course] as string[], ''];
        setCourse({ ...course, [field]: updatedArray });
    };

    // Remove item from array fields
    const removeArrayItem = (index: number, field: string) => {
        const updatedArray = [...course[field as keyof typeof course] as string[]];
        updatedArray.splice(index, 1);
        setCourse({ ...course, [field]: updatedArray });
    };

    //  new handler for file input
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
            setCourse({ ...course });
        }
    };

    // Filter categories based on search term
    const filteredCategories = subCategories?.filter(category => 
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = await getToken();
            
            // Create FormData if there's a selected image
            let data;
            if (selectedImage) {
                const formData = new FormData();
                
                // Handle primitive fields
                formData.append('title', course.title);
                formData.append('description', course.description);
                formData.append('price', String(course.price));
                formData.append('categoryId', String(course.categoryId));
                formData.append('published', String(course.published));
                formData.append('language', course.language);
                
                // Handle array fields by stringifying them
                formData.append('overview', JSON.stringify(course.overview));
                formData.append('learningOutcomes', JSON.stringify(course.learningOutcomes));
                formData.append('requirements', JSON.stringify(course.requirements));
                formData.append('forwhom', JSON.stringify(course.forwhom));
                
                // Add the image file
                formData.append('image', selectedImage);
                data = formData;
            } else {
                data = course;
            }

            const response = await axios.post(`${backendUrl}api/v1/admin/courses`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...(selectedImage ? { 'Content-Type': 'multipart/form-data' } : {})
                },
            });
            

            if (response.status !== 201) {
                toast.error( 'Failed to create course');
                //@ts-ignore
                throw new Error(response.data.message || 'Failed to create course');
            }
            toast.success('Course created successfully!');
            navigate('/admin/courses');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Render array field inputs
    const renderArrayField = (field: string, label: string) => {
        const items = course[field as keyof typeof course] as string[];

        return (
            <div className="mb-6">
                <label className="block text-sm font-medium mb-3">{label}</label>
                {items.map((item, index) => (
                    <div key={index} className="flex mb-3">
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleArrayChange(index, e.target.value, field)}
                            className="flex-grow p-2 border rounded-md mr-2"
                            placeholder={`Enter ${label.toLowerCase()} item`}
                        />
                        <button
                            type="button"
                            onClick={() => removeArrayItem(index, field)}
                            className="p-2 bg-red-500 text-white rounded-full flex items-center justify-center w-8 h-8"
                            aria-label="Remove item"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => addArrayItem(field)}
                    className="flex items-center text-blue-500 font-medium"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add Item
                </button>
            </div>
        );
    };

    // Replace the categoryId input field with this dropdown component
    const renderCategoryDropdown = () => {
        return (
            <div className="mb-4 relative">
                <label htmlFor="categoryId" className="block text-sm font-medium mb-1">Category*</label>
                <div className="relative">
                    <div 
                        className="w-full p-2 border rounded-md flex justify-between items-center cursor-pointer"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <span>
                            {course.categoryId ? 
                                subCategories?.find(cat => cat.id === course.categoryId)?.name || 'Select a category' 
                                : 'Select a category'}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                    
                    {isDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            <div className="p-2 border-b">
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full p-2 border rounded-md"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map(category => (
                                    <div 
                                        key={category.id}
                                        className={`p-2 hover:bg-gray-100 cursor-pointer ${course.categoryId === category.id ? 'bg-blue-100' : ''}`}
                                        onClick={() => {
                                            setCourse({ ...course, categoryId: category.id });
                                            setIsDropdownOpen(false);
                                            setSearchTerm('');
                                        }}
                                    >
                                        {category.name}
                                    </div>
                                ))
                            ) : (
                                <div className="p-2 text-gray-500">No categories found</div>
                            )}
                        </div>
                    )}
                </div>
                {course.categoryId === 0 && (
                    <p className="text-red-500 text-xs mt-1">Please select a category</p>
                )}
            </div>
        );
    };

    // Replace the language input with this dropdown component
    <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Language*</label>
        <div className="relative">
            <div 
                className="w-full p-2 border rounded-md flex justify-between items-center cursor-pointer"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
            >
                <span>{course.language || 'Select a language'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </div>
            
            {isLanguageDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                    {languageOptions.map(language => (
                        <div 
                            key={language}
                            className={`p-2 hover:bg-gray-100 cursor-pointer ${course.language === language ? 'bg-blue-100' : ''}`}
                            onClick={() => {
                                setCourse({ ...course, language });
                                setIsLanguageDropdownOpen(false);
                            }}
                        >
                            {language}
                        </div>
                    ))}
                </div>
            )}
        </div>
        {!course.language && (
            <p className="text-red-500 text-xs mt-1">Please select a language</p>
        )}
    </div>

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-4xl font-bold montserrat-700 mb-6">Add Course</h1>

            <form className='montserrat-500' onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title*</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={course.title}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                        minLength={5}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Description*</label>
                    <textarea
                        id="description"
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        required
                        minLength={10}
                        rows={4}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium mb-1">Price*</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={course.price === 0 ? '' : course.price}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                            required
                            min={0}
                            step="0.01"
                            placeholder="0.00"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Language*</label>
                        <div className="relative">
                            <div 
                                className="w-full p-2 border rounded-md flex justify-between items-center cursor-pointer"
                                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                            >
                                <span>{course.language || 'Select a language'}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </div>
                            
                            {isLanguageDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                                    {languageOptions.map(language => (
                                        <div 
                                            key={language}
                                            className={`p-2 hover:bg-gray-100 cursor-pointer ${course.language === language ? 'bg-blue-100' : ''}`}
                                            onClick={() => {
                                                setCourse({ ...course, language });
                                                setIsLanguageDropdownOpen(false);
                                            }}
                                        >
                                            {language}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {!course.language && (
                            <p className="text-red-500 text-xs mt-1">Please select a language</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {renderCategoryDropdown()}

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Course Image</label>
                        <div className="flex flex-col space-y-2">
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="published"
                            checked={course.published}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <span className="text-sm font-medium">Publish course</span>
                    </label>
                </div>

                {renderArrayField('overview', 'Overview')}
                {renderArrayField('learningOutcomes', 'Learning Outcomes')}
                {renderArrayField('requirements', 'Requirements')}
                {renderArrayField('forwhom', 'For Whom')}

                <div className="flex gap-4 max-w-2xl mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="py-3 px-6 bg-gray-900 text-white rounded-md border border-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary"
                    >
                        {loading ? 'Creating...' : 'Create Course'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/admin/courses')}
                        className="px-6 py-3 rounded-md border border-white bg-red-600 text-white hover:shadow-[4px_4px_0px_0px_rgba(255,0,0,0.3)] hover:text-white hover:border-red-700 hover:bg-red-700 transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCourse;
