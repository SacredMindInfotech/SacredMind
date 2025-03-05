import Services from "../components/ui/services";
import Contact from "../components/ui/contact";
import Hero from "../components/ui/hero";
import Partners from "../components/ui/partners";
import { useRef } from "react";
const Landing = () => {

    const contactRef=useRef<HTMLDivElement>(null);
    const scrollToContact = () => {
        contactRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="relative overflow-hidden w-full">

            {/* <div className="absolute -right-28 top-15 transform translate-x-1/4 -translate-y-1/4 w-[1000px] h-[1000px] rounded-full bg-[#116bfb] -z-10 opacity-60">
            </div> */}

            <div className="flex flex-col">

                {/* Hero Section */}
                <Hero scrollToContact={scrollToContact} ></Hero>

                {/* parternship */}
                <Partners></Partners>

                {/* Services */}
                <Services></Services>

                {/* Contact */}
                <Contact ref={contactRef}></Contact>

            </div>
        </div>

    );
};

export default Landing;
