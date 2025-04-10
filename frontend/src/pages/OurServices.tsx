import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OurServices = () => {
    const navigate = useNavigate();

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
                            Our Services
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-base sm:text-lg md:text-xl text-gray-600 montserrat-500 max-w-2xl"
                        >
                            At SacredMind Infotech, we don't just educate — we empower, connect, and deliver.
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Introduction Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <p className="text-gray-700 montserrat-500 leading-relaxed text-center">
                            As a multi-product company, we offer a versatile suite of services that cater to students, professionals, companies, and entrepreneurs alike. Here's how we make a difference:
                        </p>
                    </div>
                </motion.div>

                {/* Certified Courses */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <div className="text-4xl mr-4">🎓</div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold montserrat-700">Certified Courses for Students & Professionals</h2>
                        </div>
                        <p className="text-gray-700 montserrat-500 leading-relaxed">
                            Unlock your potential with our industry-recognized certified programs, designed for learners of all levels. From foundational concepts to advanced specializations, our courses are crafted to keep you ahead in your career journey — with flexible formats, expert-led classes, and real-world projects.
                        </p>
                    </div>
                </motion.div>

                {/* Career Launch and Placement Support */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <div className="text-4xl mr-4">🚀</div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold montserrat-700">Career Launch and Placement Support</h2>
                        </div>
                        <p className="text-gray-700 montserrat-500 leading-relaxed">
                            We don't stop at learning. Our dedicated placement services help students and professionals land jobs in reputed companies. From resume building and interview prep to connecting with hiring partners — we're with you every step of the way.
                        </p>
                    </div>
                </motion.div>

                {/* Staffing Solutions */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <div className="text-4xl mr-4">🧑‍💼</div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold montserrat-700">Staffing Solutions for Companies</h2>
                        </div>
                        <p className="text-gray-700 montserrat-500 leading-relaxed">
                            Need skilled talent? We've got you covered.
                            Our staffing solutions help companies source, assess, and onboard the right candidates — quickly and efficiently. Whether it's for tech roles, admin positions, or domain-specific needs, SacredMind Infotech is your reliable hiring partner.
                        </p>
                    </div>
                </motion.div>

                {/* Dropshipping */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="mb-16"
                >
                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-gray-900 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all duration-300">
                        <div className="flex items-center mb-4">
                            <div className="text-4xl mr-4">📦</div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold montserrat-700">Dropshipping and Shipment Services</h2>
                        </div>
                        <p className="text-gray-700 montserrat-500 leading-relaxed">
                            Going beyond education, we also assist businesses with end-to-end dropshipping and shipment services. From inventory management to reliable delivery, we support e-commerce ventures with the tools and logistics they need to grow and scale.
                        </p>
                    </div>
                </motion.div>

                {/* Why Choose Us */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                    className="mb-16"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 montserrat-700">Why Choose Us?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                        >
                            <span className="text-green-500 text-lg flex-shrink-0 mt-0.5">✅</span>
                            <span className="text-gray-700 montserrat-500">Multi-domain expertise</span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                        >
                            <span className="text-green-500 text-lg flex-shrink-0 mt-0.5">✅</span>
                            <span className="text-gray-700 montserrat-500">Trusted by learners and businesses alike</span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                        >
                            <span className="text-green-500 text-lg flex-shrink-0 mt-0.5">✅</span>
                            <span className="text-gray-700 montserrat-500">Scalable, flexible solutions</span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                            className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
                        >
                            <span className="text-green-500 text-lg flex-shrink-0 mt-0.5">✅</span>
                            <span className="text-gray-700 montserrat-500">Backed by industry professionals and a strong partner network</span>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Final CTA Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.8 }}
                className="w-full bg-gray-50 mb-20 py-10 sm:py-16"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 montserrat-700">
                        Ready to get started?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl mx-auto montserrat-500">
                        Whether you're here to learn, hire, or build — SacredMind Infotech is here to help you thrive.
                    </p>
                    <button 
                        onClick={() => navigate('/contact')}
                        className="px-6 py-3 rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                    >
                        Contact Us
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default OurServices;