import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CategoryPageShimmerEffect from "../components/ui/loaders/CategoryPageLoader";


interface Categories {
    id: number;
    name: string;
    parentId: number | null;
    description: string | null;
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
    const [categoryDescription, setCategoryDescription] = useState<string | null>(null);
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    //@ts-ignore
    const [category, setCategory] = useState<Categories | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [subcategories, setSubcategories] = useState<Categories[]>([]);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [allCategoryCourses, setAllCategoryCourses] = useState<Course[]>([]);


    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    //get category by name with its subcategories
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await axios.get(`${backendUrl}api/v1/category/${categoryName}`);
                setCategory(res.data as Categories);
                //@ts-ignore
                if (res.data.subcategories.length > 0) {
                    //@ts-ignore
                    setSubcategories(res.data.subcategories);
                    //@ts-ignore
                    setSelectedSubcategoryId(res.data.subcategories[0].id);
                    //@ts-ignore
                    setCategoryDescription(res.data.description);
                }
                else {
                    //@ts-ignore
                    setSelectedSubcategoryId(res.data.id);
                    //@ts-ignore
                    setCategoryDescription(res.data.description);
                }
            } catch (error) {
                console.log(error);
                navigate("/");
            }
        }
        fetchCategory();
        setLoading(false);
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

    //fetching all courses
    useEffect(() => {
        const fetchAllCourses = async () => {
            if (subcategories.length > 0) {
                try {
                    // Fetch courses from all subcategories
                    const allCoursesPromises = subcategories.map(subcategory =>
                        axios.get(`${backendUrl}api/v1/category/${subcategory.id}/courses`)
                    );

                    const responses = await Promise.all(allCoursesPromises);
                    const allCourses = responses.flatMap(res => res.data as Course[]);

                    // Fetch discount prices for all courses
                    const coursesWithDiscounts = await Promise.all(
                        allCourses.map(async (course: Course) => {
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

                    // Filter published courses and remove duplicates by course ID
                    const uniqueCourses = coursesWithDiscounts.filter(course => course.published === true)
                    setAllCategoryCourses(uniqueCourses);
                } catch (error) {
                    console.error("Error fetching all courses:", error);
                }
            }
        };

        fetchAllCourses();
    }, [subcategories]);

    // Filter published courses
    let publishedCourses: Course[] = [];
    if (courses.length > 0) {
        publishedCourses = courses?.filter(course => course.published === true);
    }
    return (
        <div>

            {subcategories.length > 0 && (
                <div className="hidden lg:block">
                    <div className="border-b flex montserrat-500 shadow-md border-gray-200">
                        <p className="px-4  flex gap-2 py-3 font-semibold transition-colors duration-200 mr-1 mb-1 text-gray-900">
                            {categoryName}
                            <span className="text-gray-500">|</span>
                        </p>
                        <div className="flex overflow-x-auto whitespace-nowrap hide-scrollbar">
                            {subcategories.map((subcategory) => (
                                <button
                                    key={subcategory.id}
                                    className={`px-4 py-3 cursor-pointer text-sm font-medium transition-colors duration-200 mr-1 mb-1 ${selectedSubcategoryId === subcategory.id
                                        ? 'text-violet-700'
                                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                                        }`}
                                    onClick={() => setSelectedSubcategoryId(subcategory.id)}
                                >
                                    {subcategory.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            <div className="max-w-7xl mx-auto px-4 py-16">


                {categoryDescription && subcategories.length === 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-semibold montserrat-700">
                            {categoryName}
                        </h2>
                        <p className="text-gray-600 text-sm montserrat-400">
                            {categoryDescription}
                        </p>
                    </div>
                )}

                <div className="mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold montserrat-700">
                        {subcategories.length > 0 ? (
                            subcategories.find(s => s.id === selectedSubcategoryId)?.name + " Courses"
                        ) : (
                            categoryName + " Courses"
                        )}
                    </h2>
                    <p className="text-gray-600 montserrat-400">
                        {subcategories.find(s => s.id === selectedSubcategoryId)?.description}
                    </p>
                </div>

                {publishedCourses.length > 0 && (
                    <div className="flex flex-wrap gap-6">
                        {publishedCourses.map((course) => (
                            <div
                                key={course.id}
                                className="group max-w-72 bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                onClick={() => navigate(`/course/${course.id}`)}
                            >
                                <div className="h-38 bg-gray-200 relative overflow-hidden">
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
                                        <h3 className="text-sm font-bold montserrat-700 line-clamp-4 group-hover:text-gray-900 transition-colors">{course.title}</h3>
                                        <div className="text-right ml-2">
                                            {course.discountedPrice && course.discountedPrice > 0 ? (
                                                <>
                                                    <span className="text-sm line-through text-gray-500">₹{course.price}</span>
                                                    <span className="text-sm font-extrabold text-gray-900 ml-2">₹{course.discountedPrice}</span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-gray-900">₹{course.price}</span>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                            {course.category.name}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/course/${course.id}`);
                                            }}
                                            className="px-2 py-1 text-sm rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                        >
                                            Explore
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center">
                        <CategoryPageShimmerEffect />
                    </div>
                ) : (
                    publishedCourses.length === 0 && (
                        <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center bg-gray-100 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4 montserrat-500">No courses available yet</h2>
                            <p className="text-gray-600 montserrat-400">Check back soon for new courses in this category</p>
                        </div>
                    )
                )}

                {allCategoryCourses.length > 0 && (
                    <div className="mt-16">
                        <div className="mb-8 border-t pt-8">
                            <h2 className="text-xl sm:text-2xl font-semibold montserrat-700">
                                All {categoryName} Courses
                            </h2>
                            <p className="text-gray-600 montserrat-400 mt-2">
                                Browse all courses across different {categoryName} categories
                            </p>
                        </div>

                        {/* Group courses by subcategory */}
                        {subcategories.map(subcategory => {
                            if (subcategory.id === selectedSubcategoryId) return null;
                            const subcategoryCourses = allCategoryCourses.filter(
                                course => course.category.name === subcategory.name
                            );

                            if (subcategoryCourses.length === 0) return null;

                            return (
                                <div key={subcategory.id} className="mb-10">
                                    <h3 className="text-lg font-semibold montserrat-600 mb-4 text-gray-800 border-l-4 border-violet-600 pl-3">
                                        {subcategory.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-6">
                                        {subcategoryCourses.map((course) => (
                                            <div
                                                key={course.id}
                                                className="group max-w-72 bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                                onClick={() => navigate(`/course/${course.id}`)}
                                            >
                                                <div className="h-38 bg-gray-200 relative overflow-hidden">
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
                                                        <h3 className="text-sm font-bold montserrat-700 line-clamp-4 group-hover:text-gray-900 transition-colors">{course.title}</h3>
                                                        <div className="text-right ml-2">
                                                            {course.discountedPrice && course.discountedPrice > 0 ? (
                                                                <>
                                                                    <span className="text-sm line-through text-gray-500">₹{course.price}</span>
                                                                    <span className="text-sm font-extrabold text-gray-900 ml-2">₹{course.discountedPrice}</span>
                                                                </>
                                                            ) : (
                                                                <span className="font-bold text-gray-900">₹{course.price}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm font-medium px-2 py-1 bg-gray-100 rounded-md text-gray-700">
                                                            {course.category.name}
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/course/${course.id}`);
                                                            }}
                                                            className="px-2 py-1 text-sm rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                                        >
                                                            Explore
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Category;
