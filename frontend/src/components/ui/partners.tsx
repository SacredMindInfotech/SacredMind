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

    return (
        <div className="w-full mt-20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 ">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl montserrat-500 font-bold mb-8 sm:mb-12 text-center">
                    We collaborate with <span className="text-blue-600">leading companies</span>
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
                    {companies.map((company) => (
                        <div 
                            key={company.name} 
                            className="flex items-center justify-center p-4 bg-indigo-200 rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
                        >
                            <img
                                src={company.logo}
                                alt={`${company.name} logo`}
                                className="h-6 sm:h-8 md:h-10 w-auto object-contain  transition-all duration-300"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Partners;