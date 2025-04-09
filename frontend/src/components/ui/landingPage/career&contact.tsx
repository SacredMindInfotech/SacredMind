import { useNavigate } from "react-router-dom";

const CareerContact = (props: any) => {
    const router = useNavigate();

    return (
        <div className="relative mb-10 w-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-8 sm:py-12 md:py-16">
                <section ref={props.ref} className="bg-white rounded-lg overflow-hidden shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left Section */}
                        <div className="flex flex-col justify-center items-start px-6 sm:px-8 md:px-[10%] py-10 sm:py-12 md:py-16 bg-white">
                            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 montserrat-700">
                                Careers
                            </div>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 italic">
                                Gain a heritage. Leave a legacy.
                            </p>
                            <button
                                onClick={() => router("/careers")}
                                className="w-full sm:w-auto px-6 py-3 sm:py-4 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                            >
                                JOIN US
                            </button>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col justify-center items-start px-6 sm:px-8 md:px-[10%] py-10 sm:py-12 md:py-16 bg-gray-100">
                            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 montserrat-700">
                                Contact Us
                            </div>
                            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 italic">
                                What can we help you achieve.
                            </p>
                            <button
                                onClick={() => router("/contact")}
                                className="w-full sm:w-auto px-6 py-3 sm:py-4 rounded-md border shadow-[4px_4px_0px_0px_rgba(0,0,0)] text-black border-gray-900 bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
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