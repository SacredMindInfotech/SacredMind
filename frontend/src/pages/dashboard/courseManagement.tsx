import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import DataTable from 'react-data-table-component';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Course {
    id: number;
    title: string;
    description: string;
    isActive: boolean;
    isStarted: boolean;
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
    category: {
        name: string;
    };
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

// Add this interface for subcategories
interface Subcategory {
    id: number;
    name: string;
    parentId: number;
}

const columns = [
    {
        name: 'Title',
        selector: (row: any) => row.title,
        sortable: true,
    },
    {
        name: 'Description',
        selector: (row: any) => row.description,
        sortable: true,
        cell: (row: any) => (
            <div className="max-w-[200px] truncate">{row.description}</div>
        ),
    },
    {
        name: 'Price',
        selector: (row: any) => row.price,
        sortable: true,
        cell: (row: any) => `₹${row.price}`,
    },
    {
        name: 'Status',
        selector: (row: any) => row.published,
        sortable: true,
        cell: (row: any) => (
            <span className={`px-2 py-1 rounded-full text-xs ${row.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                {row.published ? 'Published' : 'Draft'}
            </span>
        ),
    },
    {
        name: 'Created At',
        selector: (row: any) => row.createdAt,
        sortable: true,
    },
    {
        name: 'Updated At',
        selector: (row: any) => row.updatedAt,
        sortable: true,
    },
];

const CourseManagement = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [data, setData] = useState<{
        id: number;
        imageUrl: string | null;
        createdAt: string;
        updatedAt: string;
        title: string;
        description: string;
        price: number;
        categoryId: number;
        published: boolean;
        category: {
            name: string;
        };
        language: string;
    }[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    const [progressPending, setProgressPending] = useState(true);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filteredData, setFilteredData] = useState<typeof data>([]);
    const [expandedRow, setExpandedRow] = useState<any>(null);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);


    // Filter state
    const [filters, setFilters] = useState({
        title: '',
        description: '',
        categoryName: '',
        categoryId: '',
        price: '',
        language: '',
        published: '' as '' | 'true' | 'false',
    });

    // Fetch subcategories from the backend
    const fetchSubcategories = async () => {
        try {
            const response = await axios.get(`${backendUrl}api/v1/category/onlySubcategories`);
            setSubcategories(response.data as Subcategory[]);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
        }
    };

    //fetch courses from the backend
    const fetchCourses = async () => {
        const response = await axios.get(`${backendUrl}api/v1/course/`);
        setCourses(response.data as Course[]);
        return response;
    };

    useEffect(() => {
        fetchCourses();
        fetchSubcategories();
    }, []);

    //set data for table
    useEffect(() => {
        if (courses.length > 0) {
            setData(courses.map((course) => ({
                ...course,
                createdAt: new Date(course.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }),
                updatedAt: new Date(course.updatedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }),
            })));
            setProgressPending(false);
        }
    }, [courses]);

    // Handle row expansion
    const handleRowExpanded = (expanded: boolean, row: any) => {
        if (expanded) {
            setExpandedRow(row);
        } else {
            setExpandedRow(null);
        }
    };

    //gives option for pagination to see all rows at once
    const paginationComponentOptions = {
        selectAllRowsItem: true,
        rowsPerPageText: 'Courses per page:',
        rangeSeparatorText: 'of',
        selectAllRowsItemText: 'All',
    };

    // Apply filters
    useEffect(() => {
        if (!data.length) return;

        const filtered = data.filter(course => {
            // Title filter
            if (filters.title && !course.title.toLowerCase().includes(filters.title.toLowerCase())) {
                return false;
            }

            // Description filter
            if (filters.description && !course.description.toLowerCase().includes(filters.description.toLowerCase())) {
                return false;
            }

            // Category name filter
            if (filters.categoryName && !course.category?.name.toLowerCase().includes(filters.categoryName.toLowerCase())) {
                return false;
            }

            // Category ID filter
            if (filters.categoryId && course.categoryId !== parseInt(filters.categoryId)) {
                return false;
            }

            // Price filter
            if (filters.price && !course.price.toString().includes(filters.price)) {
                return false;
            }

            // Language filter
            if (filters.language && !course.language?.toLowerCase().includes(filters.language.toLowerCase())) {
                return false;
            }

            // Published status filter
            if (filters.published) {
                const isPublished = filters.published === 'true';
                if (course.published !== isPublished) {
                    return false;
                }
            }

            return true;
        });

        setFilteredData(filtered);
    }, [data, filters]);

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            title: '',
            description: '',
            categoryName: '',
            categoryId: '',
            price: '',
            language: '',
            published: '',
        });
        setResetPaginationToggle(!resetPaginationToggle);
    };

    // Handle filter changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Filter button component for the subheader
    const subHeaderComponentMemo = useMemo(() => {
        return (
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
        );
    }, [showFilters]);

    // Set initial filtered data
    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    // Expandable row component for inline expansion
    const ExpandableRowComponent = ({ data }: any) => {
        const navigate = useNavigate();
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="p-8 space-y-6 bg-white shadow-xl rounded-xl mx-4 my-6 border border-gray-100"
            >
                <div className="mb-6">
                    <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 mb-2">
                        {data.category?.name}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-800">{data.title}</h1>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${data.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {data.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {data.language}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">
                            ₹{data.price}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                        whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                    >
                        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Description</h2>
                        <p className="text-sm text-gray-700">{data.description}</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                        transition={{ duration: 0.2 }}
                        className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                    >
                        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Dates</h2>
                        <div className="space-y-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Created</span>
                                <span className="text-sm font-medium text-gray-800">{data.createdAt}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Updated</span>
                                <span className="text-sm font-medium text-gray-800">{data.updatedAt}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {data.overview && data.overview.length > 0 && (
                        <motion.div
                            whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                        >
                            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Overview</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                {data.overview.map((item: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-700">{item}</li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {data.learningOutcomes && data.learningOutcomes.length > 0 && (
                        <motion.div
                            whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                        >
                            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Learning Outcomes</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                {data.learningOutcomes.map((item: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-700">{item}</li>
                                ))}
                            </ul>
                        </motion.div>
                    )}

                    {data.requirements && data.requirements.length > 0 && (
                        <motion.div
                            whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                        >
                            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Requirements</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                {data.requirements.map((item: string, index: number) => (
                                    <li key={index} className="text-sm text-gray-700">{item}</li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </div>

                <button
                    onClick={() => navigate(`/admin/course/${data.id}`)}
                    className="px-6 py-3 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                >
                    View Course
                </button>
            </motion.div>
        );
    };

    // Add useEffect for handling Escape key press
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setShowFilters(false);
            }
        };

        // Add event listener for keydown
        document.addEventListener('keydown', handleEscapeKey);

        // Clean up event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, []);

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Course Management</h1>
                                <p className="text-gray-600 mt-2">View and manage course listings</p>
                            </div>
                            <button
                                onClick={() => navigate('/admin/course/add')}
                                className="w-full md:w-40 px-3 py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                            >
                                Add New Course
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto bg-white min-h-[200px] rounded-lg shadow">
                            <DataTable
                                responsive
                                title="Courses"
                                columns={columns}
                                data={filteredData}
                                pagination
                                paginationComponentOptions={paginationComponentOptions}
                                fixedHeader
                                progressPending={progressPending}
                                progressComponent={<div className="flex justify-center items-center h-64">
                                    <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                                </div>}
                                paginationResetDefaultPage={resetPaginationToggle}
                                subHeader
                                subHeaderComponent={subHeaderComponentMemo}
                                highlightOnHover
                                pointerOnHover
                                expandableRows
                                expandableRowsComponent={ExpandableRowComponent}
                                expandableRowExpanded={row => expandedRow && expandedRow.id === row.id}
                                onRowExpandToggled={handleRowExpanded}
                                customStyles={
                                    {
                                        rows: {
                                            style: {
                                                backgroundColor: '#e5e7eb',
                                            }
                                        }
                                    }
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter sidebar */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Filter Courses</h2>
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
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={filters.title}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by title"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                id="description"
                                name="description"
                                value={filters.description}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by description"
                            />
                        </div>

                        <div>
                            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                id="categoryId"
                                name="categoryId"
                                value={filters.categoryId}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Categories</option>
                                {subcategories && subcategories.length > 0 ? (
                                    subcategories.map(category => (
                                        <option key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>Loading categories...</option>
                                )}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={filters.price}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by price"
                            />
                        </div>

                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                            <input
                                type="text"
                                id="language"
                                name="language"
                                value={filters.language}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by language"
                            />
                        </div>

                        <div>
                            <label htmlFor="published" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                id="published"
                                name="published"
                                value={filters.published}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="true">Published</option>
                                <option value="false">Draft</option>
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
                    className="fixed inset-0 bg-white/70 backdrop-blur-sm z-40"
                    onClick={() => setShowFilters(false)}
                    aria-hidden="true"
                ></div>
            )}
        </div>
    );
};

export default CourseManagement;
