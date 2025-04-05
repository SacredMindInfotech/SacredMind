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
    discountedPrice?: number;
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


    useEffect(()=>{
        window.scrollTo({top: 0, behavior: 'smooth'});
    },[]);

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

   


    //fetch courses of the selected subcategory
    useEffect(() => {
        const fetchCourses = async () => {
            const res = await axios.get(`${backendUrl}api/v1/category/${selectedSubcategoryId}/courses`);
            const coursesData = res.data as Course[];
            
            // Fetch discount prices for each course
            const coursesWithDiscounts = await Promise.all(
                coursesData.map(async (course: Course) => {
                    try {
                        const discountRes = await axios.get(`${backendUrl}api/v1/course/${course.id}/discountAmount`);
                        return {
                            ...course,
                            //@ts-ignore
                            discountedPrice: discountRes.data as number
                        };
                    } catch (error) {
                        return course;
                    }
                })
            );
            setCourses(coursesWithDiscounts);
            setLoading(false);
        }
        if (selectedSubcategoryId) {
            fetchCourses();
        }
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                            {publishedCourses.map((course) => (
                                <div 
                                    key={course.id} 
                                    className="group bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                    onClick={() => navigate(`/course/${course.id}`)}
                                >
                                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                                        {course.imageUrl ? (
                                            <img 
                                                src={course.imageUrl} 
                                                alt={course.title} 
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/70 to-transparent"></div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-bold montserrat-700 line-clamp-4 group-hover:text-gray-900 transition-colors">{course.title}</h3>
                                            <div className="text-right ml-2">
                                                {course.discountedPrice && course.discountedPrice > 0 ? (
                                                    <>
                                                        <span className="text-lg line-through text-gray-500">₹{course.price}</span>
                                                        <span className="text-xl font-extrabold text-gray-900 ml-2">₹{course.discountedPrice}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-xl font-extrabold text-gray-900">₹{course.price}</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                {course.category.name}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/course/${course.id}`);
                                                }}
                                                className="px-4 py-2 rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                            >
                                                Explore
                                            </button>
                                        </div>
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
