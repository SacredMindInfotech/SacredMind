import { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


interface Categories {
    id: number;
    name: string;
    parentId: number | null;
}

interface Courses {
    category: Categories;
    categoryId: number;
    description: string;
    id: number;
    imageUrl: string | null;
    price: number;
    title: string;
    updatedAt: string;
}
const Category = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [category, setCategory] = useState<Categories | null>(null);
    const [courses, setCourses] = useState<Courses[]>([]);
    const [subcategories, setSubcategories] = useState<Categories[]>([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    //fetch category with its subcategories
    useEffect(() => {
        const fetchCategory = async () => {
            const res = await axios.get(`${backendUrl}api/v1/category/${id}`);
            setCategory(res.data as Categories);
            //@ts-ignore
            if(res.data.subcategories.length > 0){
                //@ts-ignore
                setSubcategories(res.data.subcategories);   
                //@ts-ignore
                setSelectedSubcategory(res.data.subcategories[0].id);
            }
            else{
                setLoading(false);
            }
        }
        fetchCategory();
    }, [id]);

    //use to list popular courses in the category
    // useEffect(() => {
    //    we have to fetch courses of the category whose parentId is the id in the url
    // }, [id]);


    //fetch courses of the selected subcategory
    useEffect(() => {
        const fetchCourses = async () => {
            const res = await axios.get(`${backendUrl}api/v1/category/${selectedSubcategory}/courses`);
            //@ts-ignore
            setCourses(res.data);  
            setLoading(false);
        }                
        fetchCourses();
    }, [selectedSubcategory]);

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16 min-h-[50vh] flex flex-col justify-center items-center bg-gray-100">
                    {category && (
                        <>
                            <h1 className="text-6xl font-bold mb-4 montserrat-700">{category.name}</h1>
                            <p className="text-xl text-gray-600">Explore our courses and start learning today</p>
                        </>
                    )}
                </div>

                {/* Subcategories Section */}
                {subcategories.length > 0 && (
                    <div className="flex flex-col gap-4 max-w-7xl mx-auto px-4 py-8">
                        <div className="text-xl font-semibold mb-2 montserrat-500">~Browse by Topic~</div>
                        <div className="flex gap-2 items-center flex-wrap">
                            {subcategories.map((subcategory, index) => (
                                <div key={index}>
                                    <button
                                        key={subcategory.id}
                                        className={` cursor-pointer px-6 py-2 rounded-md border text-sm hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary ${selectedSubcategory === subcategory.id ? 'shadow-[2px_2px_0px_0px_rgba(0,0,0)] border-gray-900 bg-white text-black' : 'border-white bg-gray-900 text-white'
                                            }`}
                                        onClick={() => setSelectedSubcategory(subcategory.id)}
                                    >
                                        {subcategory.name}
                                    </button>

                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Courses Grid Section */}
                {courses.length > 0 && (
                    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-16">
                        <div className="text-2xl font-semibold mb-4 montserrat-500">~Available Courses~</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map((course) => (
                                <div key={course.id} className=" p-6 rounded-md border border-white bg-gray-900 text-white text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary">
                                    <h2 className="text-2xl font-semibold mb-4 montserrat-500">
                                        {course.title}
                                    </h2>
                                    <p className="text-gray-600 mb-6 line-clamp-2 montserrat-400">
                                        {course.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        {/* <span className="text-xl font-bold text-blue-600 montserrat-700">
                                            ${course.price}
                                        </span> */}
                                        <button
                                            onClick={() => navigate(`/course/${course.title}`)}
                                            className=" cursor-pointer px-8 py-2 rounded-md border border-white bg-gray-900 text-white text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary"
                                        >
                                            View Course
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                { loading ? (
                    <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center bg-gray-100">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center bg-gray-100">
                        <h2 className="text-2xl font-semibold mb-4 montserrat-500">No courses available yet</h2>
                        <p className="text-gray-600 montserrat-400">Check back soon for new courses in this category</p>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Category;
