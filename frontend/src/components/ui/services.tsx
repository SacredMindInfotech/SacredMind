import { useState } from "react";
import { Carousel } from "./carousel";

const Services = () => {
    const [selectedTopic, setSelectedTopic] = useState<string>("hands-on");

    // const slideData = [
    //     {
    //         title: "Coaching for School Students",
    //         button: "Know more",
    //         src: "https://plus.unsplash.com/premium_photo-1669652639356-f5cb1a086976?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     },
    //     {
    //         title: "Competitive Exams",
    //         button: "Know more", 
    //         src: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     },
    //     {
    //         title: "Skill based placement oriented training",
    //         button: "Know more",
    //         src: "https://images.unsplash.com/photo-1617900906639-cab7adceb499?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     },
    //     {
    //         title: "Job assistance",
    //         button: "Know more",
    //         src: "https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     },
    // ];

    // const courseCategories = [
    //     {
    //         title: "Technology",
    //         courses: [
    //             "Full Stack Web Development",
    //             "Android Development",
    //             "AI Tools Mastery",
    //         ]
    //     },
    //     {
    //         title: "Digital Marketing & Content",
    //         courses: [
    //             "SEO",
    //             "Digital Marketing",
    //             "Social Media Management",
    //             "Video Editing",
    //             "Graphic Designing",
    //         ]
    //     },
    //     {
    //         title: "Business & Management",
    //         courses: [
    //             "HR Management",
    //             "Sales and Marketing",
    //             "E-commerce Management",
    //         ]
    //     },
    //     {
    //         title: "Personal Development",
    //         courses: [
    //             "Psychology",
    //             "Soft Skills",
    //         ]
    //     }
    // ];

    return (
        <div className="relative w-full h-full">
            {/* Hero Section - Similar to Category */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center bg-gray-100">
                    <h1 className="text-6xl font-bold mb-4 montserrat-700">Our Services</h1>
                    <p className="text-xl text-gray-600">Get certified in the skills that are in most demand</p>
                </div>

                {/* Services Carousel Section */}
                {/* <div className="mb-20">
                    <div className="text-xl font-semibold mb-8 montserrat-500 text-center">~Featured Services~</div>
                    <Carousel slides={slideData} />
                </div> */}

                <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-16">
                    <div className="text-2xl font-semibold mb-4 montserrat-500 text-center">~Learning focused on your goals~</div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3 flex flex-col gap-4">
                            <div
                                className={`p-6 cursor-pointer rounded-md transition-all duration-200 montserrat-500 border hover:border-gray-900 ${selectedTopic === 'hands-on'
                                        ? 'bg-gray-900 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                        : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                    }`}
                                onClick={() => setSelectedTopic('hands-on')}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">🛠️</span>
                                    Hands-on Training
                                </div>
                            </div>
                            <div
                                className={`p-6 cursor-pointer rounded-md transition-all duration-200 montserrat-500 border hover:border-gray-900 ${selectedTopic === 'certification'
                                        ? 'bg-gray-900 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                        : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                    }`}
                                onClick={() => setSelectedTopic('certification')}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📜</span>
                                    Certification Prep
                                </div>
                            </div>
                            <div
                                className={`p-6 cursor-pointer rounded-md transition-all duration-200 montserrat-500 border hover:border-gray-900 ${selectedTopic === 'curriculum'
                                        ? 'bg-gray-900 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                        : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                    }`}
                                onClick={() => setSelectedTopic('curriculum')}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">📚</span>
                                    Job-Focused Curriculum
                                </div>
                            </div>
                        </div>

                        <div className="md:w-2/3 p-8 bg-white rounded-lg border border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200">
                            {selectedTopic === 'hands-on' && (
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold montserrat-500">Hands-on Training</h2>
                                    <p className="text-gray-600 montserrat-400 leading-relaxed">
                                        Get practical experience through interactive exercises and real-world projects. Our hands-on approach ensures you're not just learning theory, but actively building skills that matter in the workplace.
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 montserrat-400 space-y-2">
                                        <li>Interactive exercises</li>
                                        <li>Real-world project assignments</li>
                                        <li>Industry-relevant tools and technologies</li>
                                    </ul>
                                </div>
                            )}
                            {selectedTopic === 'certification' && (
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold montserrat-500">Certification Prep</h2>
                                    <p className="text-gray-600 montserrat-400 leading-relaxed">
                                        Comprehensive preparation for industry-recognized certifications. Our structured approach helps you master the concepts and practices needed to excel in certification exams.
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 montserrat-400 space-y-2">
                                        <li>Exam-focused content</li>
                                        <li>Practice tests and assessments</li>
                                        <li>Expert guidance and tips</li>
                                    </ul>
                                </div>
                            )}
                            {selectedTopic === 'curriculum' && (
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-semibold montserrat-500">Job-Focused Curriculum</h2>
                                    <p className="text-gray-600 montserrat-400 leading-relaxed">
                                        Learn skills that directly align with current industry demands and job requirements. Our curriculum is designed in collaboration with industry experts to ensure relevance.
                                    </p>
                                    <ul className="list-disc list-inside text-gray-600 montserrat-400 space-y-2">
                                        <li>Industry-aligned content</li>
                                        <li>Regular curriculum updates</li>
                                        <li>Career-focused learning paths</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Course Categories Grid */}
                {/* <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-16">
                    <div className="text-2xl font-semibold mb-4 montserrat-500 text-center">~Available Courses~</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {courseCategories.map((category, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary"
                            >
                                <h3 className="text-2xl font-semibold mb-4 montserrat-500">{category.title}</h3>
                                <ul className="space-y-3">
                                    {category.courses.map((course, idx) => (
                                        <li key={idx} className="flex items-center gap-2 montserrat-400">
                                            <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                                            {course}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Career Support Section */}
                <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-16">
                    <div className="text-2xl font-semibold mb-4 montserrat-500 text-center">~Career Launch Support~</div>
                    <div className="p-8 rounded-md border shadow-[4px_4px_0px_0px_rgba(0,0,0)] text-black border-gray-900 bg-white transition duration-200 montserrat-secondary">
                        <h3 className="text-3xl font-bold mb-6 montserrat-500">Transform Your Career</h3>
                        <p className="text-xl leading-relaxed montserrat-400">
                            Your success is our priority. Our dedicated placement team collaborates with industry leaders to provide exceptional career opportunities, helping you transition from learning to earning.
                        </p>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default Services;
