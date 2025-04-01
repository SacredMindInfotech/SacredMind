import { SetStateAction, Dispatch } from 'react';


interface Module {
    id: number;
    serialNumber: number;
    title: string;
    courseId: number;
    topics: Topic[];
}
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

const AddModuleModal = ({
    isModuleModalOpen,
    setIsModuleModalOpen,
    isEditing,
    currentModule,
    setCurrentModule,
    newModule,
    setNewModule,
    handleAddModule,
    handleUpdateModule
}: {
    isModuleModalOpen: boolean,
    setIsModuleModalOpen: Dispatch<SetStateAction<boolean>>,
    isEditing: boolean,
    currentModule: Module | null,
    setCurrentModule: Dispatch<SetStateAction<Module | null>>,
    newModule: {
        title: string,
        serialNumber: number,
    },
    setNewModule: Dispatch<SetStateAction<{
        title: string,
        serialNumber: number,
    }>>,
    handleAddModule: () => void,
    handleUpdateModule: () => void
}) => {
    return (
        <div
            className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${isModuleModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            <div className="h-full flex flex-col p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                        {isEditing ? 'Edit Module' : 'Add New Module'}
                    </h3>
                    <button
                        onClick={() => {
                            setIsModuleModalOpen(false);
                            setCurrentModule(null);
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
                        value={isEditing ? currentModule?.serialNumber : newModule.serialNumber}
                        onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            if (isEditing && currentModule) {
                                setCurrentModule({ ...currentModule, serialNumber: value });
                            } else {
                                setNewModule({ ...newModule, serialNumber: value });
                            }
                        }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Title</label>
                    <input
                        type="text"
                        value={isEditing ? currentModule?.title : newModule.title}
                        onChange={(e) => {
                            if (isEditing && currentModule) {
                                setCurrentModule({ ...currentModule, title: e.target.value });
                            } else {
                                setNewModule({ ...newModule, title: e.target.value });
                            }
                        }}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>

                <div className="mt-auto">
                    <button
                        onClick={isEditing ? handleUpdateModule : handleAddModule}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        disabled={isEditing ? !currentModule?.title : !newModule.title}
                    >
                        {isEditing ? 'Update Module' : 'Add Module'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddModuleModal