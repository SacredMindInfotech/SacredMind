import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState<Job | null>(null);
    const [applyModal, setApplyModal] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                const response = await axios.get(`${backendUrl}api/v1/job/${id}`);
                //@ts-ignore
                setJob(response.data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            }
        };
        fetchJob();
    }, [id]);

    if (!job) {
        return <div className="flex justify-center items-center h-screen text-gray-500">Loading...</div>;
    }

    return (
        <section className="relative text-black px-4 sm:px-6 lg:px-16 py-10">
            <div className="max-w-4xl mx-auto bg-gray-100 p-6 sm:p-8 md:p-12 rounded-lg shadow-lg">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{job.title}</h1>
                <p className="text-lg text-gray-600 mb-6">
                    <span className="font-bold">Location:</span> {job.location === "REMOTE" ? "Remote" : job.location === "HYBRID" ? "Hybrid" : "On-Site"} |{" "}
                    <span className="font-bold">Type:</span> {job.type === "FULL_TIME" ? "Full-Time" : job.type === "PART_TIME" ? "Part-Time" : job.type === "CONTRACT" ? "Contract" : "Internship"} |{" "}
                    <span className="font-bold">Experience:</span> {job.experience} |{" "}
                    <span className="font-bold">Education:</span> {job.education}
                </p>

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
                        onClick={() => window.location.href = "mailto:hr@sacredmind.in?subject=Job Application&body=Please find my resume attached."}
                    className="mt-6 w-full sm:w-auto px-6 py-3 bg-gray-900 text-white hover:bg-gray-700 transition duration-200 font-semibold rounded-lg">
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
        </section>
    );
};

export default JobDetails;
