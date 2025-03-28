import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { LoadingScreen } from "../loadingScreen";
import {  FiEye } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

interface Job {
    id: number;
    title: string;
    description: string;
    responsibilities: string[];
    requirements: string[];
    skills: string[];
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    location: "REMOTE" | "HYBRID" | "ON_SITE";
    salary: string | null;
    type: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
    experience: string;
    education: string;
    jobCategoryId: number;
    jobCategory: {
        id: number;
        name: string;
    };
}

const EditJob = () => {
    const { id } = useParams();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getToken } = useAuth();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState<'view' | 'edit'>('view');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newRequirementValue, setNewRequirementValue] = useState('');
    const [newResponsibilityValue, setNewResponsibilityValue] = useState('');
    const [newSkillValue, setNewSkillValue] = useState('');
    const [showEditJobModal, setShowEditJobModal] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        responsibilities: [] as string[],
        requirements: [] as string[],
        skills: [] as string[],
        published: false,
        location: 'REMOTE' as 'REMOTE' | 'HYBRID' | 'ON_SITE',
        salary: '',
        type: 'FULL_TIME' as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP',
        experience: '',
        education: '',
        jobCategoryId: 0
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`${backendUrl}api/v1/job/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                //@ts-ignore
                setJob(response.data);
                setFormData({
                    //@ts-ignore
                    title: response.data.title,
                    //@ts-ignore
                    description: response.data.description,
                    //@ts-ignore
                    responsibilities: response.data.responsibilities,
                    //@ts-ignore
                    requirements: response.data.requirements,
                    //@ts-ignore
                    skills: response.data.skills,
                    //@ts-ignore
                    published: response.data.published,
                    //@ts-ignore
                    location: response.data.location,
                    //@ts-ignore
                    salary: response.data.salary || '',
                    //@ts-ignore
                    type: response.data.type,
                    //@ts-ignore
                    experience: response.data.experience,
                    //@ts-ignore
                    education: response.data.education,
                    //@ts-ignore
                    jobCategoryId: response.data.jobCategoryId
                });
            } catch (error) {
                console.error("Error fetching job:", error);
                setError("Failed to fetch job details");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id, getToken, backendUrl]);

  

    const handleDelete = async () => {
        try {
            setIsSubmitting(true);
            const token = await getToken();
            const res=await axios.delete(`${backendUrl}api/v1/admin/jobs/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(res.status===200){
                toast.success('Job deleted successfully');
                navigate('/admin/jobs');
            }
        } catch (error) {
            console.error("Error deleting job:", error);
            toast.error('Failed to delete job');
        } finally {
            setIsSubmitting(false);
            setShowDeleteDialog(false);
        }
    };

   

    // Handle saving all job fields
    const handleSaveJobChanges = async () => {
        try {
            setIsSubmitting(true);
            const token = await getToken();
            const res=await axios.put(`${backendUrl}api/v1/admin/jobs/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(res.status===200){
                toast.success('Job updated successfully');
                setShowEditJobModal(false);
            }
            
            setJob({...job!, ...formData});
            toast.success('Job updated successfully');
            setShowEditJobModal(false);
        } catch (error) {
            console.error("Error updating job:", error);
            toast.error('Failed to update job');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle form field changes
    const handleFormChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading) return <LoadingScreen />;
    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
                    <p className="text-gray-600">{error || "Job not found"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-gray-900 text-white p-6">
                            <h2 className="text-xl font-bold mb-8 border-b border-gray-700 pb-4">Job Management</h2>
                            <div className="flex flex-col gap-3">
                                <button 
                                    className={`p-3 rounded-md flex items-center transition-all ${selectedTab === 'view' ? 'bg-white text-gray-900 font-medium' : 'hover:bg-gray-800'}`} 
                                    onClick={() => setSelectedTab('view')}
                                >
                                    <FiEye className="inline-block mr-3" />
                                    View Job
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            <div className="p-6 border-b border-gray-200">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{job?.title}</h1>
                                <div className="flex items-center mt-2">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${job?.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {job?.published ? 'Published' : 'Draft'}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-500">
                                        Category: <span className="font-medium">{job?.jobCategory?.name}</span>
                                    </span>
                                    <div className="ml-auto flex space-x-2">
                                        <button
                                            onClick={() => setShowEditJobModal(true)}
                                            className="px-4 py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                                            disabled={isSubmitting}
                                        >
                                            Edit Job
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteDialog(true)}
                                             className="px-4 py-2 rounded-md border border-white bg-red-600 text-white hover:shadow-[4px_4px_0px_0px_rgba(255,0,0,0.3)] hover:text-white hover:border-red-700 hover:bg-red-700 transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                                            disabled={isSubmitting}
                                        >
                                            Delete Job
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                {selectedTab === 'view' ? (
                                    // Existing view content
                                    <div className="space-y-6">
                                        {/* Job Type and Location */}
                                        <div className="flex flex-wrap gap-4">
                                            <div className="flex items-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    job.type === 'FULL_TIME' ? 'bg-blue-100 text-blue-800' : 
                                                    job.type === 'PART_TIME' ? 'bg-green-100 text-green-800' : 
                                                    job.type === 'CONTRACT' ? 'bg-purple-100 text-purple-800' : 
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {job.type.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    job.location === 'REMOTE' ? 'bg-green-100 text-green-800' : 
                                                    job.location === 'HYBRID' ? 'bg-blue-100 text-blue-800' : 
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {job.location.replace('_', ' ')}
                                                </span>
                                            </div>
                                            {job.salary && (
                                                <div className="flex items-center">
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800">
                                                        {job.salary}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                                            <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
                                        </div>

                                        {/* Requirements */}
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h2>
                                            <ul className="list-disc pl-5 space-y-1">
                                                {job.requirements.map((req, index) => (
                                                    <li key={index} className="text-gray-600">{req}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Responsibilities */}
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Responsibilities</h2>
                                            <ul className="list-disc pl-5 space-y-1">
                                                {job.responsibilities.map((resp, index) => (
                                                    <li key={index} className="text-gray-600">{resp}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Skills */}
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-800 mb-2">Required Skills</h2>
                                            <div className="flex flex-wrap gap-2">
                                                {job.skills.map((skill, index) => (
                                                    <span 
                                                        key={index}
                                                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Additional Information */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Experience</h2>
                                                <p className="text-gray-600">{job.experience}</p>
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-semibold text-gray-800 mb-2">Education</h2>
                                                <p className="text-gray-600">{job.education}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (null)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comprehensive Edit Job Modal */}
            {showEditJobModal && (
                <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl my-8 mx-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6 border-b pb-3 sticky top-0 bg-white flex items-center">
                            <span className="text-blue-600 mr-2">✏️</span> Edit Job
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Title */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Job Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleFormChange('title', e.target.value)}
                                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            
                            {/* Job Category */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Category ID</label>
                                <input
                                    type="number"
                                    value={formData.jobCategoryId}
                                    onChange={(e) => handleFormChange('jobCategoryId', parseInt(e.target.value))}
                                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>
                            
                            {/* Job Type */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Job Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => handleFormChange('type', e.target.value)}
                                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="FULL_TIME">Full Time</option>
                                    <option value="PART_TIME">Part Time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="INTERNSHIP">Internship</option>
                                </select>
                            </div>
                            
                            {/* Location */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Location</label>
                                <select
                                    value={formData.location}
                                    onChange={(e) => handleFormChange('location', e.target.value)}
                                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="REMOTE">Remote</option>
                                    <option value="HYBRID">Hybrid</option>
                                    <option value="ON_SITE">On Site</option>
                                </select>
                            </div>
                            
                            {/* Salary */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Salary</label>
                                <input
                                    type="text"
                                    value={formData.salary}
                                    onChange={(e) => handleFormChange('salary', e.target.value)}
                                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="e.g. $50,000 - $70,000"
                                />
                            </div>
                            
                            {/* Published Status */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Status</label>
                                <div className="flex items-center mt-2">
                                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={formData.published}
                                            onChange={(e) => handleFormChange('published', e.target.checked)}
                                            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                                            style={{
                                                transform: formData.published ? 'translateX(100%)' : 'translateX(0)',
                                                borderColor: formData.published ? '#4F46E5' : '#D1D5DB'
                                            }}
                                        />
                                        <label 
                                            className="toggle-label block overflow-hidden h-6 rounded-full cursor-pointer"
                                            style={{ backgroundColor: formData.published ? '#818CF8' : '#E5E7EB' }}
                                        ></label>
                                    </div>
                                    <span className="text-gray-700">
                                        {formData.published ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleFormChange('description', e.target.value)}
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-32"
                            />
                        </div>
                        
                        {/* Array Fields Section */}
                        <div className="flex flex-col gap-6 mb-6">
                            {/* Requirements */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-gray-700 font-medium mb-3">Requirements</label>
                                <div className="border border-gray-200 rounded-lg p-3  overflow-y-auto bg-white">
                                    <div className="flex mb-3">
                                        <input
                                            type="text"
                                            value={newRequirementValue}
                                            onChange={(e) => setNewRequirementValue(e.target.value)}
                                            placeholder="Add requirement"
                                            className="shadow-sm border border-gray-300 rounded-lg flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-2"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                if (newRequirementValue.trim()) {
                                                    handleFormChange('requirements', [...formData.requirements, newRequirementValue.trim()]);
                                                    setNewRequirementValue('');
                                                }
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    
                                    {formData.requirements.length === 0 ? (
                                        <p className="text-gray-400 text-sm italic text-center mt-4">No requirements added yet</p>
                                    ) : (
                                        formData.requirements.map((req, index) => (
                                            <div key={index} className="flex items-center mb-2 bg-gray-50 p-2 rounded-lg">
                                                <span className="flex-1 text-sm">{req}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const newReqs = [...formData.requirements];
                                                        newReqs.splice(index, 1);
                                                        handleFormChange('requirements', newReqs);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 ml-2 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            
                            {/* Responsibilities */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-gray-700 font-medium mb-3">Responsibilities</label>
                                <div className="border border-gray-200 rounded-lg p-3 overflow-y-auto bg-white">
                                    <div className="flex mb-3">
                                        <input
                                            type="text"
                                            value={newResponsibilityValue}
                                            onChange={(e) => setNewResponsibilityValue(e.target.value)}
                                            placeholder="Add responsibility"
                                            className="shadow-sm border border-gray-300 rounded-lg flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-2"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                if (newResponsibilityValue.trim()) {
                                                    handleFormChange('responsibilities', [...formData.responsibilities, newResponsibilityValue.trim()]);
                                                    setNewResponsibilityValue('');
                                                }
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    
                                    {formData.responsibilities.length === 0 ? (
                                        <p className="text-gray-400 text-sm italic text-center mt-4">No responsibilities added yet</p>
                                    ) : (
                                        formData.responsibilities.map((resp, index) => (
                                            <div key={index} className="flex items-center mb-2 bg-gray-50 p-2 rounded-lg">
                                                <span className="flex-1 text-sm">{resp}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const newResps = [...formData.responsibilities];
                                                        newResps.splice(index, 1);
                                                        handleFormChange('responsibilities', newResps);
                                                    }}
                                                    className="text-red-500 hover:text-red-700 ml-2 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            
                            {/* Skills */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-gray-700 font-medium mb-3">Required Skills</label>
                                <div className="border border-gray-200 rounded-lg p-3 overflow-y-auto bg-white">
                                    <div className="flex mb-3">
                                        <input
                                            type="text"
                                            value={newSkillValue}
                                            onChange={(e) => setNewSkillValue(e.target.value)}
                                            placeholder="Add skill"
                                            className="shadow-sm border border-gray-300 rounded-lg flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mr-2"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => {
                                                if (newSkillValue.trim()) {
                                                    handleFormChange('skills', [...formData.skills, newSkillValue.trim()]);
                                                    setNewSkillValue('');
                                                }
                                            }}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    
                                    {formData.skills.length === 0 ? (
                                        <p className="text-gray-400 text-sm italic text-center mt-4">No skills added yet</p>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills.map((skill, index) => (
                                                <div key={index} className="bg-blue-50 text-blue-700 rounded-full px-3 py-1.5 text-sm flex items-center border border-blue-100">
                                                    {skill}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            const newSkills = [...formData.skills];
                                                            newSkills.splice(index, 1);
                                                            handleFormChange('skills', newSkills);
                                                        }}
                                                        className="ml-2 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-full h-5 w-5 flex items-center justify-center transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        {/* Education and Experience */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-gray-700 font-medium mb-2">Experience</label>
                                <input
                                    type="text"
                                    value={formData.experience}
                                    onChange={(e) => handleFormChange('experience', e.target.value)}
                                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                />
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <label className="block text-gray-700 font-medium mb-2">Education</label>
                                <input
                                    type="text"
                                    value={formData.education}
                                    onChange={(e) => handleFormChange('education', e.target.value)}
                                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2.5 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t sticky bottom-0 bg-white">
                            <button
                                onClick={() => setShowEditJobModal(false)}
                                className="bg-white border border-gray-300  text-gray-800 font-medium py-2.5 px-5 rounded-lg  hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer "
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveJobChanges}
                                className="px-5 py-2.5 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save All Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {showDeleteDialog && (
                <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Delete Job</h2>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this job? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowDeleteDialog(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-md border border-white bg-red-600 text-white hover:shadow-[4px_4px_0px_0px_rgba(255,0,0,0.3)] hover:text-white hover:border-red-700 hover:bg-red-700 transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                            >
                                {isSubmitting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toaster />
        </div>
    );
};

export default EditJob;