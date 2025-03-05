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
        <div className="w-full py-5 px-2 bg-indigo-200 ">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl montserrat-500 font-bold mb-6">
                    We collaborate with <span className="text-blue-600">leading companies</span>
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                    {companies.map((company) => (
                        <div key={company.name} className="flex flex-col  gap-2 p-2 hover:scale-105 transition-all duration-300">
                            <img
                                src={company.logo}
                                alt={`${company.name} logo`}
                                className="h-7 object-contain  hover:grayscale-0 transition-all duration-300"
                            />
                            {/* <p className="text-sm  montserrat-400 " >{company.name}</p> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Partners;