import { useParams, useNavigate } from "react-router-dom";
import {  useEffect, useState } from "react";
import axios from "axios";
import {  useAuth, useUser } from "@clerk/clerk-react";

interface Course {
    id: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    categoryId: number;
    category: {
        name: string;
    };
    overview: string[] | null;
    learningOutcomes: string[] | null;
    requirements: string[] | null;
    forwhom: string[] | null;
    language: string;
}

const Course = () => {
    const { id } = useParams();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isSignedIn } = useAuth();
    const { getToken } = useAuth();
    const { user,isLoaded } = useUser();
    const [isPurchased, setIsPurchased] = useState<boolean>(false);

    useEffect(() => {
        const fetchIsPurchased = async () => {
            if (!isLoaded || !user) return;
        
            const token = await getToken();
        
            const res = await axios.get(`${backendUrl}api/v1/user/isPurchase/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    clerkuserId: user.id
                }
            });
            // @ts-ignore
            setIsPurchased(res.data.purchased);
        }
        fetchIsPurchased();
    }, [id,isLoaded,user]);

    useEffect(() => {
        const fetchCourse = async () => {
            const res = await axios.get(`${backendUrl}api/v1/course/${id}`);
            setCourse(res.data as Course);
            setLoading(false);
        }
        fetchCourse();
    }, [id]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]);


    const loadScript=(src:string)=>{
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    useEffect(() => {
        loadScript("https://checkout.razorpay.com/v1/checkout.js");
    }, []);

    const coursePayment =  async() => {
        try {

            if (!isSignedIn) {
                navigate('/?sign-in=true');
                return;
            }

            const token = await getToken();
            const res = await axios.post(`${backendUrl}api/v1/payment/${id}`,{}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const paymentObject=new (window as any).Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                // @ts-ignore
                order_id: res.data.order.id,
                // @ts-ignore
                amount: res.data.order.amount,
                // @ts-ignore
                currency: res.data.order.currency,
                // @ts-ignore
                name: "SacredMind Infotech",
                // @ts-ignore
                order_id: res.data.order.id,
                handler: async (response: any) => {

                    const razorpay_order_id=response.razorpay_order_id;
                    const razorpay_payment_id=response.razorpay_payment_id;
                    const razorpay_signature=response.razorpay_signature;

                    
                    console.log(user?.id);

                    const res=await axios.post(`${backendUrl}api/v1/paymentVerify/`,{
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                        courseId:id,
                        clerkUserId:user?.id
                    })
                    // @ts-ignore
                    if(res.status===200){
                        setIsPurchased(true);
                        // window.location.reload();
                    }
                    else{
                        alert("Payment Failed");
                    }
                }
            })
            paymentObject.open();

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : course && (
                <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
                    {/* Hero Section */}
                    <div className="text-center mb-8 sm:mb-16 p-4 sm:p-10 min-h-[40vh] sm:min-h-[50vh] flex flex-col justify-center items-center bg-gray-100">
                        <h1 className="text-3xl sm:text-6xl font-bold mb-4 montserrat-700">{course.title}</h1>
                        <div className="flex flex-wrap justify-center items-center">
                            <span
                                className="bg-white text-xs sm:text-sm m-2 sm:m-4 text-gray-800 px-4 sm:px-6 py-1 sm:py-2 rounded-full cursor-pointer hover:bg-gray-900 hover:text-white transition duration-200 montserrat-500"
                            >
                                <span className="mr-2">📚</span>
                                {course.category.name}
                            </span>
                            <p className="bg-white text-xs sm:text-sm m-2 sm:m-4 text-gray-800 px-4 sm:px-6 py-1 sm:py-2 rounded-full cursor-pointer hover:bg-gray-900 hover:text-white transition duration-200 montserrat-500">
                                <span className="mr-2">🌐</span>
                                {course.language}
                            </p>
                        </div>

                        <p className="text-base sm:text-xl text-gray-600">{course.description}</p>
                        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-4 sm:gap-6">
                            {id === "20" ? (
                                isPurchased ? (
                                    <div>
                                        <button
                                            onClick={() => navigate(`/course/${id}/content`)}
                                            className="cursor-pointer px-8 sm:px-12 py-2 sm:py-3 rounded-md border border-white bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary"
                                        >
                                            View Course Content
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => coursePayment()}
                                        className="cursor-pointer px-8 sm:px-12 py-2 sm:py-3 rounded-md border border-white bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary">
                                        Enroll Now
                                    </button>
                                )
                            ) : (
                                <button
                                    onClick={() => navigate("/contact")}
                                    className="cursor-pointer px-8 sm:px-12 py-2 sm:py-3 rounded-md border border-white bg-gray-900 text-white text-sm sm:text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary">
                                    Contact Us
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Course Details Section */}
                    <div className="flex flex-col lg:flex-row gap-6">

                        <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl montserrat-700">What you'll learn</span>
                                    <span className="text-xl">📚</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                                    {course.learningOutcomes?.map((item, index) => (
                                        <div key={index} className="flex items-start gap-2 bg-white p-3 rounded-md">
                                            <span className="text-green-500 text-lg">✓</span>
                                            <span className="text-gray-700 text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl montserrat-700">Requirements</span>
                                    <span className="text-xl">⚡</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                                    {course.requirements?.map((item, index) => (
                                        <div key={index} className="flex items-start gap-2 bg-white p-3 rounded-md">
                                            <span className="text-blue-500 text-lg">●</span>
                                            <span className="text-gray-700 text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl sm:text-2xl montserrat-700">Who this course is for</span>
                                    <span className="text-xl">👥</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                                    {course.forwhom?.map((item, index) => (
                                        <div key={index} className="flex items-start gap-2 bg-white p-3 rounded-md">
                                            <span className="text-purple-500 text-lg">→</span>
                                            <span className="text-gray-700 text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 sticky top-24 h-fit w-full lg:w-96 lg:block">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <span className="text-xl sm:text-2xl montserrat-700 text-gray-900">Course Overview</span>
                                <span className="text-2xl">📖</span>
                            </div>
                            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex flex-col gap-2">
                                    {course.overview?.map((item, index) => (
                                        <p key={index} className="text-gray-700 leading-relaxed text-base">{item}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>

                </div>
            )}
        </div>
    )
}

export default Course;
