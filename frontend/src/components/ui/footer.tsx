import { useNavigate } from "react-router-dom";

const Footer = () => {
    const router = useNavigate();
    return (
        <div className="flex flex-col w-full">
            <section className="bg-gray-100">
                <div className="container px-4 py-8 mx-auto">
                    <div className="mb-6">
                        <div className="flex flex-row items-center gap-2 mb-4">
                            <img src="/logo.svg" alt="logo" className="w-10 h-10" />
                            <p className="text-xl text-gray-900 font-black montserrat-700">Sacred Mind Infotech Private Limited</p>
                        </div>
                        <p className="text-base font-medium text-blue-500">Contact us</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <span className="inline-block p-1.5 text-blue-500 rounded-full bg-blue-100/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </span>

                                <h2 className="text-sm font-medium text-gray-900">Email</h2>
                                <p className="text-sm text-gray-500">Our friendly team is here to help.</p>
                                <p className="text-sm text-blue-500">info@sacredmind.in</p>
                            </div>

                            <div className="space-y-2">
                                <span className="inline-block p-1.5 text-blue-500 rounded-full bg-blue-100/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                </span>

                                <h2 className="text-sm font-medium text-gray-900">Office</h2>
                                <p className="text-sm text-gray-500">Come say hello at our office.</p>
                                <p className="text-sm text-blue-500">Zirakpur, Punjab</p>
                            </div>

                            <div className="space-y-2">
                                <span className="inline-block p-1.5 text-blue-500 rounded-full bg-blue-100/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </span>

                                <h2 className="text-sm font-medium text-gray-900">Phone</h2>
                                <p className="text-sm text-gray-500">Mon-Sat from 9am to 5pm.</p>
                                <p className="text-sm text-blue-500">+91 90567-23482</p>
                            </div>
                        </div>

                        <div className=" h-[200px] lg:h-[300px] lg:-mt-28 w-full flex justify-center lg:justify-end">
                            <iframe
                                className="w-full max-w-[450px] lg:max-w-[500px] h-full border-2 border-gray-300 rounded-md"
                                frameBorder="0"
                                title="map"
                                scrolling="no"
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d201.97305239501404!2d76.82542242006092!3d30.64230343961996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDM4JzMyLjAiTiA3NsKwNDknMzEuNiJF!5e1!3m2!1sen!2sin!4v1740806407662!5m2!1sen!2sin">
                            </iframe>
                        </div>
                    </div>
                </div>
            </section>
            
            <hr className="border-gray-300" />
            
            <div className="bg-gray-100 py-4 montserrat-400">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                            <button onClick={() => router("/privacy-policy")} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Privacy Policy</button>
                            <button onClick={() => router("/terms-and-conditions")} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Terms & Conditions</button>
                            <button onClick={() => router("/sales-and-refunds")} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Sales and Refunds</button>
                            <button onClick={() => router("/pricing-policy")} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Pricing Policy</button>
                        </div>
                        <p className="text-sm text-gray-600 text-center md:text-right mt-4 md:mt-0">© 2025 Sacred Mind Infotech Private Limited. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
