
const CategoryPageShimmerEffect = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-8 md:mb-16 min-h-[30vh] md:min-h-[30vh] flex flex-col justify-center items-center bg-gray-100 px-2 md:px-4 animate-pulse">
                <div className="h-12 md:h-16 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
                <div className="h-4 md:h-6 bg-gray-300 rounded-lg w-1/2"></div>
            </div>

            <div className="flex flex-col gap-1 max-w-7xl mx-auto py-8">
                <div className="h-8 bg-gray-300 rounded-lg w-48 mb-4"></div>
                <div className="flex gap-2 items-center flex-wrap">
                    {[1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className="h-8 bg-gray-300 rounded-md w-24 sm:w-32"></div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-8 max-w-7xl mx-auto px-4 py-16">
                <div className="h-8 bg-gray-300 rounded-lg w-64 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <div key={index} className="p-4 sm:p-6 rounded-md border border-gray-200 bg-gray-100 animate-pulse">
                            <div className="h-8 sm:h-10 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
                            <div className="space-y-2 mb-6">
                                <div className="h-4 bg-gray-300 rounded-lg w-full"></div>
                                <div className="h-4 bg-gray-300 rounded-lg w-5/6"></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="h-8 sm:h-10 bg-gray-300 rounded-md w-32"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryPageShimmerEffect;
