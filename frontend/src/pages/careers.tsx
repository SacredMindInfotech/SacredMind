import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "../components/ui/loadingScreen";
import { motion } from "framer-motion";

interface Job {
    id: number;
    title: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    skills: string[] | null;
    createdAt: string;
    updatedAt: string;
    published: boolean;
    location: "REMOTE" | "HYBRID" | "ON_SITE";
    salary: string | null;
    type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
    experience: string;
    education: string;
    jobCategoryId: number;
}

const Careers = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const router = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.get(`${backendUrl}api/v1/job`);
            //@ts-ignore
            setJobs(response.data);
            setLoading(false);
        };
        fetchJobs();
    }, []);

    if (loading) {
        return <LoadingScreen />
    }

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
                            Join Our Team
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-base sm:text-lg md:text-xl text-gray-600 montserrat-500 max-w-2xl"
                        >
                            Build your career with us
                        </motion.p>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                {/* Benefits Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20"
                >
                    {/* Flexible Work */}
                    <motion.div
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        <div className="h-32 mb-4 sm:mb-6 flex items-center justify-center overflow-hidden text-yellow-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Flexible Work</h3>
                        <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                            Enjoy remote and hybrid work options that fit your lifestyle and productivity preferences.
                        </p>
                    </motion.div>

                    {/* Growth Opportunities */}
                    <motion.div
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
                    >
                        <div className="h-32 mb-4 sm:mb-6 flex items-center justify-center overflow-hidden text-yellow-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Growth Opportunities</h3>
                        <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                            Develop your skills and advance your career with ongoing learning and promotion opportunities.
                        </p>
                    </motion.div>

                    {/* Collaborative Culture */}
                    <motion.div
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1 sm:mx-auto lg:mx-0 sm:max-w-md lg:max-w-none"
                    >
                        <div className="h-32 mb-4 sm:mb-6 flex items-center justify-center overflow-hidden text-yellow-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-yellow-600 montserrat-700">Collaborative Culture</h3>
                        <p className="text-sm sm:text-base text-gray-600 montserrat-500">
                            Work with passionate professionals in a supportive environment focused on innovation and excellence.
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
                                Fast-growing
                            </span>
                            <span className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Company
                            </span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <span className="block text-2xl sm:text-3xl md:text-4xl font-bold montserrat-700 mb-1">
                                Supportive
                            </span>
                            <span className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Team
                            </span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="text-center"
                        >
                            <span className="block text-2xl sm:text-3xl md:text-4xl font-bold montserrat-700 mb-1">
                                Diverse
                            </span>
                            <span className="text-sm sm:text-base text-gray-600 montserrat-500">
                                Opportunities
                            </span>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Current Openings Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="w-full text-center mb-12"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 montserrat-700">Current Openings</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 montserrat-500 max-w-2xl mx-auto">
                        Explore our current job opportunities and find the perfect role for your skills and career goals
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="space-y-6 max-w-4xl mx-auto"
                >
                    {jobs.length > 0 ? (
                        jobs.map((job: Job) => (
                            <motion.div
                                key={job.id}
                                whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                                className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-gray-900 transition-all duration-300"
                            >
                                <h3 className="text-lg sm:text-xl font-bold mb-2 montserrat-700">{job.title}</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {job.location === "REMOTE" ? "Remote" : job.location === "HYBRID" ? "Hybrid" : "On-Site"}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {job.type === "FULL_TIME" ? "Full Time" : job.type === "PART_TIME" ? "Part Time" : job.type === "CONTRACT" ? "Contract" : "Internship"}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {job.experience}
                                    </span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        {job.education}
                                    </span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { router(`/careers/${job.id}`) }}
                                    className="px-4 py-2 sm:px-6 sm:py-3 rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                >
                                    View Job
                                </motion.button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-xl border-2 border-gray-200 flex flex-col items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="text-lg text-gray-500 montserrat-500">No active jobs at the moment</p>
                            <p className="text-gray-400 mt-2">Check back soon for new opportunities</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Contact Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="max-w-xl mx-auto text-center bg-white p-6 sm:p-8 rounded-xl border-2 border-gray-200 shadow-md"
                >
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 montserrat-700">Send us your CV</h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 montserrat-500">
                        Don't see a position that matches your skills? Send us your CV and we'll keep you in mind for future opportunities.
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
                        Email Your CV
                    </motion.a>
                </motion.div>
            </div>

            {/* Final CTA Section */}
            <div className="w-full bg-gray-50 mb-20 py-10 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.6, duration: 0.8 }}
                        className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 montserrat-700"
                    >
                        Ready to grow with us?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8, duration: 0.8 }}
                        className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl mx-auto montserrat-500"
                    >
                        Join our team and help shape the future of education with innovative solutions
                    </motion.p>
                </div>
            </div>
        </div>
    );
};

export default Careers;
