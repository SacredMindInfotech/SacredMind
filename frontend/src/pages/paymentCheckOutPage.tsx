import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { enrolledSuccessEvent } from "../lib/pixel-event";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingScreen } from "../components/ui/loadingScreen";


interface DiscountToken {
    id: number;
    courseIds: number[];
    discountPercentage: number;
    createdAt: Date;
    expiresAt: Date;
    isActive: boolean;
    token: string;
}


const PaymentCheckOutModal = ({ id, price, clerkUserId, courseName, setShowCheckoutModal }: { id: string, price: number, clerkUserId: string, courseName: string, setShowCheckoutModal: (value: boolean) => void }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [discountedPrice, setDiscountedPrice] = useState<number>(price);
    const [loading, setLoading] = useState<boolean>(false);



    //razorpay script
    const loadScript = (src: string) => {
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const validateDiscountToken = async () => {
            try {
                setLoading(true);
                const discountToken = localStorage.getItem("discount_code");
                if (!discountToken) return;

                const res = await axios.get(`${backendUrl}api/v1/discountToken/${discountToken}`);
                const discountTokenData = res.data as DiscountToken;

                console.log("real price", price);
                if (res.status === 200) {
                    let discountPrice = price;
                    if (discountTokenData.courseIds.includes(Number(id)) &&
                        new Date(discountTokenData.expiresAt) > new Date() &&
                        discountTokenData.isActive) {
                        discountPrice = Math.round((1 - discountTokenData.discountPercentage / 100) * price)
                    }
                    setDiscountedPrice(discountPrice);
                    console.log("discounted price", discountPrice);
                }
            } catch (error) {
                console.error("Error validating discount token:", error);
            }
            setLoading(false);
        }
        validateDiscountToken();
    }, [id, price, backendUrl])


    const coursePayment = async () => {
        try {
            const token = await getToken();
            const discountToken = localStorage.getItem("discount_code");
            const res = await axios.post(`${backendUrl}api/v1/payment/${id}`,{}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    discountToken: discountToken
                }
            });
            // @ts-ignore
            let orderDetails = res.data.order;

            const paymentObject = new (window as any).Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                order_id: orderDetails.id,
                amount: orderDetails.amount,
                currency: orderDetails.currency,
                name: "SacredMind Infotech",
                handler: async (response: any) => {

                    const razorpay_order_id = response.razorpay_order_id;
                    const razorpay_payment_id = response.razorpay_payment_id;
                    const razorpay_signature = response.razorpay_signature;


                    const res = await axios.post(`${backendUrl}api/v1/paymentVerify/`, {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                        courseId: id,
                        clerkUserId,
                        amount: orderDetails.amount / 100
                    })
                    if (res.status === 200) {
                        enrolledSuccessEvent();
                        localStorage.removeItem(`pendingPayment_${id}`);
                        localStorage.removeItem("discount_code");
                        navigate(`/course/${id}`);
                    }
                    else {
                        alert("Payment Failed");
                    }
                }
            })

            paymentObject.open();

        } catch (error) {
            console.log(error);
            localStorage.removeItem(`pendingPayment_${id}`);
            navigate(`/course/${id}`);
        }
    }

    if (loading) return <LoadingScreen />

    return (
        <div className=" bg-gradient-to-r from-gray-100 via-gray-400 to-yellow-200
         min-h-[70vh] w-full max-w-xl mx-auto p-4 sm:p-6 rounded-md shadow-lg relative overflow-y-auto">
            {/* Close button */}
            <button 
                onClick={() => setShowCheckoutModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label="Close modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <div className="mt-6 sm:mt-10 ml-4 sm:ml-10 flex items-center gap-3 sm:gap-5">
                <img src="/logo.svg" alt="logo" className="w-8 h-8 sm:w-10 sm:h-10" />
                <div className="text-xs montserrat-500 font-bold">SacredMind Infotech</div>
            </div>
            <div className="flex flex-col">

                <div className="text-xs p-4 sm:p-10 montserrat-secondary">Payment for <br />
                    <span className="font-bold text-lg sm:text-xl break-words"> {courseName}
                    </span>
                </div>

                <div className="p-4 sm:p-10 bg-gray-50 rounded-lg mx-2 sm:mx-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                            <div>Original Price</div>
                            <div>₹{price}</div>
                        </div>
                        <div className="flex justify-between text-green-600 text-sm sm:text-base">
                            <div>Discount</div>
                            <div>-₹{price - discountedPrice}</div>
                        </div>
                        <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                            <div>After Discount</div>
                            <div>₹{discountedPrice}</div>
                        </div>
                        <div className="flex justify-between text-gray-700 text-sm sm:text-base">
                            <div>GST</div>
                            <div>₹{(discountedPrice * 0.18)}</div>
                        </div>
                        <hr className="my-4 border-gray-300" />
                        <div className="flex justify-between font-bold text-base sm:text-lg">
                            <div>Total</div>
                            <div>₹{(discountedPrice + (discountedPrice * 0.18))}</div>
                        </div>
                    </div>
                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between">
                        <button
                            onClick={() => setShowCheckoutModal(false)}
                            className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap text-sm sm:text-base"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={coursePayment}
                            className="px-6 py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap font-bold text-sm sm:text-base"
                        >
                            Pay ₹{(discountedPrice + (discountedPrice * 0.18))}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default PaymentCheckOutModal;