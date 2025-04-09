import { useNavigate } from "react-router-dom";

const Footer = () => {
    const router = useNavigate();
    return (
        <div className="flex flex-col bg-gray-100 w-full">
            <section >
                <div className="container px-4 py-8 mx-auto">
                    <div className="mb-6">
                        <div className="flex flex-row items-center gap-2 mb-4">
                            <img src="/logo.svg" alt="logo" className="w-10 h-10" />
                            <p className="text-xl text-gray-900 font-black montserrat-700">Sacred Mind Infotech Private Limited</p>
                        </div>
                        <p className="text-base font-medium text-yellow-600">Contact us</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <span className="inline-block p-1.5 text-yellow-600 rounded-full bg-blue-100/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </span>

                                <h2 className="text-sm font-medium text-gray-900">Email</h2>
                                <p className="text-sm text-gray-500">Our friendly team is here to help.</p>
                                <p className="text-sm text-yellow-600">info@sacredmind.in</p>
                            </div>

                            <div className="space-y-2">
                                <span className="inline-block p-1.5 text-yellow-600 rounded-full bg-blue-100/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                </span>

                                <h2 className="text-sm font-medium text-gray-900">Office</h2>
                                <p className="text-sm text-gray-500">Come say hello at our office.</p>
                                <p className="text-sm text-yellow-600">Zirakpur, Punjab</p>
                            </div>

                            <div className="space-y-2">
                                <span className="inline-block p-1.5 text-yellow-600 rounded-full bg-blue-100/80">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </span>

                                <h2 className="text-sm font-medium text-gray-900">Phone</h2>
                                <p className="text-sm text-gray-500">Mon-Sat from 9am to 5pm.</p>
                                <p className="text-sm text-yellow-600">+91 90567-23482</p>
                            </div>
                        </div>

                        <div className=" h-[200px] lg:h-[300px] lg:-mt-28 w-full flex justify-center lg:justify-end">
                            <iframe
                                className="w-full max-w-[450px] lg:max-w-[500px] h-full border-2 border-gray-300 rounded-md"
                                frameBorder="0"
                                title="map"
                                scrolling="no"
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d201.97305239501404!2d76.82542242006092!3d30.64230343961996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDM4JzMyLjAiTiA3NsKwNDknMzEuNiJF!5e1!3m2!1sen!2sin!4v1740806407662!5m2!1sen!2sin">
                            </iframe>
                        </div>
                    </div>

                    <div className="mb-2">
                        <h3 className="text-sm font-medium text-gray-900 montserrat-600 mb-3">Connect With Us</h3>
                        <div className="flex space-x-5">
                            <a href="https://www.facebook.com/sacredmindin" target="_blank" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                                <span className="sr-only">Facebook</span>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-6 w-6" viewBox="0 0 48 48">
                                    <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                                </svg>
                            </a>

                            <a href="https://www.instagram.com/sacredmindinfotech/" target="_blank" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                                <span className="sr-only">Instagram</span>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-6 w-6" viewBox="0 0 64 64">
                                    <radialGradient id="TGwjmZMm2W~B4yrgup6jda_119026_gr1" cx="32" cy="32.5" r="31.259" gradientTransform="matrix(1 0 0 -1 0 64)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#efdcb1"></stop><stop offset="0" stop-color="#f2e0bb"></stop><stop offset=".011" stop-color="#f2e0bc"></stop><stop offset=".362" stop-color="#f9edd2"></stop><stop offset=".699" stop-color="#fef4df"></stop><stop offset="1" stop-color="#fff7e4"></stop></radialGradient><path fill="url(#TGwjmZMm2W~B4yrgup6jda_119026_gr1)" d="M58,54c-1.1,0-2-0.9-2-2s0.9-2,2-2h2.5c1.9,0,3.5-1.6,3.5-3.5S62.4,43,60.5,43H50c-1.4,0-2.5-1.1-2.5-2.5	S48.6,38,50,38h8c1.7,0,3-1.3,3-3s-1.3-3-3-3H42v-6h18c2.3,0,4.2-2,4-4.4c-0.2-2.1-2.1-3.6-4.2-3.6H58c-1.1,0-2-0.9-2-2s0.9-2,2-2	h0.4c1.3,0,2.5-0.9,2.6-2.2c0.2-1.5-1-2.8-2.5-2.8h-14C43.7,9,43,8.3,43,7.5S43.7,6,44.5,6h3.9c1.3,0,2.5-0.9,2.6-2.2	C51.1,2.3,50,1,48.5,1H15.6c-1.3,0-2.5,0.9-2.6,2.2C12.9,4.7,14,6,15.5,6H19c1.1,0,2,0.9,2,2s-0.9,2-2,2H6.2c-2.1,0-4,1.5-4.2,3.6	C1.8,16,3.7,18,6,18h2.5c1.9,0,3.5,1.6,3.5,3.5S10.4,25,8.5,25H5.2c-2.1,0-4,1.5-4.2,3.6C0.8,31,2.7,33,5,33h17v11H6	c-1.7,0-3,1.3-3,3s1.3,3,3,3l0,0c1.1,0,2,0.9,2,2s-0.9,2-2,2H4.2c-2.1,0-4,1.5-4.2,3.6C-0.2,60,1.7,62,4,62h53.8	c2.1,0,4-1.5,4.2-3.6C62.2,56,60.3,54,58,54z"></path><radialGradient id="TGwjmZMm2W~B4yrgup6jdb_119026_gr2" cx="18.51" cy="66.293" r="69.648" gradientTransform="matrix(.6435 -.7654 .5056 .4251 -26.92 52.282)" gradientUnits="userSpaceOnUse"><stop offset=".073" stop-color="#eacc7b"></stop><stop offset=".184" stop-color="#ecaa59"></stop><stop offset=".307" stop-color="#ef802e"></stop><stop offset=".358" stop-color="#ef6d3a"></stop><stop offset=".46" stop-color="#f04b50"></stop><stop offset=".516" stop-color="#f03e58"></stop><stop offset=".689" stop-color="#db359e"></stop><stop offset=".724" stop-color="#ce37a4"></stop><stop offset=".789" stop-color="#ac3cb4"></stop><stop offset=".877" stop-color="#7544cf"></stop><stop offset=".98" stop-color="#2b4ff2"></stop></radialGradient><path fill="url(#TGwjmZMm2W~B4yrgup6jdb_119026_gr2)" d="M45,57H19c-5.5,0-10-4.5-10-10V21c0-5.5,4.5-10,10-10h26c5.5,0,10,4.5,10,10v26C55,52.5,50.5,57,45,57z"></path><path fill="#fff" d="M32,20c4.6,0,5.1,0,6.9,0.1c1.7,0.1,2.6,0.4,3.2,0.6c0.8,0.3,1.4,0.7,2,1.3c0.6,0.6,1,1.2,1.3,2 c0.2,0.6,0.5,1.5,0.6,3.2C46,28.9,46,29.4,46,34s0,5.1-0.1,6.9c-0.1,1.7-0.4,2.6-0.6,3.2c-0.3,0.8-0.7,1.4-1.3,2 c-0.6,0.6-1.2,1-2,1.3c-0.6,0.2-1.5,0.5-3.2,0.6C37.1,48,36.6,48,32,48s-5.1,0-6.9-0.1c-1.7-0.1-2.6-0.4-3.2-0.6 c-0.8-0.3-1.4-0.7-2-1.3c-0.6-0.6-1-1.2-1.3-2c-0.2-0.6-0.5-1.5-0.6-3.2C18,39.1,18,38.6,18,34s0-5.1,0.1-6.9 c0.1-1.7,0.4-2.6,0.6-3.2c0.3-0.8,0.7-1.4,1.3-2c0.6-0.6,1.2-1,2-1.3c0.6-0.2,1.5-0.5,3.2-0.6C26.9,20,27.4,20,32,20 M32,17 c-4.6,0-5.2,0-7,0.1c-1.8,0.1-3,0.4-4.1,0.8c-1.1,0.4-2.1,1-3,2s-1.5,1.9-2,3c-0.4,1.1-0.7,2.3-0.8,4.1C15,28.8,15,29.4,15,34 s0,5.2,0.1,7c0.1,1.8,0.4,3,0.8,4.1c0.4,1.1,1,2.1,2,3c0.9,0.9,1.9,1.5,3,2c1.1,0.4,2.3,0.7,4.1,0.8c1.8,0.1,2.4,0.1,7,0.1 s5.2,0,7-0.1c1.8-0.1,3-0.4,4.1-0.8c1.1-0.4,2.1-1,3-2c0.9-0.9,1.5-1.9,2-3c0.4-1.1,0.7-2.3,0.8-4.1c0.1-1.8,0.1-2.4,0.1-7 s0-5.2-0.1-7c-0.1-1.8-0.4-3-0.8-4.1c-0.4-1.1-1-2.1-2-3s-1.9-1.5-3-2c-1.1-0.4-2.3-0.7-4.1-0.8C37.2,17,36.6,17,32,17L32,17z"></path><path fill="#fff" d="M32,25c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S37,25,32,25z M32,40c-3.3,0-6-2.7-6-6s2.7-6,6-6s6,2.7,6,6S35.3,40,32,40 z"></path><circle cx="41" cy="25" r="2" fill="#fff"></circle>
                                </svg>
                            </a>

                            <a href="https://x.com/sacredmindin" target="_blank" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                                <span className="sr-only">X</span>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-6 w-6" viewBox="0 0 30 30">
                                    <path d="M 6 4 C 4.895 4 4 4.895 4 6 L 4 24 C 4 25.105 4.895 26 6 26 L 24 26 C 25.105 26 26 25.105 26 24 L 26 6 C 26 4.895 25.105 4 24 4 L 6 4 z M 8.6484375 9 L 13.259766 9 L 15.951172 12.847656 L 19.28125 9 L 20.732422 9 L 16.603516 13.78125 L 21.654297 21 L 17.042969 21 L 14.056641 16.730469 L 10.369141 21 L 8.8945312 21 L 13.400391 15.794922 L 8.6484375 9 z M 10.878906 10.183594 L 17.632812 19.810547 L 19.421875 19.810547 L 12.666016 10.183594 L 10.878906 10.183594 z"></path>
                                </svg>
                            </a>
                            <a href="https://www.youtube.com/@sacredMindInfotechPrivateLimit" target="_blank" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                                <span className="sr-only">Youtube</span>
                                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="h-6 w-6" viewBox="0 0 48 48">
                                    <path fill="#FF3D00" d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"></path><path fill="#FFF" d="M20 31L20 17 32 24z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="border-gray-300" />

            <div className="bg-gray-100 py-4 montserrat-400">
                <div className="container px-4 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
                            <button onClick={() => router("/privacy-policy")} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Privacy Policy</button>
                            <button onClick={() => router("/terms-and-conditions")} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Terms & Conditions</button>
                            <button onClick={() => router("/sales-and-refunds")} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Sales and Refunds</button>
                            <button onClick={() => router("/pricing-policy")} className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">Pricing Policy</button>
                        </div>
                        <p className="text-sm text-gray-600 text-center md:text-right mt-4 md:mt-0">© 2025 Sacred Mind Infotech Private Limited. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
