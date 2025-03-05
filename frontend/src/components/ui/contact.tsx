import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';

const Contact = (props: any) => {

    const notify = () => toast.success('Message Sent Successfully');

    const [isLoading, setIsLoading] = useState(false);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

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

    return (
        <section ref={props.ref} className="bg-white py-12">
            <Toaster />
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-16 min-h-[30vh] flex flex-col justify-center items-center bg-gray-100  ">

                    <h1 className="text-6xl font-bold mb-4 montserrat-700">Get in Touch</h1>

                    <p className="text-xl text-gray-600">Have questions? Send us a message and we'll get back to you shortly.</p>

                    

                </div>
                <div className="max-w-3xl mt-10 mb-10 mx-auto bg-white rounded-lg shadow-md p-6">
                        <form onSubmit={onSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Your message here..."
                                    required
                                ></textarea>
                            </div>

                            <div className="text-center">
                                {isLoading ? (
                                    <button
                                        type="submit"
                                        disabled
                                         className="px-12 py-3 rounded-md border border-white bg-gray-900 text-white text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary"
                                    >
                                        Sending...
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                         className="px-12 py-3 rounded-md border border-white bg-gray-900 text-white text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer"
                                    >
                                        Send Message
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
            </div>
        </section>
    );
}

export default Contact;