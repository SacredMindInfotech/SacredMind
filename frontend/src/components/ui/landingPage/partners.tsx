import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";

const Partners = () => {
    const companies = [
        { name: 'Concentrix', logo: '/logos/concentrix.png' },
        { name: 'Teleperformance', logo: '/logos/tp.svg' },
        { name: 'Axis Bank', logo: '/logos/axisbank.png' },
        { name: 'Tech Mahindra', logo: '/logos/techm_logo.svg' },
        { name: 'Canara Bank', logo: '/logos/canarabank.png' },
        { name: 'eClerx', logo: '/logos/eclerx.png' },
        { name: 'Task Us', logo: '/logos/taskus.png' },
        { name: 'Bebo IT', logo: '/logos/bebo.png' },
        { name: 'CBSL Group', logo: '/logos/cbsl.png' },
        { name: 'Club Malwa', logo: '/logos/clubmalwa.png' },
    ];

    // Define animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [controls, isInView]);

    return (
        <div className="w-full min-h-[500px] mt-20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8" ref={ref}>
            <div className="max-w-7xl mx-auto">
                <div className="text-2xl sm:text-3xl md:text-4xl montserrat-500 font-bold mb-8 sm:mb-12 text-center">
                    We collaborate with <span className="text-blue-600 relative">leading companies
                        <svg

                            className="absolute -left-2 -right-2 -top-5 bottom-0 translate-y-1" viewBox="0 0 452 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <motion.path
                                initial={{ pathLength: 0 }}
                                whileInView={{ pathLength: 1 }}
                                transition={{
                                    duration: 1.25,
                                    ease: "easeInOut",
                                }}
                                d="M451.5 50C451.5 53.288 449.996 56.5426 447.041 59.7372C444.084 62.9345 439.698 66.0427 434.008 69.0192C422.628 74.9716 406.129 80.3471 385.698 84.8671C344.845 93.9054 288.383 99.5 226 99.5C163.617 99.5 107.155 93.9054 66.3019 84.8671C45.8713 80.3471 29.3717 74.9716 17.9919 69.0192C12.3015 66.0427 7.91585 62.9345 4.95858 59.7372C2.00374 56.5426 0.5 53.288 0.5 50C0.5 46.712 2.00374 43.4574 4.95858 40.2628C7.91585 37.0655 12.3015 33.9573 17.9919 30.9808C29.3717 25.0284 45.8713 19.6529 66.3019 15.1329C107.155 6.09458 163.617 0.5 226 0.5C288.383 0.5 344.845 6.09458 385.698 15.1329C406.129 19.6529 422.628 25.0284 434.008 30.9808C439.698 33.9573 444.084 37.0655 447.041 40.2628C449.996 43.4574 451.5 46.712 451.5 50Z" stroke="#F4CC15" strokeWidth={3} />
                        </svg>

                    </span>
                </div>

                <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                >
                    {companies.map((company) => (
                        <motion.div
                            key={company.name}
                            className="flex items-center justify-center p-4 bg-indigo-200 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                            variants={itemVariants}
                        >
                            <img
                                src={company.logo}
                                alt={`${company.name} logo`}
                                className="h-6 sm:h-8 md:h-10 w-auto object-contain transition-all duration-300"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Partners;