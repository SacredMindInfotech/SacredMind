import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
    const router = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex flex-col text-white w-full"
        >
            {/* Top Banner - Similar to navbar promo banner */}
            <div
                onClick={() => router("/contact")}
                className="flex justify-center items-center bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-white py-1 sm:py-1.5 md:py-2 cursor-pointer"
            >
                <div className="flex flex-col lg:flex-row justify-center items-center">
                    <p className="montserrat-500 text-xs sm:text-sm animate-pulse">🎓 Looking for customized training?</p>
                    <p className="montserrat-400 text-xs sm:text-sm text-gray-200 ml-2 md:ml-4">Contact our team for corporate training solutions</p>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="bg-white text-gray-900 py-6 sm:py-8 md:py-10 border-t border-gray-100 shadow-inner">
                <div className="container px-4 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
                        {/* Company info */}
                        <div className="col-span-1 md:col-span-2 space-y-4 sm:space-y-6">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="flex items-center gap-2 mb-4"
                            >
                                <img src="/logo.svg" alt="logo" className="w-8 h-8" />
                                <span className="montserrat-700 font-bold text-base hover:text-gray-600 transition-colors">SACRED MIND</span>
                            </motion.div>
                            <p className="text-gray-600 mb-6 montserrat-400 text-sm">Empowering learners with skills for tomorrow's technology challenges.</p>

                            <div className="grid grid-cols-1 gap-4 mb-6">
                                {[
                                    {
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                        ),
                                        title: "Email",
                                        value: "info@sacredmind.in"
                                    },
                                    {
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                            </svg>
                                        ),
                                        title: "Office",
                                        value: "Zirakpur, Punjab"
                                    },
                                    {
                                        icon: (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                            </svg>
                                        ),
                                        title: "Phone",
                                        value: "+91 90567-23484"
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 + (index * 0.1), duration: 0.3 }}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="text-gray-900 p-1.5 bg-gray-100 rounded-full mt-1">
                                            {item.icon}
                                        </span>
                                        <div>
                                            <h2 className="text-sm font-medium text-gray-900 mb-1 montserrat-500">{item.title}</h2>
                                            <p className="text-sm text-gray-600 montserrat-400">{item.value}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 montserrat-600">Connect With Us</h3>
                                <div className="flex space-x-4">
                                    {[
                                        {
                                            name: "Facebook",
                                            href: "https://www.facebook.com/sacredmindin",
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-5 w-5" viewBox="0 0 48 48">
                                                    <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                                                </svg>
                                            )
                                        },
                                        {
                                            name: "Instagram",
                                            href: "https://www.instagram.com/sacredmindinfotech/",
                                            icon: (
                                                <svg className="h-5 w-5" viewBox="0 0 2500 2500" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="0" cx="332.14" cy="2511.81" r="3263.54" gradientUnits="userSpaceOnUse"><stop offset=".09" stop-color="#fa8f21" /><stop offset=".78" stop-color="#d82d7e" /></radialGradient><radialGradient id="1" cx="1516.14" cy="2623.81" r="2572.12" gradientUnits="userSpaceOnUse"><stop offset=".64" stop-color="#8c3aaa" stop-opacity="0" /><stop offset="1" stop-color="#8c3aaa" /></radialGradient></defs><path d="M833.4,1250c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7S833.4,1480.11,833.4,1250m-225.26,0c0,354.5,287.36,641.86,641.86,641.86S1891.86,1604.5,1891.86,1250,1604.5,608.14,1250,608.14,608.14,895.5,608.14,1250M1767.27,582.69a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M745,2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27s373.28,1.31,505.15,7.27c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M734.65,7.57c-133.07,6.06-224,27.16-303.41,58.06C349,97.54,279.38,140.35,209.81,209.81S97.54,349,65.63,431.24c-30.9,79.46-52,170.34-58.06,303.41C1.41,867.93,0,910.54,0,1250s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43S349,2402.37,431.24,2434.37c79.56,30.9,170.34,52,303.41,58.06C868,2498.49,910.54,2500,1250,2500s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95,97.54,2068.86,65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17,1.51,1589.56,0,1250.1,0S868,1.41,734.65,7.57" fill="url(#0)" /><path d="M833.4,1250c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7S833.4,1480.11,833.4,1250m-225.26,0c0,354.5,287.36,641.86,641.86,641.86S1891.86,1604.5,1891.86,1250,1604.5,608.14,1250,608.14,608.14,895.5,608.14,1250M1767.27,582.69a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M745,2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27s373.28,1.31,505.15,7.27c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M734.65,7.57c-133.07,6.06-224,27.16-303.41,58.06C349,97.54,279.38,140.35,209.81,209.81S97.54,349,65.63,431.24c-30.9,79.46-52,170.34-58.06,303.41C1.41,867.93,0,910.54,0,1250s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43S349,2402.37,431.24,2434.37c79.56,30.9,170.34,52,303.41,58.06C868,2498.49,910.54,2500,1250,2500s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95,97.54,2068.86,65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17,1.51,1589.56,0,1250.1,0S868,1.41,734.65,7.57" fill="url(#1)" /></svg>
                                            )
                                        },
                                        {
                                            name: "X",
                                            href: "https://x.com/sacredmindin",
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-5 w-5" viewBox="0 0 30 30">
                                                    <path fill="currentColor" d="M 6 4 C 4.895 4 4 4.895 4 6 L 4 24 C 4 25.105 4.895 26 6 26 L 24 26 C 25.105 26 26 25.105 26 24 L 26 6 C 26 4.895 25.105 4 24 4 L 6 4 z M 8.6484375 9 L 13.259766 9 L 15.951172 12.847656 L 19.28125 9 L 20.732422 9 L 16.603516 13.78125 L 21.654297 21 L 17.042969 21 L 14.056641 16.730469 L 10.369141 21 L 8.8945312 21 L 13.400391 15.794922 L 8.6484375 9 z M 10.878906 10.183594 L 17.632812 19.810547 L 19.421875 19.810547 L 12.666016 10.183594 L 10.878906 10.183594 z"></path>
                                                </svg>
                                            )
                                        },
                                        {
                                            name: "Youtube",
                                            href: "https://www.youtube.com/@sacredMindInfotechPrivateLimit",
                                            icon: (
                                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-5 w-5" viewBox="0 0 48 48">
                                                    <path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"></path><path fill="#FFF" d="M20 31L20 17 32 24z"></path>
                                                </svg>
                                            )
                                        }
                                    ].map((item, index) => (
                                        <motion.a
                                            key={index}
                                            initial={{ y: 10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
                                            whileHover={{ scale: 1.2, y: -2 }}
                                            href={item.href}
                                            target="_blank"
                                            className="text-gray-600 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all duration-200"
                                        >
                                            <span className="sr-only">{item.name}</span>
                                            {item.icon}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Site Links - Explore */}
                        <div className="col-span-1 mt-6 md:mt-0">
                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.3 }}
                                className="text-base font-bold text-gray-900 mb-4 montserrat-600"
                            >
                                Explore
                            </motion.h3>
                            <ul className="space-y-3">
                                {[
                                    { path: "/", label: "Home" },
                                    { path: "/services", label: "Services" },
                                    { path: "/all-reviews", label: "Reviews" },
                                    { path: "/teach-with-us", label: "Teach with us" },
                                    { path: "/contact", label: "Contact us" },
                                    { path: "/careers", label: "Careers" },
                                    { path: "/purchases", label: "My Purchases" }
                                ].map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.8 + (index * 0.05), duration: 0.3 }}
                                    >
                                        <button
                                            onClick={() => router(item.path)}
                                            className="text-left px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-between cursor-pointer rounded-md w-full transition-colors duration-200 montserrat-500"
                                        >
                                            {item.label}
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Legal Links */}
                        <div className="col-span-1 mt-6 md:mt-0">
                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7, duration: 0.3 }}
                                className="text-base font-bold text-gray-900 mb-4 montserrat-600"
                            >
                                Legal
                            </motion.h3>
                            <ul className="space-y-3">
                                {[
                                    { path: "/privacy-policy", label: "Privacy Policy" },
                                    { path: "/terms-and-conditions", label: "Terms & Conditions" },
                                    { path: "/sales-and-refunds", label: "Sales and Refunds" },
                                    { path: "/pricing-policy", label: "Pricing Policy" }
                                ].map((item, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.9 + (index * 0.05), duration: 0.3 }}
                                    >
                                        <button
                                            onClick={() => router(item.path)}
                                            className="text-left px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-between cursor-pointer rounded-md w-full transition-colors duration-200 montserrat-500"
                                        >
                                            {item.label}
                                        </button>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>

                        {/* Google Map Section */}
                        <div className="col-span-1 lg:col-span-1 mt-6 md:mt-0">
                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.0, duration: 0.3 }}
                                className="text-base font-bold text-gray-900 mb-3 sm:mb-4 montserrat-600"
                            >
                                Our Location
                            </motion.h3>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.1, duration: 0.3 }}
                                whileHover={{ scale: 1.01 }}
                                className="w-full h-[200px] sm:h-[250px] overflow-hidden rounded-lg shadow-md"
                            >
                                <iframe className="w-full h-full border-0" src="https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d858.1759609649939!2d76.825422!3d30.642303!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDM4JzMyLjAiTiA3NsKwNDknMzEuNiJF!5e0!3m2!1sen!2sin!4v1744360160871!5m2!1sen!2sin" loading="lazy"></iframe>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom section with copyright */}
            <div className="bg-gray-900 py-3 sm:py-4">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-3 sm:gap-4">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.3 }}
                            className="text-xs sm:text-sm text-gray-400 text-center md:text-left mt-3 md:mt-0"
                        >
                            © 2025 Sacred Mind Infotech Private Limited. All rights reserved.
                        </motion.p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Footer;
