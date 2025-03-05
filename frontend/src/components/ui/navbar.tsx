import { SignedIn, SignedOut, SignIn, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

const Navbar = () => {
    const navigate = useNavigate();

    const [showSignIn, setShowSignIn] = useState(false);
    const [search, setSearch] = useSearchParams();
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [categories, setCategories] = useState<any[]>([]);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;


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

    function handleOverlayClick(e: any) {
        if (e.target === e.currentTarget) {
            setShowSignIn(false);
            document.body.style.overflow = "auto";
            setSearch({});
        }
    }

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{
                y: visible ? 0 : -100,
                opacity: visible ? 1 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex justify-between items-center min-h-[8vh] px-8 md:px-52 py-2 border-b border-gray-100 bg-white text-gray-900 sticky top-0 z-40 shadow-md"
        >
            <div className="flex items-center gap-4">
                <span className="montserrat-700 text-base cursor-pointer hover:text-gray-600 transition-colors" onClick={() => navigate("/")}>SACRED MIND INFOTECH</span>
                <div className="relative group">
                    <button
                        className="text-base text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2  hover:border-gray-200 hover:bg-gray-50 hover:rounded-sm px-4 py-1.5 cursor-pointer "
                    >
                        Explore
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-180">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>

                    <div className="absolute left-0 mt-2 w-56 rounded-md shadow-2xl shadow-gray-300 bg-white ring-1 ring-black ring-opacity-5 invisible group-hover:visible transition-all">
                        <div className="py-2" role="menu">
                            {categories?.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => window.location.href = `/category/${category.name}`}
                                    className="w-full text-left px-6 py-3 text-base text-gray-600 hover:bg-gray-200 hover:text-gray-900 flex items-center justify-between cursor-pointer"
                                    role="menuitem"
                                >
                                    <p className="montserrat-500">{category.name}</p>
                                    <span className="text-gray-600">&#8594;</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end items-center">
                <nav className="hidden md:flex items-center gap-8">

                    <button
                        onClick={() => navigate("/teaching")}
                        className="text-gray-600 hover:text-gray-900 cursor-pointer"
                    >
                        Teach with us
                    </button>
                   
                    <SignedOut>
                        <button
                            onClick={() => navigate("?sign-in=true")}
                             className="px-8 text-sm py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer"
                        >
                            Join
                        </button>
                    </SignedOut>
                    <SignedIn>
                        <UserButton
                            appearance={{ elements: { avatarBox: "w-8 h-8" } }}
                        />
                    </SignedIn>
                </nav>

            </div>
            {showSignIn && (
                <div onClick={handleOverlayClick} className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/60 backdrop-blur-lg">
                    <SignIn fallbackRedirectUrl="/" signUpFallbackRedirectUrl="/" />
                </div>
            )}
        </motion.div>
    );
};

export default Navbar;
