import { useEffect } from "react";
const SalesAndRefunds = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);
    return (
        <div className="relative w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <section className="relative text-black">
                    <div className="relative z-10 container mx-auto">
                        <div className="flex flex-col gap-12">
                            <div className="flex flex-col p-8 md:p-16 lg:p-28 bg-gray-100 justify-center">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 montserrat-700">
                                    Sales and Refunds
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-xl">
                                At SacredMind Infotech, we strive to provide the best learning experience for our users. We understand that there may be situations where you may need to request a refund. This Refund Policy outlines the conditions and processes for obtaining a refund for purchases made on our platform.
                                </p>
                                <div className="flex items-center gap-4 text-gray-900 montserrat-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 15.75v-3.75m0-3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    <span className="text-base md:text-lg lg:text-xl">Terms Overview</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-lg max-w-2xl mx-auto w-full">
                                <div className="space-y-6">
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. General Refund Policy</h2>
                                            <p className="text-gray-600">
                                                Our general refund policy applies to all courses and services offered on SacredMind Infotech. Refunds will be granted under the following conditions:
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mt-3">
                                                <li><span className="font-medium">Course Not Accessed:</span> If you have purchased a course and have not accessed any of its content, you may request a full refund within 14 days of the purchase date.</li>
                                                <li><span className="font-medium">Technical Issues:</span> If you experience technical issues that prevent you from accessing the course content and we are unable to resolve the issue, you may request a refund within 14 days of the purchase date.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Non-Refundable Items</h3>
                                            <p className="text-gray-600 mb-3">
                                                Certain items and services are non-refundable. These include:
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                                <li><span className="font-medium">Downloaded Content:</span> Any content that has been downloaded to your device is non-refundable.</li>
                                                <li><span className="font-medium">Completed Courses:</span> If you have completed a course, it is not eligible for a refund.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">3. How to Request a Refund</h3>
                                            <p className="text-gray-600 mb-3">
                                                To request a refund, please follow these steps:
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                                <li><span className="font-medium">Contact Support:</span> Email our support team at info@sacredmind.in with your refund request. Include your order number, the course name, and the reason for the refund request.</li>
                                                <li><span className="font-medium">Review Process:</span> Our support team will review your request and may ask for additional information to process your refund.</li>
                                                <li><span className="font-medium">Refund Approval:</span> If your refund request meets the conditions outlined in this policy, we will process the refund to your original method of payment. Please allow 5-10 business days for the refund to appear in your account.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">4. Changes to Refund Policy</h3>
                                            <p className="text-gray-600">
                                                SacredMind Infotech reserves the right to modify this Refund Policy at any time. We will notify you of any changes by posting the new policy on this page. Your continued use of the platform after any changes constitutes your acceptance of the new policy.
                                            </p>
                                        </div>
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

export default SalesAndRefunds;