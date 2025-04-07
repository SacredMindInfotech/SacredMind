import { useEffect } from "react";
import { reviews } from "./reviews";

interface Review {
    name: string;
    designation: string;
    rating: number;
    review: string;
}

const allReviews: Review[] = reviews;

const Reviews = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="relative w-full h-full">
            <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
                <section className="relative text-black">
                    <div className="relative z-10 container mx-auto">
                        <div className="flex flex-col">
                            <div className="flex flex-col p-8 md:p-16 lg:p-28 bg-gray-100 justify-center">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 montserrat-700">
                                    Student Reviews
                                </h1>
                                <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-xl montserrat-500">
                                    What our students say about their learning journey
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 md:p-16">
                                {allReviews.map((review, index) => (
                                    <div key={index} className="flex flex-col bg-white shadow-lg rounded-lg overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-center mb-4">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <svg key={i} className="w-5 h-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <p className="text-gray-800 mb-4 montserrat-400">{review.review}</p>
                                            <div className="mt-4">
                                                <p className="font-bold text-gray-900 montserrat-700">{review.name}</p>
                                                <p className="text-gray-600 montserrat-500">{review.designation}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Reviews;
