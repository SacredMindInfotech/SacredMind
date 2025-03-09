const Footer = () => {
    return (
        <section className="bg-gray-100 min-h-[200px]">
            <div className="container px-3 py-2 mx-auto">
                <div>
                    <div className="flex flex-row gap-2 m-3 ">
                        <img src="/logo.svg" alt="logo" className="w-10 h-10" />
                        <p className="text-lg text-gray-900 font-black montserrat-700">Sacred Mind Infotech Private Limited</p>
                    </div>
                    <p className="ml-3 mb-3 text-sm font-medium text-blue-500">Contact us</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-40 mt-2">
                    <div className="flex flex-col md:flex-row gap-4 w-full pl-3 lg:w-1/2">
                        <div className="w-full md:w-1/3">
                            <span className="inline-block p-1.5 text-blue-500 rounded-full bg-blue-100/80">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3 h-3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                            </span>

                            <h2 className="mt-2 text-xs font-medium text-gray-900 ">Email</h2>
                            <p className="mt-0.5 text-xs text-gray-500">Our friendly team is here to help.</p>
                            <p className="mt-0.5 text-xs text-blue-500">info@sacredmind.in</p>
                        </div>

                        <div className="w-full md:w-1/3">
                            <span className="inline-block p-1.5 text-blue-500 rounded-full bg-blue-100/80">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3 h-3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                </svg>
                            </span>

                            <h2 className="mt-2 text-xs font-medium text-gray-8900 ">Office</h2>
                            <p className="mt-0.5 text-xs text-gray-500">Come say hello at our office.</p>
                            <p className="mt-0.5 text-xs text-blue-500">Showroom No. 6, Second Floor, Garg Complex, Lajpat Nagar, Bishanpura, Zirakpur, Punjab</p>
                        </div>

                        <div className="w-full md:w-1/3">
                            <span className="inline-block p-1.5 text-blue-500 rounded-full bg-blue-100/80">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3 h-3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </span>

                            <h2 className="mt-2 text-xs font-medium text-gray-8900 ">Phone</h2>
                            <p className="mt-0.5 text-xs text-gray-500">Mon-Sat from 9am to 5pm.</p>
                            <p className="mt-0.5 text-xs text-blue-500">+91 90567-23482</p>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 h-[200px]">
                        <iframe
                            className="w-full lg:w-[25vw] -mt-5 h-full border-2 border-gray-900"
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
