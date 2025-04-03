
const CourseContentPageLoader = () => {
  return (
    <div className="relative w-full h-full">
      <div className="mx-auto px-4 md:px-[5%] lg:px-[10%] xl:px-[15%] py-8">
        <section className="relative text-black">
          <div className="relative z-10 container mx-auto">
            <div className="flex flex-col gap-8">
              {/* Hero Section Shimmer */}
              <div className="flex flex-col p-6 md:p-12 lg:p-20 bg-gray-100 justify-center animate-pulse">
                <div className="h-10 md:h-12 lg:h-14 bg-gray-300 rounded-lg w-3/4 mb-4"></div>
                <div className="h-5 md:h-6 lg:h-7 bg-gray-300 rounded-lg w-1/2 mb-6"></div>
                <div className="w-40 h-10 bg-gray-300 rounded-md"></div>
              </div>

              {/* Course Notice Shimmer (optional) */}
              <div className="flex flex-col justify-center py-6 md:py-12">
                <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 rounded-lg max-w-2xl mx-auto w-full animate-pulse">
                  <div className="h-20 bg-gray-300 rounded-lg w-full"></div>
                </div>
              </div>

              {/* Modules Shimmer */}
              <div>
                {[1, 2, 3].map((moduleIndex) => (
                  <div key={moduleIndex} className="bg-gray-100 p-4 rounded-lg mb-4 animate-pulse">
                    <div className="flex justify-between items-center transition-all duration-300 ease-in-out rounded-lg p-2">
                      <div className="h-7 bg-gray-300 rounded-lg w-2/3"></div>
                      <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                    </div>
                    
                    {/* Topics Shimmer (for first module only to show expanded state) */}
                    {moduleIndex === 1 && (
                      <div className="space-y-3 pl-3 mt-3">
                        {[1, 2, 3].map((topicIndex) => (
                          <div key={topicIndex} className="border-l-2 border-gray-300 pl-3">
                            <div className="flex gap-2 items-center">
                              <div className="h-5 bg-gray-300 rounded-lg w-1/2 mb-2"></div>
                              <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                            </div>
                            
                            {/* Content Items Shimmer (for first topic only) */}
                            {topicIndex === 1 && (
                              <div className="flex flex-col gap-2 mt-2">
                                <div className="h-4 bg-gray-300 rounded-lg w-3/4 mb-1"></div>
                                {[1, 2].map((contentIndex) => (
                                  <div key={contentIndex} className="p-2 max-w-xl bg-gray-200 rounded-lg shadow-sm flex justify-between items-center">
                                    <div className="flex flex-col gap-1 w-2/3">
                                      <div className="h-5 bg-gray-300 rounded-lg w-3/4"></div>
                                      <div className="h-3 bg-gray-300 rounded-lg w-1/2"></div>
                                    </div>
                                    <div className="h-8 bg-gray-300 rounded-md w-20"></div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseContentPageLoader;
