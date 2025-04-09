import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

interface Job {
    id: number;
    title: string;
    description: string;
    location: "REMOTE" | "HYBRID" | "ON_SITE";
    type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
    experience: string;
    education: string;
    skills: string[];
    responsibilities: string[];
    requirements: string[];
    salary: string | null;
}

const ShimmerEffect = () => {
    return (
        <div className="animate-pulse mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="h-12 bg-gray-200 rounded-lg w-3/4 mb-6 mx-auto"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/2 mx-auto mb-12"></div>
            
            <div className="max-w-3xl mx-auto">
                <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-8"></div>
                
                <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-5/6 mb-8"></div>
                
                <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-4/5 mb-8"></div>
                
                <div className="h-10 bg-gray-200 rounded-lg w-1/3 mx-auto mt-12"></div>
            </div>
        </div>
    );
};

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState<Job | null>(null);
    const [applyModal, setApplyModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}api/v1/job/${id}`);
                //@ts-ignore
                setJob(response.data);
            } catch (error) {
                navigate("/");
                console.error("Error fetching job details:", error);
            }
        };
        fetchJob();
    }, [id]);

    if (!job) {
        return <ShimmerEffect />;
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
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
                    <div className="text-center p-4 sm:p-8 flex flex-col justify-center items-center">
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 montserrat-700 leading-tight"
                        >
                            {job.title}
                        </motion.h1>
                        <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="flex flex-wrap justify-center gap-2 sm:gap-4"
                        >
                            <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                                {job.location === "REMOTE" ? "Remote" : job.location === "HYBRID" ? "Hybrid" : "On-Site"}
                            </span>
                            <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                                {job.type === "FULL_TIME" ? "Full-Time" : job.type === "PART_TIME" ? "Part-Time" : job.type === "CONTRACT" ? "Contract" : "Internship"}
                            </span>
                            <span className="bg-purple-100 text-purple-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                                {job.experience}
                            </span>
                            <span className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                                {job.education}
                            </span>
                            {job.salary && (
                                <span className="bg-red-100 text-red-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                                    {job.salary}
                                </span>
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="bg-white p-5 sm:p-8 rounded-xl border border-gray-200 shadow-sm mb-8"
                >
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 montserrat-700">Job Description</h2>
                    <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">{job.description}</p>
                </motion.div>

                {job.responsibilities.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="bg-white p-5 sm:p-8 rounded-xl border border-gray-200 shadow-sm mb-8"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 montserrat-700">Key Responsibilities</h2>
                        <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm sm:text-base">
                            {job.responsibilities.map((item, index) => (
                                <li key={index} className="leading-relaxed">{item}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {job.requirements.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.8 }}
                        className="bg-white p-5 sm:p-8 rounded-xl border border-gray-200 shadow-sm mb-8"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 montserrat-700">Requirements</h2>
                        <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm sm:text-base">
                            {job.requirements.map((item, index) => (
                                <li key={index} className="leading-relaxed">{item}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {job.skills.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="bg-white p-5 sm:p-8 rounded-xl border border-gray-200 shadow-sm mb-12"
                    >
                        <h2 className="text-xl sm:text-2xl font-bold mb-4 montserrat-700">Skills Required</h2>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, index) => (
                                <span 
                                    key={index} 
                                    className="bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium px-3 py-1 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                )}

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = `https://wa.me/+919056723482?text=Hi, I would like to apply for the position of ${job.title}. My resume is attached here.`}
                        className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base rounded-md border-2 border-gray-900 bg-gray-900 text-white font-bold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                    >
                        Apply for this Position
                    </motion.button>
                </motion.div>
            </div>

            {/* Additional Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.8 }}
                className="w-full bg-gray-50 py-10 sm:py-16 mb-20"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 montserrat-700">
                        Join Our Team
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-2xl mx-auto montserrat-500">
                        For any questions about this position, please contact us at <a href="mailto:hr@sacredmind.in" className="text-blue-600 hover:underline">hr@sacredmind.in</a>
                    </p>
                    <div className="flex justify-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/careers')}
                            className="px-4 py-2 sm:px-6 sm:py-3 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                            View All Jobs
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="px-4 py-2 sm:px-6 sm:py-3 text-sm rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                            Back to Home
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {applyModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg"
                    >
                        <h2 className="text-xl font-semibold mb-4">Apply for this Job</h2>
                        <form className="space-y-4">
                            <input type="file" name="resume" className="w-full p-2 border rounded-lg" required />
                            <input type="text" name="name" placeholder="Full Name" className="w-full p-2 border rounded-lg" required />
                            <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded-lg" required />
                            <input type="tel" name="phone" placeholder="Phone Number" className="w-full p-2 border rounded-lg" required />
                            <textarea name="coverLetter" placeholder="Cover Letter (Optional)" className="w-full p-2 border rounded-lg" />
                            <button type="submit" className="w-full px-6 py-3 bg-gray-900 text-white hover:bg-gray-700 transition duration-200 font-semibold rounded-lg">
                                Submit Application
                            </button>
                        </form>
                        <button onClick={() => setApplyModal(false)} className="mt-4 text-gray-600 hover:text-gray-900 w-full">
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
