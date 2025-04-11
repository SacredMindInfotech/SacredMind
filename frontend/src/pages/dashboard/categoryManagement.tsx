import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import CategoryStats from "../../components/ui/dashboard/category/categoryStats";
import AddCategory from "../../components/ui/dashboard/category/addCategory";
import { toast } from "react-hot-toast";

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
                [subcategoryId]: undefined
            }));
        } else {
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
                toast.error("Failed to fetch courses for this subcategory");
            }
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
                        const lowerCaseCategoryName = cat.name.toLowerCase()
                        const categoryRes = await axios.get(`${backendUrl}api/v1/category/${lowerCaseCategoryName}`);
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
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 201) {
                toast.success("Category added successfully");
                setNewCategoryName("");
                setSelectedParentId(null);
                fetchCategories();
            }

        } catch (err) {
            console.error("Error adding category:", err);
            toast.error("Failed to add category");
        }
    };

    const handleDeleteCategory = async (id: number, isParent: boolean, courseCount: number = 0) => {
        try {
            // Check if it's a subcategory with courses
            if (!isParent && courseCount > 0) {
                alert("Cannot delete subcategory with associated courses")
                toast.error("Cannot delete subcategory with associated courses");
                return;
            }

            // Check if it's a parent category with subcategories that have courses
            if (isParent) {
                const category = categories.find(cat => cat.id === id);
                const hasCoursesInSubcategories = category?.subcategories?.some(
                    (subCat: any) => subCat.courseCount > 0
                );

                if (hasCoursesInSubcategories) {
                    alert("Cannot delete category with courses in its subcategories");
                    toast.error("Cannot delete category with courses in its subcategories");
                    return;
                }
            }

            const token = await getToken();
            const response = await axios.delete(`${backendUrl}api/v1/admin/categories/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                alert("Category deleted successfully");
                toast.success("Category deleted successfully");
                fetchCategories();
            }
        } catch (err) {
            toast.error("Failed to delete category");
            console.error("Error deleting category:", err);
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
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="flex flex-col md:flex-row">

                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-gray-900 text-white p-6">
                            <h2 className="text-xl font-bold mb-8 border-b border-gray-700 pb-4">Category Management</h2>
                            <div className="flex flex-col gap-3">
                                <button
                                    className={`p-3 rounded-md flex items-center transition-all ${selectedTab === 'categories' ? 'bg-white text-gray-900 font-medium' : 'hover:bg-gray-800'}`}
                                    onClick={() => setSelectedTab('categories')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    Categories
                                </button>
                                <button
                                    className={`p-3 rounded-md flex items-center transition-all ${selectedTab === 'statistics' ? 'bg-white text-gray-900 font-medium' : 'hover:bg-gray-800'}`}
                                    onClick={() => setSelectedTab('statistics')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            Total: <span className="font-medium">{stats.total}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            With Subcategories: <span className="font-medium">{stats.withSubcategories}</span>
                                        </span>
                                    </div>
                                    <div className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                        <span className="text-sm text-gray-700">
                                            Total Subcategories: <span className="font-medium">{stats.totalSubcategories}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Add Category Form */}
                                <AddCategory newCategoryName={newCategoryName} setNewCategoryName={setNewCategoryName} selectedParentId={selectedParentId} setSelectedParentId={setSelectedParentId} handleAddCategory={handleAddCategory} categories={categories}></AddCategory>

                                {selectedTab === 'categories' && (
                                    <div>
                                        <div className="mb-4 flex justify-end items-center w-full">
                                            <button
                                                onClick={() => setShowFilters(!showFilters)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                                </svg>
                                                Filters
                                            </button>
                                        </div>

                                        {loading ? (
                                            <div className="flex justify-center items-center h-40">
                                                <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div>
                                                {filteredCategories && filteredCategories.length > 0 ? (
                                                    <div className="space-y-4">
                                                        {filteredCategories.map((category) => (
                                                            <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <div className="flex items-center">
                                                                        {category.subcategories && category.subcategories.length > 0 ? (
                                                                            <button
                                                                                onClick={() => toggleCategoryExpansion(category.id)}
                                                                                className="mr-2 text-gray-600 focus:outline-none hover:text-blue-500 transition-colors"
                                                                            >
                                                                                {expandedCategories[category.id] ? (
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                                                    </svg>
                                                                                ) : (
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                                    </svg>
                                                                                )}
                                                                            </button>
                                                                        ) : (
                                                                            <span className="w-6"></span>
                                                                        )}
                                                                        <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
                                                                        <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                                            {category.subcategories?.length || 0} subcategories
                                                                        </span>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleDeleteCategory(category.id, true, category.courseCount)}
                                                                        className="px-3 py-1 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition duration-200 flex items-center gap-1"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                        Delete
                                                                    </button>
                                                                </div>

                                                                {category.subcategories && category.subcategories.length > 0 ? (
                                                                    <div className={`ml-6 mt-3 ${expandedCategories[category.id] ? 'block' : 'hidden'}`}>
                                                                        <div className="flex items-center mb-2">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                                            </svg>
                                                                            <h4 className="text-md font-medium text-gray-700">Subcategories</h4>
                                                                        </div>
                                                                        <ul className="space-y-2">
                                                                            {category.subcategories.map((subcat: any) => (
                                                                                <li key={subcat.id} className="p-3 bg-gray-50 rounded-md border border-gray-100 hover:border-gray-200 transition-colors">
                                                                                    <div className="flex justify-between items-center">
                                                                                        <div className="flex items-center">
                                                                                            {subcat.courseCount > 0 && (
                                                                                                <button
                                                                                                    onClick={() => toggleSubcategoryCourses(subcat.id)}
                                                                                                    className="mr-2 text-gray-500 focus:outline-none hover:text-blue-500 transition-colors"
                                                                                                >
                                                                                                    {coursesForSubcategory[subcat.id] ? (
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                                                                        </svg>
                                                                                                    ) : (
                                                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                                                                                        </svg>
                                                                                                    )}
                                                                                                </button>
                                                                                            )}
                                                                                            <span className="font-medium text-gray-700">{subcat.name}</span>
                                                                                            {subcat.courseCount > 0 && (
                                                                                                <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                                                                                                    {subcat.courseCount} courses
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                        <button
                                                                                            onClick={() => handleDeleteCategory(subcat.id, false, subcat.courseCount)}
                                                                                            className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                                                            title="Delete subcategory"
                                                                                        >
                                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                            </svg>
                                                                                        </button>
                                                                                    </div>

                                                                                    {/* Display courses for this subcategory */}
                                                                                    {coursesForSubcategory[subcat.id] && (
                                                                                        <div className="mt-2 ml-6">
                                                                                            <div className="flex items-center mb-1">
                                                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                                                </svg>
                                                                                                <h5 className="text-sm font-medium text-gray-700">Courses</h5>
                                                                                            </div>
                                                                                            {coursesForSubcategory[subcat.id].length > 0 ? (
                                                                                                <ul className="space-y-1">
                                                                                                    {coursesForSubcategory[subcat.id].map(course => (
                                                                                                        <li
                                                                                                            key={course.id}
                                                                                                            className="p-2 bg-white rounded-md border border-gray-100 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-colors flex items-center"
                                                                                                            onClick={() => navigateToCourse(course.id)}
                                                                                                        >
                                                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                                                            </svg>
                                                                                                            {course.title}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            ) : (
                                                                                                <p className="text-sm text-gray-500 italic">No courses in this subcategory</p>
                                                                                            )}
                                                                                        </div>
                                                                                    )}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-gray-500 ml-6 italic text-sm">No subcategories</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-10">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                        <p className="text-gray-600">No categories found. Add your first category above.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {selectedTab === 'statistics' && (
                                    <CategoryStats stats={stats} />
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
                            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
                                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for filters sidebar */}
            {showFilters && (
                <div
                    className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
                    onClick={() => setShowFilters(false)}
                ></div>
            )}
        </div>
    );
};

export default CategoryManagement;
