import { useEffect } from "react";

const PrivacyPolicy = () => {

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
                                    Privacy Policy
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-xl">
                                    Your privacy is important to us. This policy explains how we handle your personal information.
                                </p>
                                <div className="flex items-center gap-4 text-gray-900 montserrat-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 15.75v-3.75m0-3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    <span className="text-base md:text-lg lg:text-xl">Policy Details</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-lg max-w-2xl mx-auto w-full">
                                <div className="space-y-6">
                                    <div className="space-y-8">
                                        <div>
                                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Sacred Mind Infotech</h2>
                                            <p className="text-gray-600">
                                                We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your information when you use our platform.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h3>
                                            <p className="text-gray-600 mb-3">
                                                We collect various types of information in connection with the services we provide, including:
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                                <li><span className="font-medium">Personal Information:</span> When you register for an account, we may collect personal details such as your name, email address, phone number, and payment information.</li>
                                                <li><span className="font-medium">Usage Data:</span> We collect information about your interactions with our platform, such as the pages you visit, the courses you access, and other actions you take.</li>
                                                <li><span className="font-medium">Cookies and Tracking Technologies:</span> We use cookies and similar technologies to track your activity on our platform and hold certain information.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h3>
                                            <p className="text-gray-600 mb-3">
                                                We use the information we collect for various purposes, including:
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                                <li><span className="font-medium">Providing Services:</span> To create and manage your account, process transactions, and provide the courses and services you request.</li>
                                                <li><span className="font-medium">Improving Our Platform:</span> To analyze usage patterns and improve the functionality and user experience of our platform.</li>
                                                <li><span className="font-medium">Communication:</span> To send you updates, newsletters, and other information that may be of interest to you. You can opt-out of receiving these communications at any time.</li>
                                                <li><span className="font-medium">Security:</span> To monitor and protect the security of our platform and its users.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Sharing Your Information</h3>
                                            <p className="text-gray-600 mb-3">
                                                We may share your information with third parties in the following circumstances:
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                                <li><span className="font-medium">Service Providers:</span> We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, and email delivery.</li>
                                                <li><span className="font-medium">Legal Requirements:</span> We may disclose your information if required to do so by law or in response to valid requests by public authorities.</li>
                                                <li><span className="font-medium">Business Transfers:</span> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">4. Data Security</h3>
                                            <p className="text-gray-600">
                                                We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee its absolute security.
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

export default PrivacyPolicy;