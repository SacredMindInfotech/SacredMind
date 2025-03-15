import { useEffect } from "react"


const PricingPolicy=()=>{

    useEffect(()=>{
        window.scrollTo({top:0,behavior:"smooth"})
    },[])

    return(
        <div className="relative w-full h-full">
        <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-16">
            <section className="relative text-black">
                <div className="relative z-10 container mx-auto">
                    <div className="flex flex-col gap-12">
                        <div className="flex flex-col p-8 md:p-16 lg:p-28 bg-gray-100 justify-center">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 montserrat-700">
                                Pricing Policy
                            </h1>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-4 md:p-8 rounded-lg max-w-2xl mx-auto w-full">
                            <div className="space-y-6">
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Sacred Mind Infotech</h2>
                                        <p className="text-gray-600">
                                        At Sacredmind Infotech, we strive to offer high-quality courses at competitive prices while ensuring a seamless and transparent pricing structure. Our pricing policy is designed to provide affordability, value for money, and rewarding incentives for our learners.
                                        </p>
                                    </div>                                    

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Course Pricing</h3>
                                        <p className="text-gray-600 mb-3">
                                            All courses are priced based on their content, duration, and industry demand.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            Prices may vary based on promotions, offers, and seasonal discounts.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            The final course price is inclusive of all applicable taxes.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Payment Methods</h3>
                                        <p className="text-gray-600 mb-3">
                                            We accept payments through various modes, including credit/debit cards, net banking, UPI, and digital wallets.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            EMI options may be available for select courses through partnered payment providers.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            All transactions are secured using encrypted payment gateways.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Referral Scheme</h3>
                                        <p className="text-gray-600 mb-3">
                                            Earn Rewards! If a candidate refers someone who purchases a course, they will receive a discount coupon of up to ₹3000.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            The referred candidate must complete the purchase for the referrer to be eligible for the reward.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            Discount coupons earned through referrals can be applied to future course enrollments.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            Sacredmind Infotech reserves the right to modify or discontinue the referral program at any time.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">4. Discounts & Offers</h3>
                                        <p className="text-gray-600 mb-3">
                                            We offer seasonal discounts, early-bird offers, and bulk purchase discounts.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            Special discounts may be available for students, professionals, and corporate enrollments.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            All discounts and promotions are subject to terms and conditions.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">5. Refund & Cancellation Policy</h3>
                                        <p className="text-gray-600 mb-3">
                                            Course fees once paid are non-refundable except in exceptional cases where Sacredmind Infotech determines eligibility.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            Requests for cancellations must be made within the stipulated timeframe mentioned for each course.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            Refund requests will be processed as per the terms stated in the individual course agreement.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800 mb-3">6. Policy Updates</h3>
                                        <p className="text-gray-600 mb-3">
                                            Sacredmind Infotech reserves the right to modify, update, or discontinue any pricing-related policies without prior notice.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            Users are encouraged to review this policy periodically for any changes.
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            For any queries regarding our pricing policy, please contact our support team at <p className="font-bold">info@sacredmind.in</p>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    )
}

export default PricingPolicy;