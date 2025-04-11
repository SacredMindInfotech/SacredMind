import { motion } from "framer-motion";
import { useEffect } from "react";

const TeachWithUs = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
    
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
                            So many reasons to start
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-base sm:text-lg md:text-xl text-gray-600 montserrat-500 max-w-2xl"
                        >
                            Join our community of instructors and share your knowledge with learners worldwide
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Reasons Grid */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20"
                >
                    {/* Teach Your Way */}
                    <motion.div 
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        <div className="h-44 mb-4 sm:mb-6 flex items-center justify-center overflow-hidden">
                            <img src="/teach-your-own-way.svg" alt="Teach Your Way" className="w-full max-h-44 object-contain" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Teach your way</h3>
                        <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                            Publish the course you want, in the way you want, and always have control of your own content.
                        </p>
                    </motion.div>

                    {/* Inspire Learners */}
                    <motion.div 
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        <div className="h-44 mb-4 sm:mb-6 flex items-center justify-center overflow-hidden">
                            <img src="/inspire-learner.svg" alt="Inspire Learners" className="w-full max-h-44 object-contain" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Inspire learners</h3>
                        <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                            Teach what you know and help learners explore their interests, gain new skills, and advance their careers.
                        </p>
                    </motion.div>

                    {/* Get Rewarded */}
                    <motion.div 
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1 sm:mx-auto lg:mx-0 sm:max-w-md lg:max-w-none"
                    >
                        <div className="h-44 mb-4 sm:mb-6 flex items-center justify-center overflow-hidden">
                            <img src="/get-rewarded.svg" alt="Get Rewarded" className="w-full max-h-44 object-contain" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Get rewarded</h3>
                        <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                            Expand your professional network, build your expertise, and earn money on each paid enrollment.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
            
            {/* Stats Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-full bg-gradient-to-r from-purple-100 via-gray-100 to-gray-200 py-10 sm:py-16"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-around gap-8 md:gap-10">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <span className="block text-2xl sm:text-3xl md:text-4xl font-bold montserrat-700 mb-1">
                                300+
                            </span>
                            <span className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Students
                            </span>
                        </motion.div>
                        
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <span className="block text-2xl sm:text-3xl md:text-4xl font-bold montserrat-700 mb-1">
                                3
                            </span>
                            <span className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Languages
                            </span>
                        </motion.div>
                        
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <span className="block text-2xl sm:text-3xl md:text-4xl font-bold montserrat-700 mb-1">
                                20+
                            </span>
                            <span className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Courses
                            </span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* How to Begin Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="max-w-xl mx-auto text-center bg-white p-6 sm:p-8 rounded-xl border-2 border-gray-200 shadow-md"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 montserrat-700">How to begin</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 montserrat-500">
                        Contact us through the given email, and our team will reach back to you shortly.
                    </p>
                    <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href="mailto:hr@sacredmind.in"
                        className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-bold text-white bg-gray-900 rounded-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white hover:border-gray-900 border-2 border-transparent transition duration-200 montserrat-secondary"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contact Us
                    </motion.a>
                </motion.div>
            </div>
            
            {/* Final CTA Section */}
            <div className="w-full bg-gray-50 mb-20 py-10 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 montserrat-700"
                    >
                        Ready to share your expertise?
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.8 }}
                        className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl mx-auto montserrat-500"
                    >
                        Join us today and start creating courses that make a difference in students' lives
                    </motion.p>
                </div>
            </div>
        </div>
    )
}

export default TeachWithUs;
