import { SetStateAction } from "react";
import { Dispatch } from "react";
import toast from "react-hot-toast";

interface Topic {
    id: number;
    serialNumber: number;
    title: string;
    description: string;
    moduleId: number;
    contents: Content[];
  }
  interface Content {
    id: number;
    name: string;
    topicId: number;
    type: "VIDEO" | "PDF" | "EXCEL" | "TEXT" | "IMAGE";
    key: string;
  }
  
const AddContentModal = ({
    isContentModalOpen,
    setIsContentModalOpen,
    currentTopic,
    newContent,
    setNewContent,
    handleFileChange,
    contentFile,
    handleAddContent,
    setContentFile
  }: {
    isContentModalOpen: boolean,
    setIsContentModalOpen: Dispatch<SetStateAction<boolean>>,
    currentTopic: Topic | null,
    newContent: {
      name: string,
      type: "VIDEO" | "PDF" | "EXCEL" | "IMAGE",
    },
    setNewContent: Dispatch<SetStateAction<{
      name: string,
      type: "VIDEO" | "PDF" | "EXCEL" | "IMAGE",
    }>>,
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    contentFile: File | null,
    handleAddContent: () => void,
    setContentFile: Dispatch<SetStateAction<File | null>>
  }) => {
    return (
      <div
        className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isContentModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Add Content
            </h3>
            <button
              onClick={() => {
                setIsContentModalOpen(false);
                setContentFile(null);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          {currentTopic && (
            <div className="mb-4 bg-blue-50 p-3 rounded-md">
              <p className="text-sm font-medium">Adding to Topic:</p>
              <p className="text-sm">{currentTopic.title}</p>
            </div>
          )}
  
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Content Name</label>
            <input
              type="text"
              value={newContent.name}
              onChange={(e) => {
                const newName = e.target.value;
                if (newName.includes('.')) {
                  toast.error('Content name cannot contain periods.');
                } else {
                  setNewContent({ ...newContent, name: newName });
                }
              }}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter content name"
            />
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Content Type</label>
            <select
              value={newContent.type}
              onChange={(e) => setNewContent({
                ...newContent,
                type: e.target.value as 'VIDEO' | 'PDF' | 'EXCEL' | 'IMAGE'
              })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="VIDEO">Video</option>
              <option value="PDF">PDF</option>
              <option value="EXCEL">Excel/CSV</option>
              <option value="IMAGE">Image</option>
            </select>
          </div>
  
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Upload File</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {contentFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {contentFile.name} ({Math.round(contentFile.size / 1024)} KB)
              </p>
            )}
          </div>
  
          <div className="mt-auto">
            <button
              onClick={handleAddContent}
              disabled={!contentFile || !newContent.name}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${(!contentFile || !newContent.name) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Upload Content
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  export default AddContentModal