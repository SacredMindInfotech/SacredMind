import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CategoryPageShimmerEffect from "../components/ui/loaders/CategoryPageLoader";

interface Categories {
    id: number;
    name: string;
    parentId: number | null;
    description: string | null;
    subcategories: Categories[] | null;
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
    const [courses, setCourses] = useState<Course[]>([]);
    const [subcategories, setSubcategories] = useState<Categories[]>([]);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [allCategoryCourses, setAllCategoryCourses] = useState<Course[]>([]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const decodedCategoryName = categoryName?.replace(/-/g, ' ');

    useEffect(() => {
        const fetchCategoryAndCourses = async () => {
            setLoading(true);
            try {
                //fetch the category with its subcategories
                const categoryRes = await axios.get(`${backendUrl}api/v1/category/${decodedCategoryName}`);
                const categoryData = categoryRes.data as Categories;
                setCategoryDescription(categoryData.description);

                let subCats: Categories[] = [];
                if (categoryData.subcategories && categoryData.subcategories.length > 0) {
                    subCats = categoryData.subcategories;
                    setSubcategories(subCats);
                    setSelectedSubcategoryId(subCats[0].id);
                } else {
                    setSelectedSubcategoryId(categoryData.id);
                }

                // fetch all courses for ALL subcategories in a single call - sending the string of category ids by comma separated
                const subcategoryIds = subCats.length > 0
                    ? subCats.map(sub => sub.id).join(',')
                    : categoryData.id;

                const allCoursesRes = await axios.get(`${backendUrl}api/v1/course/byCategories?categoryIds=${subcategoryIds}&published=true`);
                const allCoursesData = allCoursesRes.data as Course[];

                // get discount prices in a single call for all courses - sending the string of course ids by comma separated
                if (allCoursesData.length > 0) {
                    const courseIds = allCoursesData.map(course => course.id).join(',');
                    const discountsRes = await axios.get(`${backendUrl}api/v1/course/batchDiscounts?courseIds=${courseIds}`);
                    const discountsData = discountsRes.data;

                    // Apply discounts to courses
                    const coursesWithDiscounts = allCoursesData.map(course => ({
                        ...course,
                //@ts-ignore
                        discountedPrice: discountsData[course.id] || 0
                    }));

                    // filter by published
                    const publishedCourses = coursesWithDiscounts.filter(course => course.published);

                    setAllCategoryCourses(publishedCourses);

                    if (selectedSubcategoryId) {
                        const filteredCourses = publishedCourses.filter(
                            course => course.categoryId === selectedSubcategoryId
                        );
                        setCourses(filteredCourses);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching category data:", error);
                setLoading(false);
                // navigate("/");
            }
        };

        fetchCategoryAndCourses();
    }, [categoryName]);

    //  when switching between subcategories
    // No database call - filter the already fetched courses
    useEffect(() => {
        if (selectedSubcategoryId && allCategoryCourses.length > 0) {
            const filteredCourses = allCategoryCourses.filter(
                course => course.categoryId === selectedSubcategoryId
            );
            setCourses(filteredCourses);
        }
    }, [selectedSubcategoryId, allCategoryCourses]);

    // Get published courses for the selected subcategory
    const publishedCourses = courses.filter(course => course.published);

    // Group allCategoryCourses by subcategory for display
    const coursesBySubcategory = subcategories.reduce((acc, subcategory) => {
        // Don't include courses from currently selected subcategory (they're shown above)
        if (subcategory.id === selectedSubcategoryId) return acc;

        const subcategoryCourses = allCategoryCourses.filter(
            course => course.categoryId === subcategory.id
        );

        if (subcategoryCourses.length > 0) {
            acc[subcategory.id] = {
                subcategory,
                courses: subcategoryCourses
            };
        }
        return acc;
    }, {} as Record<number, { subcategory: Categories, courses: Course[] }>);

    const upperCaseCategoryName = categoryName?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <div>
            {subcategories.length > 0 && (
                <div className="hidden lg:block">
                    <div className="border-b flex montserrat-500 shadow-md border-gray-200">
                        <p className="px-4 flex gap-2 py-3 font-semibold transition-colors duration-200 mr-1 mb-1 text-gray-900">
                            {upperCaseCategoryName}
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
                {/* if there is no subcategories - means its a sub-cat page , show the (sub)category description */}
                {categoryDescription && subcategories.length === 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-semibold montserrat-700">
                            {upperCaseCategoryName}
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
                            upperCaseCategoryName + " Courses"
                        )}
                    </h2>
                    <p className="text-gray-600 text-sm montserrat-400">
                        {subcategories.find(s => s.id === selectedSubcategoryId)?.description}
                    </p>
                </div>

                {loading ? (
                    <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center">
                        <CategoryPageShimmerEffect />
                    </div>
                ) : publishedCourses.length > 0 ? (
                    <div className="flex flex-wrap gap-6">
                        {publishedCourses.map((course) => (
                            <div
                                key={course.id}
                                className="group max-w-72 bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                onClick={() => {
                                    const firstTwoWords = course.title.toLowerCase().split(' ').slice(0, 3).join(' ');
                                    const encodedTitle = firstTwoWords
                                        .replace(/-/g, "_") // Temporarily replace existing hyphens
                                        .replace(/\s+/g, '-');         // Replace spaces with hyphens
                                    navigate(`/course/${encodedTitle}`);
                                }
                                }
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
                                            {course.category?.name}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const firstTwoWords = course.title.toLowerCase().split(' ').slice(0, 3).join(' ');
                                                const encodedTitle = firstTwoWords
                                                    .replace(/-/g, "_") // Temporarily replace existing hyphens
                                                    .replace(/\s+/g, '-');         // Replace spaces with hyphens
                                                navigate(`/course/${encodedTitle}`);
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
                ) : (
                        <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center bg-gray-100 rounded-lg">
                            <h2 className="text-2xl font-semibold mb-4 montserrat-500">No courses available yet</h2>
                            <p className="text-gray-600 montserrat-400">Check back soon for new courses in this category</p>
                    </div>
                )}

                {Object.keys(coursesBySubcategory).length > 0 && (
                    <div className="mt-16">
                        <div className="mb-8 border-t pt-8">
                            <h2 className="text-xl sm:text-2xl font-semibold montserrat-700">
                                All {upperCaseCategoryName} Courses
                            </h2>
                            <p className="text-gray-600 montserrat-400 mt-2">
                                Browse all courses across different {upperCaseCategoryName} categories
                            </p>
                        </div>

                        {/* Render courses by subcategory using  pre-computed dictionary */}
                        {Object.values(coursesBySubcategory).map(({ subcategory, courses }) => (
                            <div key={subcategory.id} className="mb-10">
                                <h3 className="text-lg font-semibold montserrat-600 mb-4 text-gray-800 border-l-4 border-violet-600 pl-3">
                                    {subcategory.name}
                                </h3>
                                <div className="flex flex-wrap gap-6">
                                    {courses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="group max-w-72 bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                                            onClick={() => {
                                                const firstTwoWords = course.title.toLowerCase().split(' ').slice(0, 3).join(' ');
                                                const encodedTitle = firstTwoWords
                                                    .replace(/-/g, "_") // Temporarily replace existing hyphens
                                                    .replace(/\s+/g, '-');         // Replace spaces with hyphens
                                                navigate(`/course/${encodedTitle}`);
                                            }}
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
                                                        {course.category?.name}
                                                    </span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const firstTwoWords = course.title.toLowerCase().split(' ').slice(0, 3).join(' ');
                                                            const encodedTitle = firstTwoWords
                                                                .replace(/-/g, "_") // Temporarily replace existing hyphens
                                                                .replace(/\s+/g, '-');         // Replace spaces with hyphens
                                                            navigate(`/course/${encodedTitle}`);
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Category;
