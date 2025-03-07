const Footer = () => {
    return (
        <section className="bg-gray-900">
            <div className="container px-4 py-8 mx-auto">
                <div>
                    <p className="text-xl text-white font-black montserrat-700 mb-2">Sacred Mind Infotech Private Limited</p>
                    <p className="font-medium text-blue-500 dark:text-blue-400">Contact us</p>
                </div>

                <div className="grid grid-cols-1 gap-8 mt-6 montserrat-400 md:grid-cols-2 lg:grid-cols-3">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-1">
                        <div>
                            <span className="inline-block p-2 text-blue-500 rounded-full bg-blue-100/80 dark:bg-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </span>

                            <h2 className="mt-3 text-sm font-medium text-gray-800 dark:text-white">Email</h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Our friendly team is here to help.</p>
                            <p className="mt-1 text-xs text-blue-500 dark:text-blue-400">info@sacredmind.in</p>
                        </div>

                        <div>
                            <span className="inline-block p-2 text-blue-500 rounded-full bg-blue-100/80 dark:bg-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </span>

                            <h2 className="mt-3 text-sm font-medium text-gray-800 dark:text-white">Office</h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Come say hello at our office.</p>
                            <p className="mt-1 text-xs text-blue-500 dark:text-blue-400">
                                Showroom No. 6, Second Floor, Garg Complex, Lajpat Nagar, Bishanpura, Zirakpur, Sub Tehsil Zirakpur, Distt. SAS Nagar, Mohali, Punjab
                            </p>
                        </div>

                        <div>
                            <span className="inline-block p-2 text-blue-500 rounded-full bg-blue-100/80 dark:bg-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-4 h-4">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </span>

                            <h2 className="mt-3 text-sm font-medium text-gray-800 dark:text-white">Phone</h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Mon-Sat from 9am to 5pm.</p>
                            <p className="mt-1 text-xs text-blue-500 dark:text-blue-400">+91 90567-23482</p>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-lg lg:col-span-2 mx-auto mt-8 lg:mt-0 w-full h-[300px] md:h-[400px] lg:h-full">
                        <iframe 
                            className="w-full h-full"
                            frameBorder="0" 
                            title="map" 
                            scrolling="no" 
                            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d201.97305239501404!2d76.82542242006092!3d30.64230343961996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDM4JzMyLjAiTiA3NsKwNDknMzEuNiJF!5e1!3m2!1sen!2sin!4v1740806407662!5m2!1sen!2sin">
                        </iframe>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Footer;
