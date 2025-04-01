import { useNavigate } from "react-router-dom";

const CareerContact = (props: any) => {
    const router = useNavigate();



    return (

        <div className="relative lg:mb-32 sm:mb-16 mb-8 w-full h-full">

            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <section ref={props.ref} className="bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[50vh]">

                        {/* Left Section */}
                        <div className="flex flex-col justify-center px-4 md:px-[10%] py-16 bg-white">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 montserrat-700">
                                Careers
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                Gain a heritage. Leave a legacy.
                            </p>
                            <button
                                onClick={() => router("/careers")}
                                className="w-full max-w-48 md:w-48 px-6 py-4 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                            >
                                JOIN US
                            </button>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col justify-center px-4 md:px-[10%] py-16 bg-gray-100">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 montserrat-700">
                                Contact Us
                            </h1>
                            <p className="text-xl text-gray-600 mb-8">
                                What can we help you achieve.
                            </p>
                            <button
                                onClick={() => router("/contact")}
                                className="w-full max-w-48 md:w-48 px-6 py-4 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                            >
                                SPEAK TO US
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default CareerContact;