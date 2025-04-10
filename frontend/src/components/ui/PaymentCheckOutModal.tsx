import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoadingScreen } from "./loadingScreen";
import { enrolledSuccessEvent } from "../../lib/pixel-event";
import { motion } from "framer-motion";

interface DiscountToken {
    id: number;
    courseIds: number[];
    discountPercentage: number;
    createdAt: Date;
    expiresAt: Date;
    isActive: boolean;
    token: string;
}

const PaymentCheckOutModal = ({ 
    id, 
    price, 
    clerkUserId, 
    courseName, 
    setShowCheckoutModal, 
    setPaymentSuccess 
}: { 
    id: number, 
    price: number, 
    clerkUserId: string, 
    courseName: string, 
    setShowCheckoutModal: (value: boolean) => void, 
    setPaymentSuccess: (value: boolean) => void 
}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { isSignedIn } = useUser();

    const [discountedPrice, setDiscountedPrice] = useState<number>(price);
    const [loading, setLoading] = useState<boolean>(true);
    const [discountToken, setDiscountToken] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Razorpay script
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
                const isTokenPresent = await axios.get(`${backendUrl}api/v1/course/${id}/discountToken`);
                
                // Set default discounted price first to prevent late updates
                setDiscountedPrice(price);
                
                //@ts-ignore
                if (!isTokenPresent.data.token) {
                    setLoading(false);
                    return;
                }
                
                //@ts-ignore
                const token = isTokenPresent.data.token;
                setDiscountToken(token);

                // We get discount token data from backend, if it's valid and not expired
                const res = await axios.get(`${backendUrl}api/v1/discountToken/${token}`);
                const discountTokenData = res.data as DiscountToken;

                if (res.status === 200) {
                    if (discountTokenData.courseIds.includes(Number(id)) &&
                        new Date(discountTokenData.expiresAt) > new Date() &&
                        discountTokenData.isActive) {
                        const calculatedPrice = Math.round((1 - discountTokenData.discountPercentage / 100) * price);
                        setDiscountedPrice(calculatedPrice);
                    }
                }
            } catch (error) {
                console.error("Error validating discount token:", error);
            } finally {
                setLoading(false);
            }
        }
        
        validateDiscountToken();
    }, [id, price, backendUrl]);

    function closeModal() {
        setShowCheckoutModal(false);
        document.body.style.overflow = "visible";
    }

    const coursePayment = async () => {
        try {
            const token = await getToken();
            const res = await axios.post(`${backendUrl}api/v1/createPaymentOrder/${id}`, {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                clerkUserId: clerkUserId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    discountToken: discountToken
                }
            });
            // @ts-ignore
            let orderDetails = res.data.order;
            // @ts-ignore
            let transactionId = res.data.transactionId;

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

                    const res = await axios.post(`${backendUrl}api/v1/verifyPayment/`, {
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                        courseId: id,
                        clerkUserId,
                        amount: orderDetails.amount / 100,
                        transactionId: transactionId,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone   
                    });
                    
                    if (res.status === 200) {
                        setPaymentSuccess(true);
                        enrolledSuccessEvent();
                        closeModal();
                        localStorage.removeItem(`pendingPayment_${id}`);
                        localStorage.removeItem(`${courseName}`);
                        window.location.reload();
                    } else {
                        alert("Payment Failed");
                    }
                }
            });

            paymentObject.open();
        } catch (error) {
            console.log(error);
            localStorage.removeItem(`pendingPayment_${id}`);
            navigate(`/course/${id}`);
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        coursePayment();
    }

    // Calculate the total amount including tax
    const totalAmount = discountedPrice + (discountedPrice * 0.18);
    const discount = price - discountedPrice;

    if (loading) return <LoadingScreen />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 overflow-y-auto bg-gray-600/60 backdrop-blur-lg flex items-center justify-center p-4 z-50"
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className={`bg-white mx-auto rounded-xl shadow-xl relative
                max-h-[90vh] overflow-y-auto
                p-4 sm:p-6 md:p-8 border-2 border-gray-200 ${isSignedIn ? 'w-full max-w-md' : 'w-full max-w-6xl'}`}
            >
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors z-10"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className={isSignedIn ? "" : "grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"}>
                    {/* Payment Details - Always shown */}
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="flex flex-col"
                    >
                        <div className="mb-6 flex items-center gap-3">
                            <img src="/logo.svg" alt="logo" className="w-8 h-8" />
                            <div className="text-sm montserrat-700 font-bold">SacredMind Infotech</div>
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold mb-6 montserrat-700">Payment Details</h2>

                        <div className="bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold montserrat-600 mb-2">Course:</h3>
                                <p className="text-gray-800 montserrat-500 mb-4 text-base sm:text-lg break-words">
                                    {courseName}
                                </p>
                                
                                <div className="space-y-3 divide-y divide-gray-200">
                                    <div className="flex justify-between text-gray-700 py-2">
                                        <div className="font-medium">Original Price</div>
                                        <div className="font-bold">₹{price.toFixed(2)}</div>
                                    </div>
                                    
                                    <div className="flex justify-between text-green-600 py-2">
                                        <div className="font-medium">Discount</div>
                                        <div className="font-bold">-₹{discount.toFixed(2)}</div>
                                    </div>
                                    
                                    <div className="flex justify-between text-gray-700 py-2">
                                        <div className="font-medium">After Discount</div>
                                        <div className="font-bold">₹{discountedPrice.toFixed(2)}</div>
                                    </div>
                                    
                                    <div className="flex justify-between text-gray-700 py-2">
                                        <div className="font-medium">GST (18%)</div>
                                        <div className="font-bold">₹{(discountedPrice * 0.18).toFixed(2)}</div>
                                    </div>
                                    
                                    <div className="flex justify-between py-3 font-bold text-lg">
                                        <div>Total Amount</div>
                                        <div className="text-violet-700">₹{totalAmount.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isSignedIn && (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={closeModal}
                                    className="w-full sm:w-auto px-5 py-3 text-sm font-medium rounded-md border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 montserrat-500"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.03, boxShadow: "4px 4px 0px 0px rgba(0,0,0)" }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={coursePayment}
                                    className="w-full sm:w-auto px-5 py-3 text-sm font-bold rounded-md border-2 border-gray-900 bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                >
                                    Pay ₹{totalAmount.toFixed(2)}
                                </motion.button>
                            </div>
                        )}
                    </motion.div>

                    {/* User Details Form - Only shown if not signed in */}
                    {!isSignedIn && (
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                            className="flex flex-col"
                        >
                            <h2 className="text-xl sm:text-2xl font-bold mb-6 montserrat-700">Contact Information</h2>
                            
                            <div className="bg-gradient-to-br from-purple-100 to-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 montserrat-500">
                                            Full Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent montserrat-400"
                                            placeholder="Enter your full name"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 montserrat-500">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent montserrat-400"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 montserrat-500">
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent montserrat-400"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="button"
                                            onClick={closeModal}
                                            className="w-full sm:w-auto px-5 py-3 text-sm font-medium rounded-md border-2 border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 montserrat-500"
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.03, boxShadow: "4px 4px 0px 0px rgba(0,0,0)" }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="w-full sm:w-auto px-5 py-3 text-sm font-bold rounded-md border-2 border-gray-900 bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:bg-white transition-all duration-200 montserrat-secondary"
                                        >
                                            Pay ₹{totalAmount.toFixed(2)}
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default PaymentCheckOutModal;