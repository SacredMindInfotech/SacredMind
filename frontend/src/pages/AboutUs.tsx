import { useEffect } from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                            About Us
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-base sm:text-lg md:text-xl text-gray-600 montserrat-500 max-w-2xl"
                        >
                            Empowering Minds. Shaping Futures.
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-700 montserrat-500 leading-relaxed text-center">
                            Welcome to SacredMind Infotech, your trusted partner in holistic learning and career advancement. We are a multi-product company dedicated to delivering top-tier education across a wide range of disciplines — both online and offline.
                        </p>
                    </div>
                </motion.div>

                {/* Who We Are */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mb-16"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 montserrat-700">Who We Are</h2>
                    <div className="bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-700 montserrat-500 leading-relaxed">
                            At SacredMind Infotech, we believe that quality education is the foundation of personal and professional success. That's why we offer a diverse portfolio of courses — from technical and creative domains to business and soft skills — all curated by industry experts and seasoned educators. Whether you're a student, a job seeker, or a working professional, we tailor our programs to meet your individual goals.
                        </p>
                    </div>
                </motion.div>

                {/* What We Offer */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                    className="mb-16"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 montserrat-700">What We Offer</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div className="h-16 mb-4 sm:mb-6 flex items-center text-yellow-600 text-3xl">
                                📚
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Quality Education</h3>
                            <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                                We are committed to academic excellence, offering both online and offline courses designed to equip learners with in-demand skills and real-world knowledge.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div className="h-16 mb-4 sm:mb-6 flex items-center text-yellow-600 text-3xl">
                                🎓
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Industry Certification</h3>
                            <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                                All our programs are certified under CBCE Skill India (CBCE-PB0991), ensuring your learning is recognized and valued across industries.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div className="h-16 mb-4 sm:mb-6 flex items-center text-yellow-600 text-3xl">
                                🛠
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Tailored Courses</h3>
                            <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Our curriculum is not one-size-fits-all. We craft custom learning paths aligned with the latest industry trends, helping learners become job-ready and future-proof.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div className="h-16 mb-4 sm:mb-6 flex items-center text-yellow-600 text-3xl">
                                👩‍🏫
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Best Teachers & Curriculum</h3>
                            <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                                We collaborate with the best educators and professionals in every field to build a curriculum that's relevant, engaging, and impactful.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                        >
                            <div className="h-16 mb-4 sm:mb-6 flex items-center text-yellow-600 text-3xl">
                                💼
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Placement Services</h3>
                            <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Learning is just the beginning. We go a step further by offering placement support to help our learners secure meaningful job opportunities in top companies.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Why SacredMind */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="mb-16"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 montserrat-700">Why SacredMind Infotech?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                        >
                            <span className="text-purple-500 text-lg flex-shrink-0 mt-0.5">→</span>
                            <span className="text-gray-700 montserrat-500">Multi-disciplinary learning environment</span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                        >
                            <span className="text-purple-500 text-lg flex-shrink-0 mt-0.5">→</span>
                            <span className="text-gray-700 montserrat-500">Industry-recognized certifications</span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                        >
                            <span className="text-purple-500 text-lg flex-shrink-0 mt-0.5">→</span>
                            <span className="text-gray-700 montserrat-500">Flexible online & offline course formats</span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                        >
                            <span className="text-purple-500 text-lg flex-shrink-0 mt-0.5">→</span>
                            <span className="text-gray-700 montserrat-500">Personalized mentorship and career guidance</span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100 md:col-span-2"
                        >
                            <span className="text-purple-500 text-lg flex-shrink-0 mt-0.5">→</span>
                            <span className="text-gray-700 montserrat-500">Strong network of hiring partners and recruiters</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Final CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="w-full bg-gray-50 mb-20 py-10 sm:py-16"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 montserrat-700">
                        Join us at SacredMind Infotech
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl mx-auto montserrat-500">
                        Where knowledge meets opportunity. Let's build your future, together.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AboutUs;