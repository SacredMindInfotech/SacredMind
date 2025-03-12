
const UpcomingCourses = () => {


    return (
        <div className="relative w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 mb-16">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold montserrat-700">
                    Explore our upcoming courses
                    </h1>
                    <p className="text-xl text-gray-600 lg:max-w-[50%]">
                    Discover a world of learning opportunities through our upcoming courses, where industry experts and thought leaders will guide you in acquiring new expertise, expanding your horizons, and reaching your full potential.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="group relative overflow-hidden rounded-lg aspect-square">
                        <img 
                            src="https://images.pexels.com/photos/6325888/pexels-photo-6325888.jpeg?auto=compress&cs=tinysrgb&w=600" 
                            alt="Hands-on Training" 
                            className="w-full h-full object-cover brightness-50 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h3 className="text-2xl font-semibold text-white montserrat-500">
                                Hands-on Training
                            </h3>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-lg aspect-square">
                        <img 
                            src="https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                            alt="Get Certified" 
                            className="w-full h-full object-cover brightness-50 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h3 className="text-2xl font-semibold text-white montserrat-500">
                                Certified Courses
                            </h3>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-lg aspect-square">
                        <img 
                            src="https://images.pexels.com/photos/5905451/pexels-photo-5905451.jpeg?auto=compress&cs=tinysrgb&w=600" 
                            alt="Job-Focused Curriculum" 
                            className="w-full h-full object-cover brightness-50 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h3 className="text-2xl font-semibold text-white montserrat-500">
                                Job-Focused Curriculum
                            </h3>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-lg aspect-square">
                        <img 
                            src="https://images.unsplash.com/photo-1531379410502-63bfe8cdaf6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y291cnNlJTIwam9ifGVufDB8MXwwfHx8Mg%3D%3D" 
                            alt="Career Launch Support" 
                            className="w-full h-full object-cover brightness-50 group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h3 className="text-2xl font-semibold text-white montserrat-500">
                                Career Launch Support
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpcomingCourses;
