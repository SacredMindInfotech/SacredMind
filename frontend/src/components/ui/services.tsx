import { useState } from "react";

const Services = () => {
    const [selectedTopic, setSelectedTopic] = useState<string>("hands-on");


    return (
        <div className="relative w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center bg-gray-100">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 montserrat-700">Our Services</h1>
                    <p className="text-xl text-gray-600">Get certified in the skills that are in most demand</p>
                </div>



                <div className="flex flex-col gap-8 mx-auto py-16">
                    <div className="text-2xl font-semibold mb-4 montserrat-500 text-center">~Learning focused on your goals~</div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:w-1/3 flex flex-col gap-4">
                            <div
                                className={`p-4 sm:p-6 cursor-pointer rounded-md transition-all duration-200 montserrat-500 border hover:border-gray-900 ${selectedTopic === 'hands-on'
                                    ? 'bg-gray-900 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                    : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                    }`}
                                onClick={() => setSelectedTopic('hands-on')}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl sm:text-2xl">🛠️</span>
                                    <span className="text-sm sm:text-base">Hands-on Training</span>
                                </div>
                            </div>
                            <div
                                className={`p-4 sm:p-6 cursor-pointer rounded-md transition-all duration-200 montserrat-500 border hover:border-gray-900 ${selectedTopic === 'certification'
                                    ? 'bg-gray-900 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                    : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                    }`}
                                onClick={() => setSelectedTopic('certification')}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl sm:text-2xl">📜</span>
                                    <span className="text-sm sm:text-base">Certification Prep</span>
                                </div>
                            </div>
                            <div
                                className={`p-4 sm:p-6 cursor-pointer rounded-md transition-all duration-200 montserrat-500 border hover:border-gray-900 ${selectedTopic === 'curriculum'
                                    ? 'bg-gray-900 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                    : 'bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]'
                                    }`}
                                onClick={() => setSelectedTopic('curriculum')}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl sm:text-2xl">📚</span>
                                    <span className="text-sm sm:text-base">Job-Focused Curriculum</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:w-2/3 p-4 sm:p-6 md:p-8 bg-white rounded-lg border border-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all duration-200">
                            {selectedTopic === 'hands-on' && (
                                <div className="space-y-3 sm:space-y-4">
                                    <h2 className="text-xl sm:text-2xl font-semibold montserrat-500">Hands-on Training</h2>
                                    <p className="text-sm sm:text-base text-gray-600 montserrat-400 leading-relaxed">
                                        Get practical experience through interactive exercises and real-world projects. Our hands-on approach ensures you're not just learning theory, but actively building skills that matter in the workplace.
                                    </p>
                                    <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 montserrat-400 space-y-1 sm:space-y-2">
                                        <li>Interactive exercises</li>
                                        <li>Real-world project assignments</li>
                                        <li>Industry-relevant tools and technologies</li>
                                    </ul>
                                </div>
                            )}
                            {selectedTopic === 'certification' && (
                                <div className="space-y-3 sm:space-y-4">
                                    <h2 className="text-xl sm:text-2xl font-semibold montserrat-500">Certification Prep</h2>
                                    <p className="text-sm sm:text-base text-gray-600 montserrat-400 leading-relaxed">
                                        Comprehensive preparation for industry-recognized certifications. Our structured approach helps you master the concepts and practices needed to excel in certification exams.
                                    </p>
                                    <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 montserrat-400 space-y-1 sm:space-y-2">
                                        <li>Exam-focused content</li>
                                        <li>Practice tests and assessments</li>
                                        <li>Expert guidance and tips</li>
                                    </ul>
                                </div>
                            )}
                            {selectedTopic === 'curriculum' && (
                                <div className="space-y-3 sm:space-y-4">
                                    <h2 className="text-xl sm:text-2xl font-semibold montserrat-500">Job-Focused Curriculum</h2>
                                    <p className="text-sm sm:text-base text-gray-600 montserrat-400 leading-relaxed">
                                        Learn skills that directly align with current industry demands and job requirements. Our curriculum is designed in collaboration with industry experts to ensure relevance.
                                    </p>
                                    <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 montserrat-400 space-y-1 sm:space-y-2">
                                        <li>Industry-aligned content</li>
                                        <li>Regular curriculum updates</li>
                                        <li>Career-focused learning paths</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-8 mx-auto py-16 items-center">
                    <div className="lg:w-1/3 text-center">
                        <div className="text-xl sm:text-2xl font-semibold mb-4 montserrat-500">~Career Launch Support~</div>
                    </div>
                    <div className="lg:w-2/3 p-4 sm:p-6 md:p-8 rounded-lg border shadow-[4px_4px_0px_0px_rgba(0,0,0)] text-black border-gray-900 bg-white transition duration-200">
                        <h3 className="text-xl sm:text-2xl font-semibold montserrat-500 mb-4">Transform Your Career</h3>
                        <p className="text-sm sm:text-base text-gray-600 montserrat-400 leading-relaxed">
                            Your success is our priority. Our dedicated placement team collaborates with industry leaders to provide exceptional career opportunities, helping you transition from learning to earning.
                        </p>
                        <ul className="list-disc list-inside text-sm sm:text-base text-gray-600 montserrat-400 space-y-1 sm:space-y-2 mt-4">
                            <li>Industry partnerships</li>
                            <li>Career guidance</li>
                            <li>Placement assistance</li>
                        </ul>
                    </div>
                </div>


            </div>
        </div>
    );
}

export default Services;
