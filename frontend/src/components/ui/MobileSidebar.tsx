import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MobileSidebar = ({
    categories,
    setIsMenuOpen
}: { categories: any[], setIsMenuOpen: (isMenuOpen: boolean) => void }) => {
    const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const fetchSubcategories = async (categoryName: string) => {
        setLoading(true);
        try {
            const decodedCategoryName = categoryName.toLowerCase();
            const res = await axios.get(`${backendUrl}api/v1/category/${decodedCategoryName}`);
            setSelectedCategory(res.data);
            //@ts-ignore
            setSubcategories(res.data.subcategories || []);
        } catch (error) {
            console.error("Failed to fetch subcategories", error);
        }
        setLoading(false);
    };

    const handleCategoryClick = (categoryName: string) => {
        fetchSubcategories(categoryName);
    };

    const handleBack = () => {
        setSelectedCategory(null);
        setSubcategories([]);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-black"
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Sidebar Panel with animation */}
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "-100%" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-80 max-w-[90%] h-full bg-white shadow-lg z-50 overflow-y-auto rounded-r-xl"
                >
                    {/* Header with Close/Back Buttons */}
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center p-4">
                            {selectedCategory ? (
                                <button
                                    onClick={handleBack}
                                    className="flex items-center text-gray-700 font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>
                            ) : (
                                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                            )}
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors"
                                aria-label="Close menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Category title when viewing subcategories */}
                        {selectedCategory && (
                            <div className="px-4 py-2 bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-900">{selectedCategory.name}</h2>
                                <p className="text-sm text-gray-500">Select a subcategory</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Content */}
                    <div className="p-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                <p className="mt-2 text-sm text-gray-600">Loading subcategories...</p>
                            </div>
                        ) : selectedCategory ? (
                            <div className="space-y-1 p-2">
                                {subcategories.length > 0 ? (
                                    subcategories.map((subcat: any) => (
                                        <motion.button
                                            key={subcat.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                const decodedSubcategoryName = subcat.name.toLowerCase().replace(/\s+/g, '-');
                                                navigate(`/category/${decodedSubcategoryName}`);
                                            }}
                                            className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center transition-colors"
                                        >
                                            <span className="flex-grow">{subcat.name}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </motion.button>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No subcategories available</p>
                                        <button
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                const decodedCategoryName = selectedCategory.name.toLowerCase().replace(/\s+/g, '-');
                                                navigate(`/category/${decodedCategoryName}`);
                                            }}
                                            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                        >
                                            View {selectedCategory.name} Category
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/purchases");
                                        }}
                                        className="w-full text-left py-3 px-4 text-gray-900 font-medium hover:bg-gray-100 rounded-lg flex items-center transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        My Purchases
                                    </button>

                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/teach-with-us");
                                        }}
                                        className="w-full text-left py-3 px-4 text-gray-900 font-medium hover:bg-gray-100 rounded-lg flex items-center transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Teach With Us
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            navigate("/about-us");
                                        }}
                                        className="w-full text-left py-3 px-4 text-gray-900 font-medium hover:bg-gray-100 rounded-lg flex items-center transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                        About Us
                                    </button>
                                </div>

                                <div className="mt-6 mb-2 px-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Explore Categories</h3>
                                </div>

                                <div className="p-2 space-y-1">
                                    {categories.map((category: any) => (
                                        <div
                                            key={category.id}
                                            className="rounded-lg border border-gray-200 overflow-hidden mb-2 hover:border-gray-300 transition-colors"
                                        >
                                            <button
                                                onClick={() => {
                                                    setIsMenuOpen(false);
                                                    const decodedCategoryName = category.name.toLowerCase().replace(/\s+/g, '-');
                                                    navigate(`/category/${decodedCategoryName}`);
                                                }}
                                                className="w-full text-left py-3 px-4 bg-white text-gray-800 font-medium flex items-center justify-between"
                                            >
                                                <span>{category.name}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => handleCategoryClick(category.name)}
                                                className="w-full text-left py-2 px-4 bg-gray-50 text-sm text-gray-600 flex items-center hover:bg-gray-100 transition-colors border-t border-gray-200"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                                View subcategories
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default MobileSidebar;