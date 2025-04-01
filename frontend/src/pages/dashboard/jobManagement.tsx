import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import DataTable from 'react-data-table-component';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Job {
    id: number;
    title: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    skills: string[];
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    location: "REMOTE" | "HYBRID" | "ON_SITE";
    salary: string | null;
    type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
    experience: string;
    education: string;
    jobCategoryId: number;
    jobCategory: {
        id: number;
        name: string;
    };
}

const columns = [
    {
        name: 'Title',
        selector: (row: Job) => row.title,
        sortable: true,
    },
    {
        name: 'Category',
        selector: (row: Job) => row.jobCategory.name,
        sortable: true,
    },
    {
        name: 'Type',
        selector: (row: Job) => row.type,
        sortable: true,
        cell: (row: Job) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.type === 'FULL_TIME' ? 'bg-blue-100 text-blue-800' :
                    row.type === 'PART_TIME' ? 'bg-green-100 text-green-800' :
                        row.type === 'CONTRACT' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                }`}>
                {row.type.replace('_', ' ')}
            </span>
        ),
    },
    {
        name: 'Location',
        selector: (row: Job) => row.location,
        sortable: true,
        cell: (row: Job) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.location === 'REMOTE' ? 'bg-green-100 text-green-800' :
                    row.location === 'HYBRID' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                }`}>
                {row.location.replace('_', ' ')}
            </span>
        ),
    },
    {
        name: 'Experience',
        selector: (row: Job) => row.experience,
        sortable: true,
    },
    {
        name: 'Status',
        selector: (row: Job) => row.published,
        sortable: true,
        cell: (row: Job) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                {row.published ? 'Published' : 'Draft'}
            </span>
        ),
    },
];

