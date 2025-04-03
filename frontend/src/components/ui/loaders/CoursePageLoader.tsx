
const CoursePageShimmerEffect = () => <div className="max-w-7xl mx-auto px-4 py-8 sm:py-16">
    <div className="text-center mb-8 sm:mb-16 p-4 sm:p-10 min-h-[40vh] sm:min-h-[50vh] flex flex-col justify-center items-center bg-gray-100 animate-pulse">
        <div className="h-12 sm:h-16 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
        <div className="flex flex-wrap justify-center items-center gap-2">
            <div className="h-8 bg-gray-300 rounded-full w-32"></div>
            <div className="h-8 bg-gray-300 rounded-full w-32"></div>
        </div>
        <div className="h-6 bg-gray-300 rounded-lg w-full max-w-2xl mt-6"></div>
        <div className="h-6 bg-gray-300 rounded-lg w-full max-w-xl mt-2"></div>
        <div className="mt-8">
            <div className="h-12 bg-gray-300 rounded-md w-40"></div>
        </div>
    </div>

    <div className="flex flex-col lg:flex-row gap-6 mb-12">
        <div className="flex flex-col gap-6 sticky top-24 h-fit w-full lg:w-1/3">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="h-8 bg-gray-300 rounded-lg w-48"></div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col gap-3">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="h-4 bg-gray-300 rounded-lg w-full"></div>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex flex-col gap-4 w-full lg:w-2/3">
            <div className="flex items-center gap-2">
                <div className="h-8 bg-gray-300 rounded-lg w-64"></div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm w-full">
                {[1, 2, 3].map((module) => (
                    <div key={module} className="bg-gray-100 p-4 rounded-lg mb-4">
                        <div className="h-8 bg-gray-300 rounded-lg w-full mb-4"></div>
                        <div className="space-y-3 pl-3">
                            {[1, 2].map((topic) => (
                                <div key={topic} className="border-l-2 border-gray-300 pl-3">
                                    <div className="h-6 bg-gray-300 rounded-lg w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded-lg w-full mb-2"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>

    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {[1, 2, 3].map((section) => (
            <div key={section} className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <div className="h-8 bg-gray-300 rounded-lg w-48"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg shadow-sm">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="flex items-start gap-2 bg-white p-3 rounded-md">
                            <div className="h-5 bg-gray-300 rounded-full w-5"></div>
                            <div className="h-4 bg-gray-300 rounded-lg w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </div>
</div>

export default CoursePageShimmerEffect;