import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="w-full bg-white min-h-screen flex flex-col">
            {/* Hero Section with animated elements */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full bg-gradient-to-r from-purple-50 to-gray-100 flex-grow flex items-center"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-24 text-center">
                    <motion.div 
                        className="flex flex-col items-center justify-center gap-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center"
                        >
                            <span className="text-7xl sm:text-8xl font-bold text-gray-300">404</span>
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 montserrat-700 leading-tight"
                        >
                            Page Not Found
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="text-base sm:text-lg md:text-xl text-gray-600 montserrat-500 max-w-2xl"
                        >
                            The page you're looking for doesn't exist or has been moved.
                        </motion.p>
                        
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.9, duration: 0.8 }}
                            className="mt-8 flex flex-col sm:flex-row items-center gap-4"
                        >
                            <Link to="/">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                >
                                    Back to Home
                                </motion.button>
                            </Link>
                            <Link to="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-3 rounded-md border-2 border-gray-300 bg-white text-gray-700 font-bold hover:border-gray-900 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200 montserrat-secondary"
                                >
                                    Contact Support
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
     
        </div>
    );
};

export default NotFound;
