import { SignedIn, SignedOut, SignIn, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { holiOfferBannerClickedEvent } from "../../lib/pixel-event";
// import AddPhoneNumberModal from "./AddPhoneNumberModal";

const Navbar = () => {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { isLoaded, user } = useUser();
    const exploreRef = useRef<HTMLDivElement>(null);
    const currentPath = useLocation().pathname;

    const [showSignIn, setShowSignIn] = useState(false);
    const [search, setSearch] = useSearchParams();
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [categories, setCategories] = useState<any[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);
    // const [showPhoneNumberModal,setShowPhoneNumberModal]=useState(false);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        const fetchAdminStatus = async () => {
            if (!isLoaded || !user?.id) return; 
            try {
                const token = await getToken();
                const response = (await axios.get(`${backendUrl}api/v1/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }));
                console.log(response.data);
                // console.log(response);
                //@ts-ignore
                setIsAdmin(response.data.role === "ADMIN");
                //@ts-ignore
                // if(!response.data.phoneNumber){
                //     setShowPhoneNumberModal(true);
                //     document.body.style.overflow="hidden";
                // }
            } catch (error) {
                console.error("Error fetching admin status:", error);
            }
        };

        fetchAdminStatus();
    }, [isLoaded, user]);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await axios.get(`${backendUrl}api/v1/category/`);
            //@ts-ignore
            setCategories(res.data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                // Scrolling down
                setVisible(false);
            } else {
                // Scrolling up
                setVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);

    }, [lastScrollY]);

    useEffect(() => {
        if (search.get("sign-in")) {
            setShowSignIn(true);
            document.body.style.overflow = "hidden";
        }
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
                setIsExploreOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [exploreRef]);

    function handleOverlayClick(e: any) {
        if (e.target === e.currentTarget) {
            setShowSignIn(false);
            document.body.style.overflow = "auto";
            setSearch({});
        }
    }

    return (
        <div className="w-full flex flex-col">

            <div onClick={() => {
                holiOfferBannerClickedEvent();
                navigate("/course/20")
            }} 
            className="flex justify-center items-center bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-700 text-black py-2 cursor-pointer">
                <div className="flex flex-col justify-center items-center">
                    <p className="montserrat-700 text-sm  animate-pulse">🎉 Special Vaisakhi Offer is Live!</p>
                    <p className="montserrat-400 text-sm text-white ml-4">HR Payroll Mastercourse worth ₹20,000 at just ₹999 + GST. Offer valid till 13th April.</p>
                </div>
            </div>

            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{
                    y: visible ? 0 : -100,
                    opacity: visible ? 1 : 0
                }}
                exit={{ y: -100, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex justify-between items-center min-h-[8vh] px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-2 border-b border-gray-100 bg-white text-gray-900 sticky top-0 z-40 shadow-md"
            >
                <div className="flex items-center gap-4">
                    {/* Hamburger Menu for Mobile */}
                    <button
                        className="md:hidden text-gray-600 p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                            <img src="/logo.svg" alt="logo" className="w-8 h-8 md:w-10 md:h-10" />
                            <span className="montserrat-700 font-bold text-sm md:text-base lg:text-lg hover:text-gray-600 transition-colors">SACRED MIND</span>
                        </div>

                        {/* Desktop Explore Menu */}
                        <div className="hidden md:block relative" ref={exploreRef}>
                            {categories.length > 0 && (
                                <button
                                    onClick={() => setIsExploreOpen(!isExploreOpen)}
                                    className="text-sm lg:text-base text-gray-900 font-semibold transition-colors flex items-center gap-2 hover:border-gray-200 hover:bg-gray-50 hover:rounded-sm px-4 py-1.5 cursor-pointer"
                                >
                                    Explore Courses
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className={`transition-transform ${isExploreOpen ? 'rotate-180' : ''}`}
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={isExploreOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className={`absolute left-0 mt-2 w-56 rounded-md shadow-2xl shadow-gray-300 bg-white ring-1 ring-black ring-opacity-5 transition-all ${isExploreOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}
                            >
                                <div className="py-2" role="menu">
                                    {categories?.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => window.location.href = `/category/${category.name}`}
                                            className="w-full text-left px-6 py-3 text-sm lg:text-base text-gray-600 hover:bg-gray-200 hover:text-gray-900 flex items-center justify-between cursor-pointer"
                                            role="menuitem"
                                        >
                                            <p className="montserrat-500">{category.name}</p>
                                            <span className="text-gray-600">&#8594;</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 md:hidden"
                    >
                        <div className="flex flex-col py-4">
                            <div className="px-4 py-2">
                                <div className="relative group">
                                    <button 
                                        className="text-gray-900 font-semibold w-full text-left"
                                        onClick={() => setIsMobileExploreOpen(!isMobileExploreOpen)}
                                    >
                                        Explore Courses
                                    </button>
                                    {isMobileExploreOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="pl-4 mt-2 max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                                        >
                                            {categories?.map((category) => (
                                                <button
                                                    key={category.id}
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        window.location.href = `/category/${category.name}`;
                                                    }}
                                                    className="block w-full py-2 text-left text-gray-600 hover:bg-gray-50"
                                                >
                                                    {category.name}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        navigate("/purchases");
                                    }}
                                    className="px-4 py-2 text-gray-900 font-semibold hover:bg-gray-50 w-full text-left"
                                >
                                    My Purchases
                                </button>
                            </div>

                            {isAdmin && (
                                <button
                                    onClick={() => navigate("/admin")}
                                    className="px-4 md:px-6 lg:px-8 text-sm py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                                >
                                    Dashboard
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Desktop Navigation */}
                <div className="flex justify-end items-center gap-8">

                    <SignedOut>
                        <button
                            onClick={() => navigate("?sign-in=true")}
                            className=" px-4 md:px-6 lg:px-8 text-sm py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                        >
                            Join
                        </button>
                    </SignedOut>
                    <SignedIn>
                        {isAdmin && (
                            <button
                                onClick={() => navigate("/admin")}
                                className="hidden sm:block px-4 md:px-6 lg:px-8 text-sm py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                            >
                                Dashboard
                            </button>
                        )}
                        <button
                            onClick={() => navigate("/purchases")}
                            className="hidden sm:block px-4 md:px-6 lg:px-8 text-sm py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                        >
                            My Purchases
                        </button>
                        <UserButton
                            appearance={{
                                elements: { avatarBox: "w-8 h-8" }, layout: {
                                    termsPageUrl: 'https://clerk.com/terms'
                                }
                            }}
                        />
                    </SignedIn>
                </div>

                {showSignIn && (
                    <div onClick={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/60 backdrop-blur-lg">
                        <SignIn fallbackRedirectUrl={currentPath}   signUpFallbackRedirectUrl={currentPath} />
                    </div>
                )}
                {/* {showPhoneNumberModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-lg" >
                        <AddPhoneNumberModal setShowPhoneNumberModal={setShowPhoneNumberModal} id={user!.id} />
                    </div>
                )} */}
            </motion.div>

        </div>

    );
};

export default Navbar;