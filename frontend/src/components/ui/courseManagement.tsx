import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';

interface Course {
    id: number;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    price: number;
    categoryId: number;
    published: boolean;
}

const columns = [
    {
        name: 'Title',
        selector: (row:any) => row.title,
        sortable: true,
    },
    {
        name: 'Description',
        selector: (row:any) => row.description,
        sortable: true,
        cell: (row:any) => (
            <div className="max-w-[200px] truncate">{row.description}</div>
        ),
    },
    {
        name: 'Price',
        selector: (row:any) => row.price,
        sortable: true,
        cell: (row:any) => `$${row.price}`,
    },
    {
        name: 'Status',
        selector: (row:any) => row.published,
        sortable: true,
        cell: (row:any) => (
            <span className={`px-2 py-1 rounded-full text-xs ${
                row.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
                {row.published ? 'Published' : 'Draft'}
            </span>
        ),
    },
];

const ExpandedComponent = ({ data }:any) => <pre>{JSON.stringify(data, null, 2)}</pre>;

const CourseManagement = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [data, setData] = useState<any[]>([]);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchCourses = async () => {
            const token = await getToken();
            const response = await axios.get(`${backendUrl}api/v1/course/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCourses(response.data as Course[]);
        };
        fetchCourses();
    }, [getToken]);

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
        }
    }, [courses]);

    return (
        <div className="p-4">
        
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <DataTable
                responsive
                    title="Courses"
                    columns={columns}
                    data={data}
                    selectableRows
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    pagination
                    expandOnRowClicked
                    expandableRowsHideExpander
                />
            </div>
        </div>
    );
};

export default CourseManagement;
