import {  SetStateAction, Dispatch } from 'react';

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



const AddTopicModal = ({
  isTopicModalOpen,
  setIsTopicModalOpen,
  isEditing,
  currentTopic,
  setCurrentTopic,
  newTopic,
  setNewTopic,
  handleAddTopic,
  handleUpdateTopic
}: {
  isTopicModalOpen: boolean,
  setIsTopicModalOpen: Dispatch<SetStateAction<boolean>>,
  isEditing: boolean,
  currentTopic: Topic | null,
  setCurrentTopic: Dispatch<SetStateAction<Topic | null>>,
  newTopic: {
    title: string,
    description: string,
    serialNumber: number,
  },
  setNewTopic: Dispatch<SetStateAction<{
    title: string,
    description: string,
    serialNumber: number,
  }>>,
  handleAddTopic: () => void,
  handleUpdateTopic: () => void
}) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isTopicModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {isEditing ? 'Edit Topic' : 'Add New Topic'}
          </h3>
          <button
            onClick={() => {
              setIsTopicModalOpen(false);
              setCurrentTopic(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Serial Number</label>
          <input
            type="number"
            min="1"
            value={isEditing ? currentTopic?.serialNumber : newTopic.serialNumber}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              if (isEditing && currentTopic) {
                setCurrentTopic({ ...currentTopic, serialNumber: value });
              } else {
                setNewTopic({ ...newTopic, serialNumber: value });
              }
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Title</label>
          <input
            required
            type="text"
            value={isEditing ? currentTopic?.title : newTopic.title}
            onChange={(e) => {
              if (isEditing && currentTopic) {
                setCurrentTopic({ ...currentTopic, title: e.target.value });
              } else {
                setNewTopic({ ...newTopic, title: e.target.value });
              }
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Description</label>
          <textarea
            required
            value={isEditing ? currentTopic?.description : newTopic.description}
            onChange={(e) => {
              if (isEditing && currentTopic) {
                setCurrentTopic({ ...currentTopic, description: e.target.value });
              } else {
                setNewTopic({ ...newTopic, description: e.target.value });
              }
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
          />
        </div>

        <div className="mt-auto">
          <button
            onClick={isEditing ? handleUpdateTopic : handleAddTopic}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={isEditing
              ? !currentTopic?.title || !currentTopic?.description
              : !newTopic.title || !newTopic.description}
          >
            {isEditing ? 'Update Topic' : 'Add Topic'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddTopicModal