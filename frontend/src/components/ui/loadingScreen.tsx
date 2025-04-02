import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center space-y-4">
            <motion.div
                className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    )
}

export { LoadingScreen };