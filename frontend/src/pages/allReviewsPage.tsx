import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { reviews } from "./reviews";
import { useNavigate } from "react-router-dom";
interface Review {
    name: string;
    designation: string;
    rating: number;
    review: string;
}

const AllReviewsPage = () => {
    const [allReviews] = useState<Review[]>(reviews);
    const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const reviewsPerPage = 9;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    useEffect(() => {
        let result = allReviews;
        
        // Apply rating filter
        if (filter !== "all") {
            result = result.filter(review => review.rating === parseInt(filter));
        }
        
        setFilteredReviews(result);
        setCurrentPage(1);
    }, [filter, allReviews]);

    // Pagination
    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
    const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

    const renderStars = (rating: number) => {
        return Array(5).fill(0).map((_, i) => (
            <svg 
                key={i} 
                className={`w-5 h-5 ${i < rating ? "text-yellow-500" : "text-gray-300"}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill="currentColor"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <div className="w-full bg-white">
            {/* Hero Section with animated elements */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full bg-gradient-to-r from-purple-50 to-gray-100"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-24">
                    <div className="text-center mb-8 sm:mb-16 p-4 sm:p-10 flex flex-col justify-center items-center">
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 montserrat-700 leading-tight"
                        >
                            Student Reviews
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-base sm:text-lg md:text-xl text-gray-600 montserrat-500 max-w-2xl"
                        >
                            What our students say about their learning journey
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex justify-center items-center gap-4 mb-8"
                >
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button 
                            onClick={() => setFilter("all")} 
                            className={`px-4 py-2 rounded-full text-sm font-medium ${
                                filter === "all" 
                                    ? "bg-gray-900 text-white" 
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } transition-colors`}
                        >
                            All Reviews
                        </button>
                        {[5, 4, 3, 2, 1].map(rating => (
                            <button 
                                key={rating}
                                onClick={() => setFilter(rating.toString())} 
                                className={`px-4 py-2 rounded-full text-sm font-medium ${
                                    filter === rating.toString() 
                                        ? "bg-gray-900 text-white" 
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                } transition-colors flex items-center`}
                            >
                                {rating} {rating === 1 ? "Star" : "Stars"}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Stats Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-full bg-gradient-to-r from-purple-100 via-gray-100 to-gray-200 py-10 sm:py-16 mb-8"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-around gap-8 md:gap-10">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <span className="block text-2xl sm:text-3xl md:text-4xl font-bold montserrat-700 mb-1">
                                151
                            </span>
                            <span className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Total Reviews
                            </span>
                        </motion.div>
                        
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <span className="block text-2xl sm:text-3xl md:text-4xl font-bold montserrat-700 mb-1">
                                4.8
                            </span>
                            <span className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Average Rating
                            </span>
                        </motion.div>
                        
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <span className="block text-2xl sm:text-3xl md:text-4xl font-bold montserrat-700 mb-1">
                                92%
                            </span>
                            <span className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Recommend Us
                            </span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Reviews Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {currentReviews.length > 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16"
                    >
                        {currentReviews.map((review, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-center mb-4">
                                    {renderStars(review.rating)}
                                </div>
                                
                                <p className="text-sm text-gray-600 mb-4">{review.review}</p>
                                
                                <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                        {review.name.charAt(0)}
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-semibold text-gray-900 montserrat-700">{review.name}</p>
                                        <p className="text-xs text-gray-500 montserrat-500">{review.designation}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        className="text-center py-16"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12.5a3 3 0 100-6 3 3 0 000 6z" />
                        </svg>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No matching reviews found</h3>
                        <p className="text-gray-600">Try selecting a different star rating</p>
                    </motion.div>
                )}
                
                {/* Pagination */}
                {filteredReviews.length > reviewsPerPage && (
                    <div className="flex justify-center items-center mt-8 mb-16">
                        <button 
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 mx-1 rounded-md border ${
                                currentPage === 1 
                                ? "border-gray-200 text-gray-400 cursor-not-allowed" 
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Previous
                        </button>
                        
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => 
                            currentPage > 3 && totalPages > 5 
                                ? currentPage - 3 + i + 1 > totalPages 
                                    ? totalPages - 5 + i + 1 
                                    : currentPage - 3 + i + 1
                                : i + 1
                        ).map(page => (
                            <button 
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-10 h-10 mx-1 rounded-md ${
                                    currentPage === page 
                                    ? "bg-gray-900 text-white" 
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button 
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 mx-1 rounded-md border ${
                                currentPage === totalPages 
                                ? "border-gray-200 text-gray-400 cursor-not-allowed" 
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            
            {/* CTA Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="w-full bg-gray-50 py-10 sm:py-16 mb-20"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 montserrat-700"
                    >
                        Ready to start your learning journey?
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                        className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl mx-auto montserrat-500"
                    >
                        Explore our courses and join our learning community today
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8, duration: 0.8 }}
                        className="flex flex-col sm:flex-row justify-center gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/")}
                            className="px-6 py-3 rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                        >
                            Explore Courses
                        </motion.button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default AllReviewsPage;
