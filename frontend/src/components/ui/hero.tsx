import { SignedOut, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Hero = ({ scrollToContact }: { scrollToContact: () => void }) => {
    const { getToken } = useAuth();
    const router = useNavigate();

    async function tokenProvider() {
        const token = await getToken();
        console.log(token);
    }
    tokenProvider();

    return (
        <div className="w-full">
            <div className="flex flex-col md:flex-row   mt-28 justify-between max-w-7xl mx-auto px-4 gap-40 relative">
                <div className="flex flex-col gap-5 items-start text-left w-full lg:w-1/2">
                    <h1 className="montserrat-700 text-5xl md:text-7xl font-black " >Beyond Limits, Beyond Learning</h1>
                    <p className="text-xl md:text-4xl montserrat-400 mt-3 text-gray-700">
                        A platform that helps you grow in your career
                    </p>
                    <div className="flex gap-4">
                        <SignedOut>
                            <button
                                onClick={() => router("?sign-in=true")}
                                className="px-6 sm:px-12 py-2 sm:py-3 text-sm sm:text-base rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer"
                            >
                                Join
                            </button>
                        </SignedOut>

                        <button
                            onClick={() => scrollToContact()}
                            className="px-6 sm:px-12 py-2 sm:py-3 text-sm sm:text-base rounded-md border shadow-[4px_4px_0px_0px_rgba(0,0,0)] text-black border-gray-900 bg-white transition duration-200 montserrat-secondary cursor-pointer relative"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-7 sm:w-7 absolute -top-3 -right-3 text-yellow-400 drop-shadow-md" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Book a free consultation
                        </button>
                    </div>

                    <p className="text-sm md:text-lg montserrat-400 mt-3 text-gray-700">
                        Learn from the best in the industry in best way possible
                    </p>
                </div>

                <div className="hidden lg:flex lg:w-1/2 justify-center">
                    <img
                        src="/hero.svg"
                        alt="Learning Illustration"
                        className="w-full max-w-lg h-[400px]"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;