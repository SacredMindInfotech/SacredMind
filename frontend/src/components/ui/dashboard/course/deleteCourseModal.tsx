
const DeleteCourseModal = ({
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    deleteConfirmation,
    setDeleteConfirmation,
    handleDeleteCourse,
    isLoading
  }: {
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    deleteConfirmation: string;
    setDeleteConfirmation: React.Dispatch<React.SetStateAction<string>>;
    handleDeleteCourse: () => void;
    isLoading: boolean;
  }) => {
    return (
      <div 
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isDeleteModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-red-600">Delete Course</h3>
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mb-6">
            <div className="mb-4 bg-red-50 p-4 rounded-md">
              <p className="text-red-800 font-medium mb-2">Warning: This action cannot be undone</p>
              <p className="text-gray-700">
                Deleting this course will permanently remove all its content, modules, topics, and student enrollments.
              </p>
            </div>
            
            <p className="mb-2 text-sm text-gray-600">
              Type "delete" to confirm:
            </p>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="delete"
            />
          </div>
          
          <div className="mt-auto">
            <button
              onClick={handleDeleteCourse}
              disabled={deleteConfirmation !== "delete" || isLoading}
              className={`w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md ${deleteConfirmation !== "delete" || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete Course'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default DeleteCourseModal