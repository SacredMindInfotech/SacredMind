import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import DataTable from 'react-data-table-component';
import styled from "styled-components";

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

interface SelectedRows {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: {
        id: number;
        title: string;
        description: string;
        price: number;
        published: boolean;
        imageUrl: string;
    }[];
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
        cell: (row: any) => `$${row.price}`,
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

const ExpandedComponent = ({ data }: any) => (
    <div className="p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Course Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <p className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">Title:</span>
                    <span className="text-gray-700">{data.title}</span>
                </p>

                <p className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">Description:</span>
                    <span className="text-gray-700">{data.description}</span>
                </p>

                <p className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">Price:</span>
                    <span className="text-gray-700">${data.price}</span>
                </p>

                <p className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.published ? 'bg-green-200 text-green-900' : 'bg-yellow-200 text-yellow-900'
                        }`}>
                        {data.published ? 'Published' : 'Draft'}
                    </span>
                </p>
            </div>

            <div className="space-y-6">
                <p className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">Category:</span>
                    <span className="text-gray-700">{data.category.name}</span>
                </p>

                <p className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">Created At:</span>
                    <span className="text-gray-700">{data.createdAt}</span>
                </p>

                <p className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">Updated At:</span>
                    <span className="text-gray-700">{data.updatedAt}</span>
                </p>

                <p className="flex items-center gap-3">
                    <span className="font-semibold text-gray-800">Image:</span>
                    <span className="text-gray-700">{data.imageUrl || 'No image available'}</span>
                </p>
            </div>
        </div>
        <div className="mt-8 text-center">
            <a
                href={`/admin/course/${data.id}`}
                className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-all duration-200"
            >
                View Details
            </a>
        </div>
    </div>
);


const CourseDeletingDialog = ({ isLoading, setIsDeleteDialogOpen, handleDeleteCourse, selectedRows }: { isLoading: boolean, setIsDeleteDialogOpen: (value: boolean) => void, handleDeleteCourse: () => Promise<void>, selectedRows: SelectedRows }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" >
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Are you sure you want to delete these courses?</h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="space-y-3">
                        {selectedRows?.selectedRows.map((course) => (
                            <div key={course.id} className="flex items-center gap-3 text-sm text-gray-700 p-2 rounded hover:bg-gray-100">
                                <span className="font-semibold">{course.title}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-gray-500 text-xs">ID: {course.id}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleDeleteCourse}
                        disabled={isLoading}
                        className={`bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        Delete
                    </button>
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={() => setIsDeleteDialogOpen(false)}
                        disabled={isLoading}
                        className={`bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};


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
    }[]>([]);
    const { getToken } = useAuth();
    const [selectedRows, setSelectedRows] = useState<SelectedRows>({
        allSelected: false,
        selectedCount: 0,
        selectedRows: []
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [progressPending, setProgressPending] = useState(true);
    //toggle clear selected rows set to true when the user clicks the change details button and request sent
    const [toggleClearSelectedRows, setToggleClearSelectedRows] = useState(false);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [filteredData, setFilteredData] = useState<typeof data>([]);
    const [isLoading, setIsLoading] = useState(false);

    //fetch courses from the backend
    const fetchCourses = async () => {
        const response = await axios.get(`${backendUrl}api/v1/course/`);
        setCourses(response.data as Course[]);
        return response;
    };
    useEffect(() => {
        fetchCourses();
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


    //handle row selected - setting the selected rows
    const handleRowSelected = (selectedRows: SelectedRows) => {
        setSelectedRows(selectedRows);
        setIsDeleteDialogOpen(false);
    };

    //context actions for the table
    //when rows are selected, what optoins should be shown
    const contextActions = useMemo(() => (

        <div className="flex gap-2">
            <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Selected
            </button>


        </div>
    ), [selectedRows]);

    //handle delete course - can delete multiple courses at once
    const handleDeleteCourse = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            const updatePromises = selectedRows?.selectedRows.map(course =>
                axios.delete(`${backendUrl}api/v1/admin/courses/${course.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            );

            if (updatePromises) {
                await Promise.all(updatePromises);
                const response = await fetchCourses();
                setCourses(response.data as Course[]);
                setToggleClearSelectedRows(true);
                setIsDeleteDialogOpen(false);
                setIsLoading(false);
            }

        } catch (error) {
            console.error('Failed to delete courses:', error);
            // Add error handling here
        }
    }


    //gives option for pagination to see all rows at once
    const paginationComponentOptions = {
        selectAllRowsItem: true,
    };


    //used by filter bar component
    const FilterComponent = ({ filterText, onFilter, onClear }: { filterText: string, onFilter: (e: any) => void, onClear: () => void }) => (
        <div className="flex gap-2">
            <TextField
                id="search"
                type="text"
                placeholder="Search by a keyword"
                aria-label="Search Input"
                value={filterText}
                onChange={onFilter}
                autoFocus
            />

            <button
                type="button"
                className="px-4 border border-l-0 border-gray-200 hover:bg-gray-100"
                onClick={onClear}
            >
                clear
            </button>
        </div>
    );

    //text field for filter
    const TextField = styled.input`
	height: 32px;
	width: 200px;
	border-radius: 3px;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border: 1px solid #e5e5e5;
	padding: 0 32px 0 16px;
	&:hover {
		cursor: pointer;
	}`;

    //filter bar component provider
    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <div className="mb-4">
                <FilterComponent
                    onFilter={e => setFilterText(e.target.value)}
                    onClear={handleClear}
                    filterText={filterText}
                />
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    //filter data based on search text
    useEffect(() => {
        const filtered = data.filter(item => {
            const searchText = filterText.toLowerCase();
            return (
                item.title?.toLowerCase().includes(searchText) ||
                item.description?.toLowerCase().includes(searchText) ||
                item.price?.toString().includes(searchText) ||
                item.published?.toString().includes(searchText)
            );
        });
        setFilteredData(filtered);
    }, [filterText, data]);

    return (
        <div className="  p-4">

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <DataTable
                    
                    responsive
                    title="Courses"
                    columns={columns}
                    data={filteredData}
                    selectableRows
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    pagination
                    expandOnRowClicked
                    expandableRowsHideExpander
                    //@ts-ignore
                    onSelectedRowsChange={handleRowSelected}
                    contextActions={contextActions}
                    clearSelectedRows={toggleClearSelectedRows}
                    paginationComponentOptions={paginationComponentOptions}
                    fixedHeader
                    progressPending={progressPending}
                    progressComponent={<div className="flex justify-center items-center h-full">
                        <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                    </div>}
                    paginationResetDefaultPage={resetPaginationToggle}
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                />
            </div>

            {/* Delete Dialog */}
            {isDeleteDialogOpen && (
                <CourseDeletingDialog isLoading={isLoading} setIsDeleteDialogOpen={setIsDeleteDialogOpen} handleDeleteCourse={handleDeleteCourse} selectedRows={selectedRows} />
            )}
        </div>
    );
};

export default CourseManagement;
