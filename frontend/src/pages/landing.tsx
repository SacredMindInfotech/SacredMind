import Services from "../components/ui/services";
import Hero from "../components/ui/hero";
import Partners from "../components/ui/partners";
import { useRef } from "react";
import About from "../components/ui/about";
import CareerContact from "../components/ui/career&contact";
const Landing = () => {

    const contactRef=useRef<HTMLDivElement>(null);
    const scrollToContact = () => {
        contactRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="relative overflow-hidden w-full">

            <div className="flex flex-col">

                {/* Hero Section */}
                <Hero scrollToContact={scrollToContact} ></Hero>

                {/* parternship */}
                <Partners></Partners>

                {/* about */}
                <About></About>

                {/* Services */}
                <Services></Services>

                {/* Contact */}
                <CareerContact ref={contactRef}></CareerContact>

            </div>
        </div>

    );
};

export default Landing;
