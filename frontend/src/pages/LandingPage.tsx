import Services from "../components/ui/landingPage/services";
import Hero from "../components/ui/landingPage/hero";
import Partners from "../components/ui/landingPage/partners";
import { useRef } from "react";
import CareerContact from "../components/ui/landingPage/career&contact";
import { holiOfferBannerClickedEvent } from "../lib/pixel-event";
import UpcomingCourses from "../components/ui/landingPage/upcomingCourses";
import PopularCourses from "../components/ui/landingPage/popularCourses";
import About from "../components/ui/landingPage/about";
import { useNavigate } from "react-router-dom";
import Reviews from "../components/ui/landingPage/reviews";
import OngoingOffers from "../components/ui/landingPage/OngoingOffers";
const Landing = () => {
    const navigate = useNavigate();
    const contactRef=useRef<HTMLDivElement>(null);
    const scrollToContact = () => {
        contactRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="w-full  ">

            <div className="flex flex-col  bg-gradient-to-r from-purple-100 via-gray-100 to-gray-200  ">                

                <Hero scrollToContact={scrollToContact} ></Hero>
                <OngoingOffers/>
                <PopularCourses/> 
                <Partners></Partners>
                <About></About>
                <Services></Services>
                <UpcomingCourses></UpcomingCourses>
                <Reviews></Reviews>
                <CareerContact ref={contactRef}></CareerContact>

                <div className=" z-20 fixed flex flex-col gap-2 bottom-4 montserrat-700 right-4 bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-700 text-white p-2 sm:p-3 rounded-lg shadow-lg w-[280px] sm:w-[320px] md:w-[360px]">
                    <p className="text-xs sm:text-sm md:text-base animate-pulse">🎉 Get enrolled in our HR Payroll Course | Special Festive Offer !!</p>
                    <button onClick={() => {
                        holiOfferBannerClickedEvent();
                        navigate("/course/hr-payroll-course")
                        }} className="bg-white w-full sm:max-w-[200px] cursor-pointer text-green-800 px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold hover:bg-green-50 transition-colors">
                        Enroll Now
                    </button>
                </div>

            </div>
        </div>

    );
};

export default Landing;
