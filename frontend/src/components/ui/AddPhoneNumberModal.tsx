import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const AddPhoneNumberModal = ({ id, setShowPhoneNumberModal }: { id: string, setShowPhoneNumberModal: (show: boolean) => void }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { getToken } = useAuth();

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow digits and limit to 10 characters
        const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
        setPhoneNumber(digitsOnly);
    };

    const HandleSubmit = async () => {
        // Validate phone number length
        setIsLoading(true);
        if (phoneNumber.length !== 10) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }

        const fullPhoneNumber = `+91${phoneNumber}`;

        const token = await getToken();
        try {
            const response = await axios.put(`${backendUrl}api/v1/user/${id}/updatePhoneNumber`, 
                { phoneNumber: fullPhoneNumber },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if(response.status === 200){
                toast.success("Phone number added successfully");
                setShowPhoneNumberModal(false);
                document.body.style.overflow="visible";
            }
            window.location.reload();
            setIsLoading(false);
        } catch (error:any) {
            toast.error(error.response.data.error);
            console.error(error);
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center gap-4 montserrat-400 p-8 bg-white rounded-lg shadow-md relative">
            <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                onClick={() => { setShowPhoneNumberModal(false); document.body.style.overflow = "visible"; }}
            >
                &times;
            </button>
            <h2 className="text-xl font-semibold ">Add Phone Number</h2>
            <p className='mb-4' >Take a minute and add your phone number for better experience</p>
            <div className="flex items-center border rounded-md overflow-hidden">
                <div className="flex items-center px-3 py-2 bg-gray-50 border-r">
                    <span className="mr-2">🇮🇳</span>
                    <span className="text-gray-700">+91</span>
                </div>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    placeholder="Enter 10-digit number"
                    className="px-3 py-2 focus:outline-none montserrat-400 w-full"
                    maxLength={10}
                />
            </div>
            {phoneNumber.length > 0 && phoneNumber.length !== 10 && (
                <p className="text-red-500 text-sm">Phone number must be 10 digits</p>
            )}
            <button
                disabled={isLoading}
                className="px-6 py-3 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                onClick={HandleSubmit}
            >
                {isLoading ? "Loading..." : "Submit"}
            </button>
            <Toaster></Toaster>
        </div>
    );
}

export default AddPhoneNumberModal;