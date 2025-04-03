import { motion } from "framer-motion";

const ExpandedComponent = ({ data }: { data: any }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="p-6 space-y-4 bg-gradient-to-r from-gray-200 via-gray-400 to-yellow-200 shadow-lg rounded-xl mx-3 my-4 border border-gray-100"
        style={{ 
            maxWidth: "calc(100% - 1.5rem)",
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 8px 20px -5px rgba(0, 0, 0, 0.05), 0 6px 8px -6px rgba(0, 0, 0, 0.02)"
        }}
    >
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-4 flex items-center gap-3"
        >
            {data.imageUrl ? (
                <img 
                    src={data.imageUrl}
                    alt={`${data.firstName} ${data.lastName}`} 
                    className="h-16 w-16 rounded-full object-cover border-2 border-blue-100"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=User';
                    }}
                />
            ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {data.firstName.charAt(0)}{data.lastName?.charAt(0)}
                </div>
            )}
            <div>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    data.role === "ADMIN" ? "bg-red-100 text-red-800" : 
                    data.role === "MANAGER" ? "bg-blue-100 text-blue-800" : 
                    "bg-green-100 text-green-800"
                } mb-2`}>
                    {data.role}
                </span>
                <h1 className="text-2xl font-bold text-gray-800">{data.firstName} {data.lastName}</h1>
                <p className="text-gray-600">{data.email}</p>
            </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
        >
            <motion.div 
                whileHover={{ y: -3, boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
                className="bg-white/80 p-3 rounded-lg border border-gray-100 shadow-sm"
            >
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-1">User ID</h2>
                <p className="text-sm text-gray-800 font-mono bg-gray-50/70 p-1.5 rounded overflow-x-auto">{data.clerkuserId}</p>
            </motion.div>

            <motion.div 
                whileHover={{ y: -3, boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
                className="bg-white/80 p-3 rounded-lg border border-gray-100 shadow-sm"
            >
                <h2 className="text-xs font-semibold text-gray-500 uppercase mb-1">Phone Number</h2>
                <p className="text-sm text-gray-800 font-mono bg-gray-50/70 p-1.5 rounded overflow-x-auto">
                    {data.phoneNumber ? data.phoneNumber : "Not added yet"}
                </p>
            </motion.div>

            <motion.div 
                whileHover={{ y: -3, boxShadow: "0 10px 15px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
                className="bg-white/80 p-3 rounded-lg border border-gray-100 shadow-sm"
            >
                <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Created at</span>
                        <span className="text-sm font-medium text-gray-800">{data.createdAt}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Updated at</span>
                        <span className="text-sm font-medium text-gray-800">{data.updatedAt}</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    </motion.div>
);
export default ExpandedComponent