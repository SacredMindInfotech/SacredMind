import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface Category {
    id: number;
    name: string;
    parentId: number | null;
    subcategories?: Category[];
    courseCount?: number;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
    const [coursesForSubcategory, setCoursesForSubcategory] = useState<Record<number, any[]>>({});
    const { getToken } = useAuth();
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState<'categories' | 'statistics'>('categories');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        name: '',
        minSubcategories: '',
        maxSubcategories: '',
        sortBy: 'name' as 'name' | 'subcategoryCount',
        sortOrder: 'asc' as 'asc' | 'desc',
        hasSubcategories: '' as '' | 'yes' | 'no'
    });
    const [filteredCategories, setFilteredCategories] = useState<any[]>([]);

    // Toggle category expansion
    const toggleCategoryExpansion = (categoryId: number) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };
    
    // Toggle subcategory courses display and fetch courses if needed
    const toggleSubcategoryCourses = async (subcategoryId: number) => {
        // If courses are already loaded, just toggle visibility
        if (coursesForSubcategory[subcategoryId]) {
            //@ts-ignore
            setCoursesForSubcategory(prev => ({
                ...prev,
                [subcategoryId]: prev[subcategoryId] ? undefined : prev[subcategoryId]
            }));
            return;
        }
        
        // Otherwise fetch courses for this subcategory
        try {
            const res = await axios.get(`${backendUrl}api/v1/category/${subcategoryId}/courses`);
            //@ts-ignore
            setCoursesForSubcategory(prev => ({
                ...prev,
                [subcategoryId]: res.data
            }));
        } catch (err) {
            console.error(`Error fetching courses for subcategory ${subcategoryId}:`, err);
        }
    };
    
    // Navigate to course details page
    const navigateToCourse = (courseId: number) => {
        navigate(`/admin/course/${courseId}`);
    };
    
    // Fetch categories and organize them hierarchically
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${backendUrl}api/v1/category`);
            
            // Process each category to get its subcategories and course counts
            const processedCategories = await Promise.all(
                //@ts-ignore
                res.data.filter((cat: Category) => cat.parentId === null).map(async (cat: Category) => {
                    try {
                        // Get category details including subcategories
                        const categoryRes = await axios.get(`${backendUrl}api/v1/category/${cat.name}`);
                        const categoryData = categoryRes.data;
                        
                        // Process subcategories to get course counts
                        let subcategories = [];
                        //@ts-ignore
                        if (categoryData.subcategories && categoryData.subcategories.length > 0) {
                            subcategories = await Promise.all(
                                //@ts-ignore
                                categoryData.subcategories.map(async (subcat: Category) => {
                                    // Get courses for each subcategory
                                    const courseRes = await axios.get(`${backendUrl}api/v1/category/${subcat.id}/courses`);
                                    return {
                                        ...subcat,
                                        //@ts-ignore
                                        courseCount: courseRes.data.length || 0
                                    };
                                })
                            );
                        }
                        
                        return {
                            //@ts-ignore
                            ...categoryData,
                            subcategories
                        };
                    } catch (err) {
                        console.error(`Error fetching details for category ${cat.id}:`, err);
                        return {
                            ...cat,
                            subcategories: []
                        };
                    }
                })
            );
            
            setCategories(processedCategories);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Apply filters to categories
    useEffect(() => {
        if (!categories) return;
        
        let filtered = [...categories];
        
        // Filter by name
        if (filters.name) {
            filtered = filtered.filter(cat => 
                cat.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }
        
        // Filter by subcategory count
        if (filters.minSubcategories) {
            const min = parseInt(filters.minSubcategories);
            filtered = filtered.filter(cat => 
                (cat.subcategories?.length || 0) >= min
            );
        }
        
        if (filters.maxSubcategories) {
            const max = parseInt(filters.maxSubcategories);
            filtered = filtered.filter(cat => 
                (cat.subcategories?.length || 0) <= max
            );
        }
        
        // Filter by has subcategories
        if (filters.hasSubcategories === 'yes') {
            filtered = filtered.filter(cat => 
                (cat.subcategories?.length || 0) > 0
            );
        } else if (filters.hasSubcategories === 'no') {
            filtered = filtered.filter(cat => 
                (cat.subcategories?.length || 0) === 0
            );
        }
        
        // Sort categories
        filtered.sort((a, b) => {
            if (filters.sortBy === 'name') {
                return filters.sortOrder === 'asc' 
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            } else {
                const aCount = a.subcategories?.length || 0;
                const bCount = b.subcategories?.length || 0;
                return filters.sortOrder === 'asc' 
                    ? aCount - bCount
                    : bCount - aCount;
            }
        });
        
        setFilteredCategories(filtered);
    }, [categories, filters]);

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        
        try {
            const token = await getToken();
            const response = await axios.post(`${backendUrl}api/v1/admin/categories`, {
                name: newCategoryName,
                parentId: selectedParentId ? selectedParentId : null
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 201) {
                setNewCategoryName("");
                setSelectedParentId(null);
                fetchCategories();
            }
            
        } catch (err) {
            console.error("Error adding category:", err);
            setError("Failed to add category");
        }
    };
    
    const handleDeleteCategory = async (id: number, isParent: boolean, courseCount: number = 0) => {
        // Check if it's a subcategory with courses
        if (!isParent && courseCount > 0) {
            alert("Cannot delete subcategory with associated courses");
            return;
        }
        
        // Check if it's a parent category with subcategories that have courses
        if (isParent) {
            const hasCoursesInSubcategories = categories?.find(cat => cat.id === id)?.subcategories?.some(
                //@ts-ignore
                subCat => (subCat.courseCount || 0) > 0
            );
            
            if (hasCoursesInSubcategories) {
                alert("Cannot delete category with courses in its subcategories");
                return;
            }
        }
        
        try {
            const token = await getToken();
            const response = await axios.delete(`${backendUrl}api/v1/admin/categories/${id}`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                fetchCategories();
            }
        } catch (err) {
            console.error("Error deleting category:", err);
            //@ts-ignore
            setError(err.response.data.error);
        }
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            name: '',
            minSubcategories: '',
            maxSubcategories: '',
            sortBy: 'name',
            sortOrder: 'asc',
            hasSubcategories: ''
        });
    };

    // Handle filter changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Get statistics
    const getCategoryStats = () => {
        if (!categories) return { total: 0, withSubcategories: 0, withoutSubcategories: 0, totalSubcategories: 0 };
        
        const total = categories.length;
        const withSubcategories = categories.filter(cat => (cat.subcategories?.length || 0) > 0).length;
        const withoutSubcategories = total - withSubcategories;
        const totalSubcategories = categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0);
        
        return { total, withSubcategories, withoutSubcategories, totalSubcategories };
    };

    const stats = getCategoryStats();

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-gray-900 text-white p-6">
                            <h2 className="text-xl font-bold mb-8 border-b border-gray-700 pb-4">Category Management</h2>
                            <div className="flex flex-col gap-3">
                                <button 
                                    className={`p-3 rounded-md flex items-center transition-all ${selectedTab === 'categories' ? 'bg-white text-gray-900 font-medium' : 'hover:bg-gray-800'}`} 
                                    onClick={() => setSelectedTab('categories')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6zm6 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                    Categories
                                </button>
                                <button
                                    className={`p-3 rounded-md flex items-center transition-all ${selectedTab === 'statistics' ? 'bg-white text-gray-900 font-medium' : 'hover:bg-gray-800'}`} 
                                    onClick={() => setSelectedTab('statistics')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                    </svg>
                                    Statistics
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="p-6 border-b border-gray-200">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Category Management</h1>
                                <div className="flex items-center mt-2 flex-wrap gap-2">
                                    <span className="text-sm text-gray-500">
                                        Total Categories: <span className="font-medium">{stats.total}</span>
                                    </span>
                                    <span className="text-sm text-gray-500 ml-4">
                                        With Subcategories: <span className="font-medium">{stats.withSubcategories}</span>
                                    </span>
                                    <span className="text-sm text-gray-500 ml-4">
                                        Total Subcategories: <span className="font-medium">{stats.totalSubcategories}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Add Category Form */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h2 className="text-lg font-semibold mb-3">Add New Category</h2>
                                    <div className="flex flex-col md:flex-row gap-3">
                                        <input
                                            type="text"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            placeholder="Category name"
                                            className="px-3 py-2 border rounded-md"
                                        />
                                        <select 
                                            className="px-3 py-2 border rounded-md"
                                            value={selectedParentId || ""}
                                            onChange={(e) => setSelectedParentId(e.target.value ? Number(e.target.value) : null)}
                                        >
                                            <option value="">No parent (Main category)</option>
                                            {categories?.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={handleAddCategory}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                        >
                                            Add Category
                                        </button>
                                    </div>
                                </div>
                                
                                {error && <div className="text-red-500 mb-4">{error}</div>}
                                
                                {selectedTab === 'categories' && (
                                    <div>
                                        <div className="mb-4 flex justify-end items-center w-full">
                                            <button
                                                onClick={() => setShowFilters(!showFilters)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                                                </svg>
                                                Filters
                                            </button>
                                        </div>
                                        
                                        {loading ? (
                                            <div className="flex justify-center items-center h-40">
                                                <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div>
                                                {filteredCategories && filteredCategories.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {filteredCategories.map((category) => (
                                                            <div key={category.id} className="border rounded-lg p-4">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="flex items-center">
                                                                        {category.subcategories && category.subcategories.length > 0 ? (
                                                                            <button 
                                                                                onClick={() => toggleCategoryExpansion(category.id)}
                                                                                className="mr-2 text-gray-600 focus:outline-none"
                                                                            >
                                                                                {expandedCategories[category.id] ? (
                                                                                    <span className="text-xl">▼</span>
                                                                                ) : (
                                                                                    <span className="text-xl">▶</span>
                                                                                )}
                                                                            </button>
                                                                        ) : (
                                                                            <span className="w-6"></span>
                                                                        )}
                                                                        <h3 className="text-xl font-semibold">{category.name}</h3>
                                                                        <span className="ml-2 text-sm text-gray-500">
                                                                            ({category.subcategories?.length || 0} subcategories)
                                                                        </span>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => handleDeleteCategory(category.id, true, category.courseCount)}
                                                                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                                
                                                                {category.subcategories && category.subcategories.length > 0 ? (
                                                                    <div className={`ml-6 mt-2 ${expandedCategories[category.id] ? 'block' : 'hidden'}`}>
                                                                        <h4 className="text-md font-medium mb-2">Subcategories:</h4>
                                                                        <ul className="space-y-2">
                                                                            {category.subcategories.map((subcat:any) => (
                                                                                <li key={subcat.id} className="p-2 bg-gray-50 rounded">
                                                                                    <div className="flex justify-between items-center">
                                                                                        <div className="flex items-center">
                                                                                            {/* @ts-ignore */}
                                                                                            {subcat.courseCount > 0 && (
                                                                                                <button 
                                                                                                    onClick={() => toggleSubcategoryCourses(subcat.id)}
                                                                                                    className="mr-2 text-gray-600 focus:outline-none"
                                                                                                >
                                                                                                    {coursesForSubcategory[subcat.id] ? (
                                                                                                        <span className="text-sm">▼</span>
                                                                                                    ) : (
                                                                                                        <span className="text-sm">▶</span>
                                                                                                    )}
                                                                                                </button>
                                                                                            )}
                                                                                            <span>{subcat.name} {subcat.courseCount ? `(${subcat.courseCount} courses)` : ''}</span>
                                                                                        </div>
                                                                                        <button 
                                                                                            onClick={() => handleDeleteCategory(subcat.id, false, subcat.courseCount)}
                                                                                            className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
                                                                                        >
                                                                                            Delete
                                                                                        </button>
                                                                                    </div>
                                                                                    
                                                                                    {/* Display courses for this subcategory */}
                                                                                    {coursesForSubcategory[subcat.id] && (
                                                                                        <div className="mt-2 ml-6">
                                                                                            <h5 className="text-sm font-medium mb-1">Courses:</h5>
                                                                                            <ul className="space-y-1">
                                                                                                {coursesForSubcategory[subcat.id].map(course => (
                                                                                                    <li 
                                                                                                        key={course.id} 
                                                                                                        className="p-1 pl-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                                                                                                        onClick={() => navigateToCourse(course.id)}
                                                                                                    >
                                                                                                        {course.title}
                                                                                                    </li>
                                                                                                ))}
                                                                                            </ul>
                                                                                        </div>
                                                                                    )}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-gray-500 ml-6">No subcategories</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p>No categories found. Add your first category above.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                
                                {selectedTab === 'statistics' && (
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h2 className="text-xl font-bold mb-6">Category Statistics</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-blue-800 text-sm font-medium">Total Categories</p>
                                                        <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                                                    </div>
                                                    <div className="p-3 bg-blue-100 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 1h10v8H5V6zm6 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-blue-700">Main categories in the system</p>
                                            </div>
                                            
                                            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-green-800 text-sm font-medium">With Subcategories</p>
                                                        <p className="text-3xl font-bold text-green-900">{stats.withSubcategories}</p>
                                                    </div>
                                                    <div className="p-3 bg-green-100 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-green-700">Categories with child categories</p>
                                            </div>
                                            
                                            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-purple-800 text-sm font-medium">Total Subcategories</p>
                                                        <p className="text-3xl font-bold text-purple-900">{stats.totalSubcategories}</p>
                                                    </div>
                                                    <div className="p-3 bg-purple-100 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-purple-700">Child categories in the system</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Filters Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button 
                            onClick={() => setShowFilters(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={filters.name}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by name"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="minSubcategories" className="block text-sm font-medium text-gray-700 mb-1">Min Subcategories</label>
                            <input
                                type="number"
                                id="minSubcategories"
                                name="minSubcategories"
                                value={filters.minSubcategories}
                                onChange={handleFilterChange}
                                min="0"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Minimum subcategories"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="maxSubcategories" className="block text-sm font-medium text-gray-700 mb-1">Max Subcategories</label>
                            <input
                                type="number"
                                id="maxSubcategories"
                                name="maxSubcategories"
                                value={filters.maxSubcategories}
                                onChange={handleFilterChange}
                                min="0"
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Maximum subcategories"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="hasSubcategories" className="block text-sm font-medium text-gray-700 mb-1">Has Subcategories</label>
                            <select
                                id="hasSubcategories"
                                name="hasSubcategories"
                                value={filters.hasSubcategories}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Categories</option>
                                <option value="yes">With Subcategories</option>
                                <option value="no">Without Subcategories</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                            <select
                                id="sortBy"
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="name">Name</option>
                                <option value="subcategoryCount">Subcategory Count</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                            <select
                                id="sortOrder"
                                name="sortOrder"
                                value={filters.sortOrder}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                        
                        <div className="pt-4 flex gap-2">
                            <button
                                onClick={resetFilters}
                                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for filters sidebar */}
            {showFilters && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => setShowFilters(false)}
                ></div>
            )}
        </div>
    );
};

export default CategoryManagement;
