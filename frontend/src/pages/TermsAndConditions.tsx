import { useEffect } from "react";
const TermsAndConditions = () => {
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
                                    Terms and Conditions
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-xl">
                                    Welcome to SacredMind Infotech. By accessing and using our platform, you agree to comply with and be bound by the following terms and conditions. Please read them carefully before using our services.
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
                                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                                            <p className="text-gray-600">
                                                By accessing and using the SacredMind Infotech website and services, you accept and agree to be bound by these terms and conditions. If you do not agree with any part of these terms, you must not use our platform.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Use of the Platform</h3>
                                            <p className="text-gray-600 mb-3">
                                                You agree to use SacredMind Infotech for lawful purposes only. You must not use our platform in any way that breaches any applicable local, national, or international law or regulation.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Account Registration</h3>
                                            <p className="text-gray-600 mb-3">
                                                To access certain features of SacredMind Infotech, you may be required to create an account. You agree to provide accurate and complete information during the registration process and to keep your account information up to date.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">4. User Conduct</h3>
                                            <p className="text-gray-600 mb-3">
                                                You agree not to use SacredMind Infotech to:
                                            </p>
                                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                                <li>Post, upload, or distribute any content that is unlawful, defamatory, abusive, or otherwise objectionable.</li>
                                                <li>Engage in any activity that could harm or disrupt the platform or other users' experience.</li>
                                                <li>Infringe upon the intellectual property rights of others.</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">5. Intellectual Property</h3>
                                            <p className="text-gray-600 mb-3">
                                                All content on SacredMind Infotech, including but not limited to text, graphics, logos, and software, is the property of SacredMind Infotech or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works based on our content without express written permission from SacredMind Infotech.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">6. Payment and Refunds</h3>
                                            <p className="text-gray-600 mb-3">
                                                Certain courses and services on SacredMind Infotech may be offered for a fee. All payments are non-refundable unless otherwise specified. SacredMind Infotech reserves the right to change its pricing at any time.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">7. Termination</h3>
                                            <p className="text-gray-600 mb-3">
                                                SacredMind Infotech reserves the right to terminate or suspend your account at our sole discretion, without prior notice, for conduct that we believe violates these terms or is harmful to other users or our platform.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">8. Disclaimer of Warranties</h3>
                                            <p className="text-gray-600 mb-3">
                                                SacredMind Infotech provides the platform and services "as is" and without any warranty or condition, express, implied, or statutory. We do not guarantee that the platform will be uninterrupted or error-free.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">9. Limitation of Liability</h3>
                                            <p className="text-gray-600 mb-3">
                                                In no event shall SacredMind Infotech be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your use or inability to use the platform; (b) any unauthorized access to or use of our services; (c) any interruption or cessation of transmission to or from our services.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">10. Changes to Terms</h3>
                                            <p className="text-gray-600 mb-3">
                                                SacredMind Infotech reserves the right to modify these terms at any time. We will notify you of any changes by posting the new terms on this page. Your continued use of the platform after any changes constitutes your acceptance of the new terms.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-800 mb-3">11. Governing Law</h3>
                                            <p className="text-gray-600 mb-3">
                                                These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which SacredMind Infotech operates, without regard to its conflict of law principles.
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

export default TermsAndConditions;