interface Category {
    id: number;
    name: string;
    parentId: number ;
}

const EditCourseModal = ({ 
    isEditModalOpen, 
    setIsEditModalOpen, 
    editData, 
    setEditData, 
    handleInputChange, 
    handleArrayInputChange, 
    handleAddArrayItem, 
    handleRemoveArrayItem, 
    handleSubmit, 
    isLoading,
    categorySearch,
    setCategorySearch,
    showCategoryDropdown,
    setShowCategoryDropdown,
    filteredCategories,
    handleCategorySelect,
    selectedCategoryName,
    setSelectedImage
  }: {
    isEditModalOpen: boolean;
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    editData: any;
    setEditData: React.Dispatch<React.SetStateAction<any>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleArrayInputChange: (field: string, index: number, value: string) => void;
    handleAddArrayItem: (field: string) => void;
    handleRemoveArrayItem: (field: string, index: number) => void;
    handleSubmit: () => void;
    isLoading: boolean;
    categories: Category[];
    categorySearch: string;
    setCategorySearch: React.Dispatch<React.SetStateAction<string>>;
    showCategoryDropdown: boolean;
    setShowCategoryDropdown: React.Dispatch<React.SetStateAction<boolean>>;
    filteredCategories: Category[];
    handleCategorySelect: (categoryId: number) => void;
    selectedCategoryName: string;
    setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  }) => {
    return (
      <div 
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isEditModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Edit Course Details</h3>
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Basic Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={editData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={editData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <input
                    type="text"
                    name="language"
                    value={editData.language}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <div className="relative">
                    <div 
                      className="w-full p-2 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    >
                      <span>{selectedCategoryName || 'Select a category'}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    
                    {showCategoryDropdown && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
                        <div className="p-2 border-b">
                          <input
                            type="text"
                            placeholder="Search categories..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        {filteredCategories.length > 0 ? (
                          <ul>
                            {filteredCategories.map(category => (
                              <li 
                                key={category.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleCategorySelect(category.id)}
                              >
                                {category.name}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="px-4 py-2 text-gray-500">No categories found</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Image */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Course Image</h4>
              <div className="space-y-3">
                {editData.imageUrl.length > 4 ? (
                  <div className="flex items-center space-x-4">
                    <img 
                      src={editData.imageUrl} 
                      alt="Course Banner" 
                      className="w-32 h-32 object-cover rounded-md"
                    />
                    <button 
                      onClick={() => setEditData({...editData, imageUrl: ''})}
                      className="text-red-500 hover:text-red-700 cursor-pointer "
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setSelectedImage(e.target.files?.[0] || null);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>


            {/* Course Notice */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Course Notice</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showCourseNotice"
                    checked={editData.showCourseNotice}
                    onChange={(e) => setEditData({...editData, showCourseNotice: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="showCourseNotice" className="ml-2 block text-sm text-gray-700">
                    Show course notice to students
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Notice</label>
                  <textarea
                    name="courseNotice"
                    value={editData.courseNotice}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            
            {/* Course Status */}
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Course Status</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editData.isActive}
                    onChange={(e) => setEditData({...editData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Enrollment is open
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    checked={editData.published}
                    onChange={(e) => setEditData({...editData, published: e.target.checked})}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                    Course is published
                  </label>
                </div>
              </div>
            </div>
            
            {/* Array Fields */}
            {['overview', 'learningOutcomes', 'requirements', 'forwhom'].map((field) => (
              <div key={field}>
                <h4 className="font-medium text-gray-700 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                </h4>
                <div className="space-y-2">
                  {(editData[field] as string[]).map((item, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleArrayInputChange(field, index, e.target.value)}
                        className="flex-grow p-2 border border-gray-300 rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveArrayItem(field, index)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddArrayItem(field)}
                    className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Add Item
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default EditCourseModal