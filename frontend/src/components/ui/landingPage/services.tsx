import { useRef } from 'react';

const Services = () => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    
    const serviceItems = [
        {
            name: "Certified Courses for Students & Professionals",
            imgUrl: "https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            name: "Career Launch and Placements Support",
            imgUrl: "https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y291cnNlJTIwam9ifGVufDB8MXwwfHx8Mg%3D%3D"
        },
        {
            name: "Staffing Solutions for Companies",
            imgUrl: "https://img.freepik.com/free-photo/executive-touching-icon-social-network_1232-158.jpg?ga=GA1.1.2056236148.1743149273&semt=ais_hybrid"
        },
        {
            name: "Dropshipping and Shipment Services",
            imgUrl: "https://images.unsplash.com/photo-1631010231931-d2c396b444ec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJvcHNoaXBwaW5nfGVufDB8fDB8fHww"
        }
    ];

    return (
        <div className="relative w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold montserrat-700">
                        Our Services
                    </h1>
                    <p className="text-xl text-gray-600 lg:max-w-[50%]">
                        Get certified in the skills that are in most demand. We offer comprehensive training and placement support to help you succeed.
                    </p>
                </div>

                <div className="relative">
                    <div 
                        ref={scrollContainerRef}
                        className="grid grid-flow-col auto-cols-[70%] sm:auto-cols-[45%] md:auto-cols-[30%] lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 pr-4"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {serviceItems.map((service, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-lg aspect-square snap-start">
                                <img 
                                    src={service.imgUrl} 
                                    alt={service.name} 
                                    className="w-full h-full object-cover brightness-50 group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white montserrat-500">
                                        {service.name}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Services;
