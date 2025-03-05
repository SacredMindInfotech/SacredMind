import { useEffect } from "react";

const Teaching = () => {

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    
    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="text-center mb-16 min-h-[50vh] flex flex-col justify-center items-center bg-gray-100  ">
                    <h1 className="text-6xl font-bold mb-4 montserrat-700 ">Come teach with us</h1>
                    <p className="text-xl text-gray-600">Become an instructor and change lives — including your own</p>
                </div>


                <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-16">
                    <div className="text-2xl font-semibold mb-4 montserrat-500 ">~Why work with us~</div>
                    <div className="flex flex-col gap-4">
                        <p className="montserrat-500 text-gray-600">
                            We believe that education is a right, not a privilege. We're building a platform that empowers educators to share their knowledge and skills with anyone, anywhere.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <h2 className="text-2xl font-semibold mb-4 montserrat-500 ">Teach your way</h2>
                            <p className="text-gray-600 montserrat-400 ">Publish the course you want, in the way you want, and always have control of your own content.</p>
                        </div>

                        <div className="text-center p-6">
                            <h2 className="text-2xl font-semibold mb-4 montserrat-500 ">Inspire learners</h2>
                            <p className="text-gray-600 montserrat-400 ">Teach what you know and help learners explore their interests, gain new skills, and advance their careers.</p>
                        </div>

                        <div className="text-center p-6">
                            <h2 className="text-2xl font-semibold mb-4 montserrat-500 ">Get rewarded</h2>
                            <p className="text-gray-600 montserrat-400 ">Expand your professional network, build your expertise, and earn money on each paid enrollment.</p>
                        </div>
                    </div>
                </div>

                <div className="text-center mb-16 min-h-[50vh] flex flex-col justify-center items-center bg-gray-100  ">
                    <h1 className="text-6xl font-bold mb-4 montserrat-700 ">Send us your application</h1>
                    <p className="text-xl text-gray-600 mt-4">Email us at <a href="mailto:hr@sacredmind.in" className="montserrat-500 hover:underline">hr@sacredmind.in</a></p>
                </div>


            </div>
        </div>
    )
}

export default Teaching;
