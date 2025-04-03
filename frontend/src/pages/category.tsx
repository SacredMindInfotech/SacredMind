import { useState } from "react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CategoryPageShimmerEffect from "../components/ui/loaders/CategoryPageLoader";


interface Categories {
    id: number;
    name: string;
    parentId: number | null;
}

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
    category: {
        name: string;
    };
    overview: string[] | null;
    learningOutcomes: string[] | null;
    requirements: string[] | null;
    forwhom: string[] | null;
    language: string;
    courseNotice: string | null;
}
const Category = () => {
    const { categoryName } = useParams();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [category, setCategory] = useState<Categories | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [subcategories, setSubcategories] = useState<Categories[]>([]);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    //get category by name with its subcategories
    useEffect(() => {
        const fetchCategory = async () => {
            const res = await axios.get(`${backendUrl}api/v1/category/${categoryName}`);
            setCategory(res.data as Categories);
            //@ts-ignore
            if (res.data.subcategories.length > 0) {
                //@ts-ignore
                setSubcategories(res.data.subcategories);
                //@ts-ignore
                setSelectedSubcategoryId(res.data.subcategories[0].id);
            }
            else {
                setLoading(false);
            }
        }
        fetchCategory();
    }, [categoryName]);

    //render popular courses in the category also
   


    //fetch courses of the selected subcategory
    useEffect(() => {
        const fetchCourses = async () => {
            const res = await axios.get(`${backendUrl}api/v1/category/${selectedSubcategoryId}/courses`);
            //@ts-ignore
            setCourses(res.data);
            setLoading(false);
        }
        fetchCourses();
    }, [selectedSubcategoryId]);

    // Filter published courses
    let publishedCourses: Course[] = [];
    if (courses.length > 0) {
        publishedCourses = courses?.filter(course => course.published === true);
    }
    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-8 md:mb-16 min-h-[30vh] md:min-h-[30vh] flex flex-col justify-center items-center bg-gray-100 px-2 md:px-4">
                    {category && (
                        <>
                            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold mb-2 md:mb-4 montserrat-700">{category.name}</h1>
                            <p className="text-sm sm:text-lg md:text-xl text-gray-600">Explore our courses and start learning today</p>
                        </>
                    )}
                </div>

                {/* Subcategories Section */}
                {subcategories.length > 0 && (
                    <div className="flex flex-col gap-1 max-w-7xl mx-auto py-8">
                        <div className="text-xl font-semibold mb-2 montserrat-500">~Browse by Topic~</div>
                        <div className="flex gap-2 items-center flex-wrap">
                            {subcategories.map((subcategory, index) => (
                                <div key={index}>
                                    <button
                                        key={subcategory.id}
                                        className={`cursor-pointer px-3 sm:px-6 py-1 sm:py-2 rounded-md border text-xs sm:text-sm hover:shadow-[2px_2px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary ${selectedSubcategoryId === subcategory.id ? 'shadow-[2px_2px_0px_0px_rgba(0,0,0)] border-gray-900 bg-white text-black' : 'border-white bg-gray-900 text-white'
                                            }`}
                                        onClick={() => setSelectedSubcategoryId(subcategory.id)}
                                    >
                                        {subcategory.name}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Courses Grid Section */}
                {publishedCourses.length > 0 && (
                    <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-16">
                        <div className="text-xl sm:text-2xl font-semibold mb-4 montserrat-500">~Available Courses~</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                            {publishedCourses.map((course) => (

                                <div
                                    key={course.id}
                                    className="p-4 sm:p-6 rounded-md border border-white bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]  hover:border-white hover:bg-white transition duration-200 montserrat-secondary relative overflow-hidden"
                                    style={{
                                        backgroundImage: course.imageUrl ? `linear-gradient(rgba(17, 24, 39, 0.75), rgba(17, 24, 39, 0.5)), url(${course.imageUrl})` : 'none',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                    <h2 className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4 montserrat-500 relative z-10">
                                        {course.title}
                                    </h2>
                                    <p className="text-gray-300 mb-4 sm:mb-6 line-clamp-2 montserrat-400 text-sm sm:text-base relative z-10">
                                        {course.description}
                                    </p>
                                    <div className="flex justify-between items-center relative z-10">
                                        <button
                                            onClick={() => navigate(`/course/${course.id}`)}
                                            className="cursor-pointer px-4 sm:px-8 py-1.5 sm:py-2 rounded-md border border-white bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary"
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
                {loading ? (
                    <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center">
                        <CategoryPageShimmerEffect />
                    </div>
                ) : (
                    publishedCourses.length === 0 && (
                        <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center bg-gray-100">
                            <h2 className="text-2xl font-semibold mb-4 montserrat-500">No courses available yet</h2>
                            <p className="text-gray-600 montserrat-400">Check back soon for new courses in this category</p>
                        </div>
                    )
                )}

            </div>
        </div>
    )
}

export default Category;
