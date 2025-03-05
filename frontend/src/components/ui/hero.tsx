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


            <div className="flex flex-col md:flex-row min-h-[80vh] mt-28 justify-between max-w-7xl mx-auto px-4 gap-40 relative">


                <div className="flex flex-col gap-5 items-start text-left md:w-1/2">
                    <h1 className="montserrat-700 text-5xl md:text-7xl font-black " >Beyond Limits, Beyond Learning</h1>
                    <p className="text-xl md:text-4xl montserrat-400 mt-3 text-gray-700">
                        A platform that helps you grow in your career
                    </p>
                    <div className="flex gap-4">
                        <SignedOut>
                            <button
                                onClick={() => router("?sign-in=true")}
                                className="px-12 py-3 rounded-md border border-white bg-gray-900 text-white text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer"
                            >
                                Join
                            </button>
                        </SignedOut>

                        <button
                            onClick={() => scrollToContact()}
                            className="px-12 py-3 rounded-md border border-white bg-gray-900 text-white text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer"
                        >
                            Book a Call
                        </button>
                    </div>

                    <p className="text-sm md:text-lg montserrat-400 mt-3 text-gray-700">
                        Learn from the best in the industry in best way possible
                    </p>
                </div>

                <div className="md:w-1/2 flex justify-center">
                    <img
                        src="/hero.png"
                        alt="Learning Illustration"
                        className="w-full max-w-lg h-96 border-2  rounded-lg"
                    // style={{height: "100vh", width: "100vw"}}
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;