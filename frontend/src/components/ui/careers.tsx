import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const Careers = (props: any) => {

    const [jobs, setJobs] = useState<Job[]>([]);
    const router = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const fetchJobs = async () => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await axios.get(`${backendUrl}api/v1/job`);
            //@ts-ignore
            setJobs(response.data);
        };
        fetchJobs();
    }, []);

    return (
        <div className="relative w-full h-full">

        <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
        <section ref={props.ref} className="relative text-black">
            {/* Content */}
            <div className="relative z-10 container mx-auto">
                <div className="flex flex-col gap-12">
                    {/* Left Section - Hero Content */}
                    <div className="flex flex-col p-8 md:p-16 lg:p-28 bg-gray-100 justify-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 montserrat-700">
                            Join Our Team
                        </h1>
                        <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-xl">
                            Build your career with us.
                        </p>
                        <p className="text-lg md:text-xl mb-8 max-w-xl">
                            Send us your CV at <a className="underline" href="mailto:careers@eduplay.in">hr@sacredmind.in</a>
                        </p>
                        <div className="flex items-center gap-4 text-gray-900 montserrat-500">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                            </svg>
                            <span className="text-base md:text-lg lg:text-xl">Current Openings</span>
                        </div>
                    </div>
                    {/* Right Section - Job Listings */}
                    <div className="flex px-4 md:px-16 lg:p-28 flex-col justify-center py-8 md:py-16">
                        <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-lg max-w-2xl mx-auto w-full">
                            <div className="space-y-6">

                                {jobs.length > 0 ? (
                                    jobs.map((job: Job) => (
                                        <div key={job.id} className="border border-gray-900 p-6">
                                            <h3 className="text-xl font-bold mb-2 montserrat-600">{job.title}</h3>
                                            <p className="text-gray-600 mb-4">{job.location} | {job.type} | {job.experience} | {job.education}</p>
                                            <button onClick={() => { router(`/careers/${job.id}`) }} className="px-6 py-3 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-200 montserrat-500">
                                                View Job
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center h-full">
                                        <p className="text-gray-500">No jobs found</p>
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
}

export default Careers;