// Expanded job details component
const ExpandedComponent = ({ data }: { data: Job }) => {
    const router=useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="p-8 space-y-6 bg-white shadow-xl rounded-xl mx-4 my-6 border border-gray-100"
        >
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{data.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${data.type === 'FULL_TIME' ? 'bg-blue-100 text-blue-800' :
                            data.type === 'PART_TIME' ? 'bg-green-100 text-green-800' :
                                data.type === 'CONTRACT' ? 'bg-purple-100 text-purple-800' :
                                    'bg-yellow-100 text-yellow-800'
                        }`}>
                        {data.type.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${data.location === 'REMOTE' ? 'bg-green-100 text-green-800' :
                            data.location === 'HYBRID' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                        }`}>
                        {data.location.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {data.experience}
                    </span>
                    {data.salary && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">
                            {data.salary}
                        </span>
                    )}
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
                    <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Education</h2>
                    <p className="text-sm text-gray-700">{data.education}</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                >
                    <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Responsibilities</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.responsibilities.map((item, index) => (
                            <li key={index} className="text-sm text-gray-700">{item}</li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                >
                    <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Requirements</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        {data.requirements.map((item, index) => (
                            <li key={index} className="text-sm text-gray-700">{item}</li>
                        ))}
                    </ul>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
                >
                    <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
            <button onClick={() => router(`/admin/jobs/${data.id}`)} className="px-6 py-3 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap">View Job</button>
        </motion.div>
    );
}

const JobManagement = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    // const [expandedRow, setExpandedRow] = useState<Job | null>(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const { getToken } = useAuth();
    const [showFilters, setShowFilters] = useState(false);
    const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    // Filter state
    const [filters, setFilters] = useState({
        title: '',
        categoryName: '',
        type: '' as '' | 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP',
        location: '' as '' | 'REMOTE' | 'HYBRID' | 'ON_SITE',
        experience: '',
        education: '',
        published: '' as '' | 'true' | 'false',
        salary: '',
        skills: '',
    });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`${backendUrl}api/v1/job/alljobs`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                //@ts-ignore
                setJobs(response.data);
                //@ts-ignore
                setFilteredJobs(response.data);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [getToken, backendUrl]);

    // Apply filters
    useEffect(() => {
        if (!jobs.length) return;

        const filtered = jobs.filter(job => {
            // Title filter
            if (filters.title && !job.title.toLowerCase().includes(filters.title.toLowerCase())) {
                return false;
            }

            // Category name filter
            if (filters.categoryName && !job.jobCategory.name.toLowerCase().includes(filters.categoryName.toLowerCase())) {
                return false;
            }

            // Job type filter
            if (filters.type && job.type !== filters.type) {
                return false;
            }

            // Location filter
            if (filters.location && job.location !== filters.location) {
                return false;
            }

            // Experience filter
            if (filters.experience && !job.experience.toLowerCase().includes(filters.experience.toLowerCase())) {
                return false;
            }

            // Education filter
            if (filters.education && !job.education.toLowerCase().includes(filters.education.toLowerCase())) {
                return false;
            }

            // Published status filter
            if (filters.published) {
                const isPublished = filters.published === 'true';
                if (job.published !== isPublished) {
                    return false;
                }
            }

            // Salary filter
            if (filters.salary && job.salary && !job.salary.includes(filters.salary)) {
                return false;
            }

            // Skills filter (checks if any skill contains the filter text)
            if (filters.skills) {
                const skillFilter = filters.skills.toLowerCase();
                const hasMatchingSkill = job.skills.some(skill =>
                    skill.toLowerCase().includes(skillFilter)
                );
                if (!hasMatchingSkill) {
                    return false;
                }
            }

            return true;
        });

        setFilteredJobs(filtered);
    }, [jobs, filters]);

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            title: '',
            categoryName: '',
            type: '',
            location: '',
            experience: '',
            education: '',
            published: '',
            salary: '',
            skills: '',
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

    const paginationComponentOptions = {
        rowsPerPageText: 'Jobs per page:',
        rangeSeparatorText: 'of',
        selectAllRowsItem: true,
        selectAllRowsItemText: 'All',
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Job Management</h1>
                        <p className="text-gray-600 mt-2">View and manage job listings</p>
                    </div>

                    <div className="p-6">
                        <div className="overflow-x-auto bg-white min-h-[200px] rounded-lg shadow">
                            <DataTable
                                title="Jobs"
                                columns={columns}
                                data={filteredJobs}
                                pagination
                                paginationComponentOptions={paginationComponentOptions}
                                paginationResetDefaultPage={resetPaginationToggle}
                                progressPending={loading}
                                progressComponent={
                                    <div className="flex justify-center items-center h-64">
                                        <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                                    </div>
                                }
                                expandableRows
                                expandableRowsComponent={ExpandedComponent}
                                subHeader
                                subHeaderComponent={subHeaderComponentMemo}
                                highlightOnHover
                                pointerOnHover
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter sidebar */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Filter Jobs</h2>
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
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
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
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input
                                type="text"
                                id="categoryName"
                                name="categoryName"
                                value={filters.categoryName}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by category"
                            />
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                            <select
                                id="type"
                                name="type"
                                value={filters.type}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Types</option>
                                <option value="FULL_TIME">Full Time</option>
                                <option value="PART_TIME">Part Time</option>
                                <option value="CONTRACT">Contract</option>
                                <option value="INTERNSHIP">Internship</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <select
                                id="location"
                                name="location"
                                value={filters.location}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Locations</option>
                                <option value="REMOTE">Remote</option>
                                <option value="HYBRID">Hybrid</option>
                                <option value="ON_SITE">On Site</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                            <input
                                type="text"
                                id="experience"
                                name="experience"
                                value={filters.experience}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by experience"
                            />
                        </div>

                        <div>
                            <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                            <input
                                type="text"
                                id="education"
                                name="education"
                                value={filters.education}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by education"
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

                        <div>
                            <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                            <input
                                type="text"
                                id="salary"
                                name="salary"
                                value={filters.salary}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by salary"
                            />
                        </div>

                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                            <input
                                type="text"
                                id="skills"
                                name="skills"
                                value={filters.skills}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by skills"
                            />
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

            {/* Overlay when expanded component is shown */}
            {/* {expandedRow && (
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => setExpandedRow(null)}
                ></div>
            )} */}

            {/* Expanded job details sidebar */}
            {/* {expandedRow && (
                <div className="fixed top-4 bottom-4 right-0 h-[90%] w-full md:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform translate-x-0 rounded-lg mr-4">
                    <div className="p-4 sticky top-0 bg-white z-10 flex justify-between items-center rounded-lg">
                        <h2 className="text-xl font-bold">Job Details</h2>
                        <button
                            onClick={() => setExpandedRow(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <ExpandedComponent data={expandedRow} />
                </div>
            )} */}
        </div>
    );
};

export default JobManagement;