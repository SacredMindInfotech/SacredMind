import { SignedIn, SignedOut, SignIn, useAuth, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { holiOfferBannerClickedEvent } from "../../lib/pixel-event";
import MobileSidebar from "./MobileSidebar";

const Navbar = () => {
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const { isLoaded, user } = useUser();
    const exploreRef = useRef<HTMLDivElement>(null);
    const currentPath = useLocation().pathname;

    const [showSignIn, setShowSignIn] = useState(false);
    const [search, setSearch] = useSearchParams();
    //@ts-ignore
    const [visible, setVisible] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isExploreOpen, setIsExploreOpen] = useState(false);
    // const [subcategories, setSubcategories] = useState<any[]>([]);

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
                //@ts-ignore
                setIsAdmin(response.data.role === "ADMIN");

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
        const handleScroll = () => {
            setIsExploreOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("scroll", handleScroll);
        };
    }, [exploreRef]);

    function handleOverlayClick(e: any) {
        if (e.target === e.currentTarget) {
            setShowSignIn(false);
            document.body.style.overflow = "auto";
            setSearch({});
        }
    }

    // const fetchSubcategories = async (categoryName: string) => {
    //     try {
    //         const res = await axios.get(`${backendUrl}api/v1/category/${categoryName}`);
    //         //@ts-ignore
    //         setSubcategories(res.data.subcategories || []);
    //     } catch (error) {
    //         console.error("Failed to fetch subcategories", error);
    //     }
    // };

    // const handleCategoryClick = (categoryName: string) => {
    //     fetchSubcategories(categoryName);
    // };

    // const handleBack = () => {
    //     setSubcategories([]);
    // };

    return (
        <div className="w-full flex flex-col">
            <div onClick={() => {
                holiOfferBannerClickedEvent();
                navigate("/course/20")
            }}
                className="flex justify-center items-center bg-gradient-to-r from-yellow-900 via-yellow-800 to-yellow-700 text-black py-1 sm:py-1.5 md:py-2 cursor-pointer">
                <div className="flex flex-col lg:flex-row justify-center items-center">
                    <p className="montserrat-500 text-xs sm:text-sm animate-pulse">🎉 Special Vaisakhi Offer is Live!</p>
                    <p className="montserrat-400 text-xs sm:text-sm text-white ml-2 md:ml-4">HR Payroll Mastercourse worth ₹20,000 at just ₹999 + GST. Offer valid till 13th April.</p>
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
                className="flex justify-between items-center h-14 sm:h-16 md:h-[4.5rem] px-2 sm:px-4 md:px-[3%] lg:px-[5%] xl:px-[8%] py-1 sm:py-1.5 md:py-2 border-b border-gray-100 bg-white text-gray-900 top-0 z-40 shadow-md sticky"
            >
                <div className="flex items-center gap-2">
                    {/* Hamburger Menu for Mobile */}
                    <button
                        className="lg:hidden mr-1 sm:mr-2 md:mr-3 text-gray-600 p-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {isMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            )}
                        </svg>
                    </button>

                    <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                        <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate("/")}>
                            <img src="/logo.svg" alt="logo" className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                            <span className="montserrat-700 font-bold text-xs sm:text-sm md:text-base hover:text-gray-600 transition-colors">SACRED MIND</span>
                        </div>

                        {/* Desktop Explore Menu */}
                        <div className="hidden lg:block relative" ref={exploreRef}>
                            {categories.length > 0 && (
                                <button
                                    onMouseEnter={() => setIsExploreOpen(true)}
                                    onMouseLeave={() => setIsExploreOpen(false)}
                                    onClick={() => setIsExploreOpen(!isExploreOpen)}
                                    className="text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 flex items-center justify-between cursor-pointer rounded-md"
                                >
                                    <p className="montserrat-500">Explore Courses</p>
                                </button>
                            )}

                            {isExploreOpen && (
                                <div
                                    onMouseEnter={() => setIsExploreOpen(true)}
                                    onMouseLeave={() => setIsExploreOpen(false)}
                                    className="absolute top-full left-0  bg-white min-w-60  shadow-md rounded-md">
                                    {categories.map((category) => (
                                        <div
                                            onClick={() => {
                                                setIsExploreOpen(false);
                                                navigate(`/category/${category.name.toLowerCase()}`);
                                            }}
                                            key={category.id}
                                            className="relative group px-4 py-2 montserrat-500 text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 cursor-pointer rounded-md flex justify-between"
                                        >
                                            <p className="w-full text-gray-900 cursor-pointer">{category.name}</p>
                                            <span className="text-gray-600">&#8594;</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="hidden md:block">
                            <button
                                onClick={() => navigate('/teach-with-us')}
                                className="text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 flex items-center justify-between cursor-pointer rounded-md"
                                role="menuitem"
                            >
                                <p className="montserrat-500">Teach With Us</p>
                            </button>
                        </div>
                        <div className="hidden md:block">
                            <button
                                onClick={() => navigate('/about-us')}
                                className="text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 flex items-center justify-between cursor-pointer rounded-md"
                            >   
                                <p className="montserrat-500">About Us</p>
                            </button>
                        </div>
                        
                    </div>
                </div>

                {isMenuOpen && (
                    <MobileSidebar categories={categories} setIsMenuOpen={setIsMenuOpen} />
                )}

                {/* Desktop Navigation */}
                <div className="flex justify-end items-center gap-3 sm:gap-5 md:gap-8">
                    <SignedOut>
                        <button
                            onClick={() => navigate("?sign-in=true")}
                            className="px-3 sm:px-4 md:px-6 lg:px-8 text-xs sm:text-sm py-1.5 sm:py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                        >
                            Join
                        </button>
                    </SignedOut>
                    <SignedIn>
                        {isAdmin && <div className="hidden md:block">
                            <button
                                onClick={() => navigate('/admin')}
                                className="text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-200 text-gray-900 flex items-center justify-between cursor-pointer rounded-md"
                                role="menuitem"
                            >
                                <p className="montserrat-500">Dashboard</p>
                            </button>
                        </div>}

                        <div className="hidden md:block">
                            <button
                                onClick={() => navigate('/purchases')}
                                className="text-left px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-200 text-gray-900 flex items-center justify-between cursor-pointer rounded-md"
                                role="menuitem"
                            >
                                <p className="montserrat-500">My Purchases</p>
                            </button>
                        </div>
                        <UserButton
                            appearance={{
                                elements: { avatarBox: "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" }, layout: {
                                    termsPageUrl: 'https://clerk.com/terms'
                                }
                            }}
                        />
                    </SignedIn>
                </div>

                {showSignIn && (
                    <div onClick={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/60 backdrop-blur-lg">
                        <SignIn fallbackRedirectUrl={currentPath} signUpFallbackRedirectUrl={currentPath} />
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Navbar;