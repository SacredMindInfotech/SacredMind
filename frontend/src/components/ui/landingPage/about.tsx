import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const About = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const aboutItems = [
        {
            name: "Quality Education",
            description: "Providing excellence through online and offline courses",
            imgUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3"
        },
        {
            name: "Industry Certification",
            description: "CBCE Skill India (CBCE-PB0991) certified programs",
            imgUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3"
        },
        {
            name: "Tailored Courses",
            description: "Custom learning paths focused on industry-ready skills",
            imgUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3"
        }
    ];

    const getOptimizedImage = (url: string, width: number) => {
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}w=${width}&auto=format&fit=crop`;
    };


    return (
        <div className="relative w-full h-full" >
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-16">
                    <div className="text-4xl relative md:text-5xl lg:text-6xl font-bold montserrat-700">
                        About Us
                        <svg
                            className='absolute left-5 top-10 sm:top-12 lg:top-14 bottom-0 translate-y-1 w-[200px] sm:w-[300px]'
                            viewBox="0 0 563 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <motion.path
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut",
                                }}
                                d="M0.949448 28.8373C347.022 4.27447 825.974 -16.0579 384.378 24.2907" stroke="#F4CC15" strokeWidth="5" />
                        </svg>
                    </div>
                    <p className="text-xl text-gray-600 montserrat-400 lg:max-w-[50%]">
                        SacredMind Pvt Ltd is a multi-product-based coaching institute providing quality education through online and offline courses. <span  onClick={
                            () => {
                                navigate("/about-us");
                            }
                        } className='montserrat-700 text-base text-black cursor-pointer text underline'>Read More</span>
                    </p>
                </div>

                <div className="relative">
                    <div
                        ref={scrollContainerRef}
                        className="grid grid-flow-col auto-cols-[70%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:grid-flow-row lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pr-4 lg:overflow-visible"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {aboutItems.map((item, index) => (
                            <div key={index} onClick={() => {
                                navigate(`/about-us`);
                            }} className="group cursor-pointer relative overflow-hidden rounded-lg aspect-square snap-start">
                                <img
                                    src={getOptimizedImage(item.imgUrl, 480)}
                                    srcSet={`
                                                ${getOptimizedImage(item.imgUrl, 320)} 320w,
                                                ${getOptimizedImage(item.imgUrl, 480)} 480w,
                                                ${getOptimizedImage(item.imgUrl, 768)} 768w,
                                                ${getOptimizedImage(item.imgUrl, 1024)} 1024w
                                           `}
                                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 30vw, 25vw"
                                    alt={item.name}
                                    className="w-full h-full object-cover brightness-50 group-hover:scale-110 transition-transform duration-500"
                                />

                                <div className="absolute bottom-0 left-0 p-4 w-full">
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white montserrat-500">
                                        {item.name}
                                    </h3>
                                    <p className="text-white text-sm md:text-base mt-2 opacity-90">
                                        {item.name === "Industry Certification" ? (
                                            <span>CBCE Skill India <strong>(CBCE-PB0991)</strong> certified programs</span>
                                        ) : item.name === "Quality Education" ? (
                                            <span>Providing excellence through <strong>online and offline</strong> courses</span>
                                        ) : (
                                            item.description
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
