import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

const Contact = (props: any) => {

    const notify = () => toast.success('Message Sent Successfully');

    const [isLoading, setIsLoading] = useState(false);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY_CONTACTUS_FORM;

    const onSubmit = async (event: any) => {
        // alert("sending message")
        setIsLoading(true);
        event.preventDefault();
        const formData = new FormData(event.target);

        formData.append("access_key", accessKey);

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: json
        }).then((res) => res.json());

        if (res.success) {
            console.log("Success", res);
            notify();
            setIsLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="relative w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <section ref={props.ref} className="relative text-black">
                    {/* Content */}
                    <div className="relative z-10 container mx-auto">
                        <div className="flex flex-col">
                            {/* Left Section - Hero Content */}
                            <div className="flex flex-col p-8 md:p-16 lg:p-28 bg-gray-100 justify-center">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 montserrat-700">
                                    Contact Us
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-xl">
                                    Let's talk.
                                </p>
                                <div className="flex items-center gap-4 text-gray-900 montserrat-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                    <span className="text-base md:text-lg lg:text-xl">+91 90567-23482</span>
                                </div>
                            </div>

                            {/* Right Section - Form */}
                            <div className="flex px-4 md:px-16 lg:p-28 flex-col justify-center py-8 md:py-16">
                                <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-lg max-w-2xl mx-auto w-full">
                                    <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
                                        <div className="space-y-2">
                                            <span className="text-xl font-bold montserrat-500">Fill out the form our team will get back to you soon</span>
                                        </div>

                                        <div>
                                            <label htmlFor="name" className="block mb-2">Full Name *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="w-full px-4 py-3 border border-gray-900 placeholder-gray-400"
                                                placeholder="Full Name"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block mb-2">Email Address *</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="w-full px-4 py-3 border border-gray-900 placeholder-gray-400"
                                                placeholder="Email Address"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="block mb-2">Phone Number *</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                className="w-full px-4 py-3 border border-gray-900 placeholder-gray-400"
                                                placeholder="Phone Number"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block mb-2">Message *</label>
                                            <textarea
                                                name="message"
                                                rows={5}
                                                className="w-full px-4 py-3 border border-gray-900 placeholder-gray-400 resize-none"
                                                placeholder="Your message here..."
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full md:w-48 px-6 py-4 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                                            >
                                                {isLoading ? 'SENDING...' : 'SPEAK WITH US'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
            <Toaster />
        </div>
    );
}

export default Contact;