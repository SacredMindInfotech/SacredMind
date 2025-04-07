import { Link } from "react-router-dom";

const reviews = [
    {
        name: "Priya Sharma",
        designation: "HR Professional",
        rating: 5,
        review: "The HR Payroll and Management course at Sacredmind Infotech was exactly what I needed to advance my career. The offline classes provided hands-on experience with real HR software and practical scenarios. The instructors were industry experts who shared valuable insights from their experience.",
        image: "" // You can add an image URL if needed
    },
    {
        name: "Rahul Patel",
        designation: "Business Analyst",
        rating: 5,
        review: "I took the Communication Skills course at Sacredmind Infotech, and it transformed my professional interactions. The in-person training sessions were interactive and helped me build confidence in public speaking and business communication. The practical exercises and role-play scenarios were particularly beneficial.",
        image: ""
    },
    {
        name: "Anjali Desai",
        designation: "HR Executive",
        rating: 5,
        review: "Enrolling in Sacredmind Infotech's offline HR course was one of the best career decisions I've made. The comprehensive curriculum covered everything from payroll management to employee relations. The small batch size ensured personalized attention, and the practical assignments helped me apply the concepts in real-world situations.",
        
    }
];

const Reviews = () => {
    return (
        <div>
            <section className="py-12 sm:py-16 lg:py-20">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center">
                        <div className="text-center">
                            <p className="text-lg font-medium text-gray-600 montserrat-500 font-pj">151 people have said how good our courses are</p>
                            <h2 className="mt-4 text-3xl font-bold montserrat-700 text-gray-900 sm:text-4xl xl:text-5xl font-pj">Our <span className="text-yellow-600">
                            successful students
                                </span> say about us</h2>
                        </div>


                        <div className="relative mt-10 md:mt-24 md:order-2">
                            <div className="absolute -inset-x-1 inset-y-16 md:-inset-x-2 md:-inset-y-6">
                                <div className="w-full h-full max-w-5xl mx-auto rounded-3xl opacity-30 blur-lg filter background: linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)"></div>
                            </div>

                            <div className="relative grid max-w-lg grid-cols-1 gap-6 mx-auto md:max-w-none lg:gap-10 md:grid-cols-3">
                                {reviews.map((review, index) => (
                                    <div key={index} className="flex flex-col overflow-hidden shadow-xl">
                                        <div className="flex flex-col justify-between flex-1 p-6 bg-white lg:py-8 lg:px-7">
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <svg key={i} className="w-5 h-5 text-[#FDB241]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>

                                                <blockquote className="flex-1 mt-8">
                                                    <p className="text-sm leading-relaxed montserrat-400 text-gray-900 font-pj">{review.review}</p>
                                                </blockquote>
                                            </div>

                                            <div className="flex items-center mt-8">
                                                <div className="ml-4">
                                                    <p className="text-base font-bold montserrat-700 text-gray-900 font-pj">{review.name}</p>
                                                    <p className="mt-0.5 text-sm font-pj montserrat-400 text-gray-600">{review.designation}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                       
                    </div>
                    <div className="flex justify-center">
                        <Link to="/all-reviews" className="mt-10 underline text-sm font-pj montserrat-400 text-gray-600">
                            View All 151 Reviews
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Reviews;