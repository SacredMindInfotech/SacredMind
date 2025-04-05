import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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
        <div className="animate-pulse mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
            <div className="flex flex-col gap-12">
                {/* Top Section Shimmer */}
                <div className="flex flex-col p-8 md:p-16 lg:p-28 bg-gray-100">
                    <div className="h-12 bg-gray-200 rounded-lg w-3/4 mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-full max-w-xl"></div>
                </div>

                {/* Bottom Section Shimmer */}
                <div className="flex px-4 md:px-16 lg:p-28 flex-col justify-center py-8 md:py-16">
                    <div className="bg-white/10 p-4 md:p-8 rounded-lg max-w-2xl mx-auto w-full">
                        <div className="space-y-6">
                            <div className="h-6 bg-gray-200 rounded-lg w-1/4"></div>
                            <div className="h-24 bg-gray-200 rounded-lg w-full"></div>
                            
                            <div className="h-6 bg-gray-200 rounded-lg w-1/4 mt-8"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                                <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded-lg w-4/6"></div>
                            </div>

                            <div className="h-6 bg-gray-200 rounded-lg w-1/4 mt-8"></div>
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                                <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
                                <div className="h-4 bg-gray-200 rounded-lg w-4/6"></div>
                            </div>

                            <div className="h-12 bg-gray-200 rounded-lg w-1/3 mt-8"></div>
                        </div>
                    </div>
                </div>
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
        <div className="relative w-full h-full">

        <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
        <section className="relative text-black  ">
            <div className="relative z-10 container mx-auto">
                <div className="flex flex-col gap-12">
                    {/* Top Section - Job Information */}
                    <div className="flex flex-col p-8 md:p-16 lg:p-28 bg-gray-100 justify-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 montserrat-700">
                            {job.title}
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-xl">
                            <span className="font-bold">Location:</span> {job.location === "REMOTE" ? "Remote" : job.location === "HYBRID" ? "Hybrid" : "On-Site"} |{" "}
                            <span className="font-bold">Type:</span> {job.type === "FULL_TIME" ? "Full-Time" : job.type === "PART_TIME" ? "Part-Time" : job.type === "CONTRACT" ? "Contract" : "Internship"} |{" "}
                            <span className="font-bold">Experience:</span> {job.experience} |{" "}
                            <span className="font-bold">Education:</span> {job.education}
                        </p>
                    </div>

                    {/* Bottom Section - Job Details */}
                    <div className="flex px-4 md:px-16 lg:p-28 flex-col justify-center py-8 md:py-16">
                        <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-lg max-w-2xl mx-auto w-full">
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold mt-6">Job Description</h2>
                                <p className="text-gray-700 mb-6">{job.description}</p>

                                {job.responsibilities.length > 0 && (
                                    <>
                                        <h2 className="text-xl font-semibold mt-6">Responsibilities</h2>
                                        <ul className="list-disc pl-5 text-gray-700 mb-6 space-y-1">
                                            {job.responsibilities.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                {job.requirements.length > 0 && (
                                    <>
                                        <h2 className="text-xl font-semibold mt-6">Requirements</h2>
                                        <ul className="list-disc pl-5 text-gray-700 mb-6 space-y-1">
                                            {job.requirements.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}

                                {job.skills.length > 0 && (
                                    <>
                                        <h2 className="text-xl font-semibold mt-6">Skills Required</h2>
                                        <p className="text-gray-700 mb-6">{job.skills.join(", ")}</p>
                                    </>
                                )}

                                {job.salary && <p className="text-lg font-semibold mt-4">💰 Salary: {job.salary}</p>}

                                <button
                                    onClick={() => window.location.href = `https://wa.me/+919056723482?text=Hi, I would like to apply for the position of ${job.title}. My resume is attached here.`}
                                    className="px-6  mt-6 sm:px-12 py-2 sm:py-3 text-sm sm:text-base rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer">
                                    Apply Now
                                </button>

                                {applyModal && (
                                    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
                                        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-lg">
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
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
            </div>
            </div>
    );
};

export default JobDetails;
