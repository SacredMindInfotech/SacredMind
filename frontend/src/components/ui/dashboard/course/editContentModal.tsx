import { SetStateAction } from "react";
import { Dispatch } from "react";
import toast from "react-hot-toast";

interface Content {
    id: number;
    name: string;
    topicId: number;
    type: "VIDEO" | "PDF" | "EXCEL" | "TEXT" | "IMAGE";
    key: string;
  }
  

const EditContentModal = ({
    isEditContentModalOpen,
    setIsEditContentModalOpen,
    currentContent,
    setCurrentContent,
    editedContentName,
    setEditedContentName,
    handleUpdateContent
  }: {
    isEditContentModalOpen: boolean,
    setIsEditContentModalOpen: Dispatch<SetStateAction<boolean>>,
    currentContent: Content,
    setCurrentContent: Dispatch<SetStateAction<Content | null>>,
    editedContentName: string,
    setEditedContentName: Dispatch<SetStateAction<string>>,
    handleUpdateContent: () => void
  }) => {
    return (
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isEditContentModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {currentContent && (
          <div className="h-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Edit Content
              </h3>
              <button
                onClick={() => {
                  setIsEditContentModalOpen(false);
                  setCurrentContent(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
  
            <div className="mb-4 bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium">Content Type: {currentContent.type}</p>
              <p className="text-sm text-gray-600 break-all">File: {currentContent.key}</p>
            </div>
  
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Content Name</label>
              <input
                type="text"
                value={editedContentName}
                onChange={(e) => {
                  const newName = e.target.value;
                  if (newName.includes('.')) {
                    toast.error('Content name cannot contain periods.');
                  } else {
                    setEditedContentName(newName);
                  }
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
  
            <div className="mt-auto">
              <button
                onClick={handleUpdateContent}
                disabled={!editedContentName}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!editedContentName ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Update Content
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  export default EditContentModal