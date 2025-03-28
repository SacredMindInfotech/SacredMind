import { useState, useEffect } from 'react';
import { useAuth } from "@clerk/clerk-react";
import { toast } from 'react-hot-toast';
import axios from 'axios';


interface Course {
    id: number;
    title: string;
    description: string;
    isActive: boolean;
    showCourseNotice: boolean;
    price: number;
    imageUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
    categoryId: number;
    category: Category | null;
    overview: string[];
    learningOutcomes: string[];
    requirements: string[];
    forwhom: string[];
    language: string;
    courseNotice: string | null;
    modules: Module[];
}
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

interface Category {
    id: number;
    name: string;
    parentId: number | null;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CourseModules = ({ course }: {course:Course}) => {
  const { getToken } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [newModule, setNewModule] = useState({ title: '', serialNumber: 1 });
  const [newTopic, setNewTopic] = useState({ title: '', description: '', serialNumber: 1 });
  const [isEditing, setIsEditing] = useState(false);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [newContent, setNewContent] = useState({
    name: '',
    type: 'VIDEO' as 'VIDEO' | 'PDF' | 'EXCEL' | 'IMAGE',
  });
  const [isEditContentModalOpen, setIsEditContentModalOpen] = useState(false);
  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [editedContentName, setEditedContentName] = useState('');

  // Initialize modules from course prop
  useEffect(() => {
    if (course && course.modules) {
      setModules(course.modules);
    }
  }, [course]);

  // Fetch modules - now used for refreshing after changes
  const fetchModules = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await axios.get(`${backendUrl}api/v1/course/${course.id}/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModules(response.data as Module[]);
    } catch (error) {
      console.error('Error fetching modules:', error);
      toast.error('Failed to load course modules');
    } finally {
      setLoading(false);
    }
  };

  // Add new module
  const handleAddModule = async () => {
    try {
      const token = await getToken();
      
      
      const response = await axios.post(`${backendUrl}api/v1/admin/${course.id}/modules`,newModule, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      
      if (response.status === 201) {
        toast.success('Module added successfully');
        setIsModuleModalOpen(false);
        setNewModule({ title: '', serialNumber: 1 });
        await fetchModules();
      } else {
        toast.error('Failed to add module');
      }
    } catch (error) {
      console.error('Error adding module:', error);
      toast.error('Failed to add module');
    }
  };

  // Update module
  const handleUpdateModule = async () => {
    if (!currentModule) return;
    
    try {
      const token = await getToken();
    
      const response = await axios.put(`${backendUrl}api/v1/admin/${course.id}/modules/${currentModule.id}`,
        {
            title: currentModule.title,
            serialNumber: currentModule.serialNumber
        },
        {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      
      if (response.status === 200) {
        toast.success('Module updated successfully');
        setIsModuleModalOpen(false);
        setCurrentModule(null);
        setIsEditing(false);
        await fetchModules();
      } else {
        toast.error('Failed to update module');
      }
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Failed to update module');
    }
  };

  // Delete module
  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all topics within it.')) {
      return;
    }
    
    try {
      const token = await getToken();
      const moduleToDelete = modules.find(m => m.id === moduleId);
      
      if (!moduleToDelete) return;
      
      const response = await axios.delete(`${backendUrl}api/v1/admin/${course.id}/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 200) {
        toast.success('Module deleted successfully');
        await fetchModules();
      } else {
        toast.error('Failed to delete module');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
    }
  };

  // Add new topic
  const handleAddTopic = async () => {
    if (!currentModule) return;
    
    try {
      const token = await getToken();
      
      const response = await axios.post(`${backendUrl}api/v1/admin/modules/${currentModule.id}/topics`, newTopic, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      
      if (response.status === 201) {
        toast.success('Topic added successfully');
        setIsTopicModalOpen(false);
        setNewTopic({ title: '', description: '', serialNumber: 1 });
        await fetchModules();
      } else {
        toast.error('Failed to add topic');
      }
    } catch (error) {
      console.error('Error adding topic:', error);
      toast.error('Failed to add topic');
    }
  };

  // Update topic
  const handleUpdateTopic = async () => {
    if (!currentModule || !currentTopic) return;
    
    try {
      const token = await getToken();
      
      const response = await axios.put(`${backendUrl}api/v1/admin/modules/${currentModule.id}/topics/${currentTopic.id}`,
        {
            title: currentTopic.title,
            description: currentTopic.description,
            serialNumber: currentTopic.serialNumber
        },
        {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
      });
      
      if (response.status === 200) {
        toast.success('Topic updated successfully');
        setIsTopicModalOpen(false);
        setCurrentTopic(null);
        setIsEditing(false);
        await fetchModules();
      } else {
        toast.error('Failed to update topic');
      }
    } catch (error) {
      console.error('Error updating topic:', error);
      toast.error('Failed to update topic');
    }
  };

  // Delete topic
  const handleDeleteTopic = async (moduleId: number, topicId: number) => {
    if (!confirm('Are you sure you want to delete this topic?')) {
      return;
    }
    
    try {
      const token = await getToken();
      const moduleWithTopic = modules.find(m => m.id === moduleId);
      
      if (!moduleWithTopic) return;
      
      const topicToDelete = moduleWithTopic.topics.find(t => t.id === topicId);
      
      if (!topicToDelete) return;
      
      const response = await axios.delete(`${backendUrl}api/v1/admin/modules/${moduleId}/topics/${topicId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.status === 200) {
        toast.success('Topic deleted successfully');
        await fetchModules();
      } else {
        toast.error('Failed to delete topic');
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
      toast.error('Failed to delete topic');
    }
  };

  // Open module modal for adding
  const openAddModuleModal = () => {
    setIsEditing(false);
    setNewModule({ 
      title: '', 
      serialNumber: modules.length > 0 ? Math.max(...modules.map(m => m.serialNumber)) + 1 : 1 
    });
    setIsModuleModalOpen(true);
  };

  // Open module modal for editing
  const openEditModuleModal = (module: Module) => {
    setIsEditing(true);
    setCurrentModule({ ...module });
    setIsModuleModalOpen(true);
  };

  // Open topic modal for adding
  const openAddTopicModal = (module: Module) => {
    setIsEditing(false);
    setCurrentModule(module);
    setNewTopic({ 
      title: '', 
      description: '', 
      serialNumber: module.topics.length > 0 ? Math.max(...module.topics.map(t => t.serialNumber)) + 1 : 1 
    });
    setIsTopicModalOpen(true);
  };

  // Open topic modal for editing
  const openEditTopicModal = (module: Module, topic: Topic) => {
    setIsEditing(true);
    setCurrentModule(module);
    setCurrentTopic({ ...topic });
    setIsTopicModalOpen(true);
  };

  // Add content to a topic
  const handleAddContent = async () => {
    if (!currentTopic || !contentFile) return;
    
    try {
      const token = await getToken();
      
      const formData = new FormData();
      formData.append('file', contentFile);
      formData.append('name', newContent.name);
      formData.append('type', newContent.type);
      formData.append('courseName', course.title);
      
      const response = await axios.post(
        `${backendUrl}api/v1/admin/${currentTopic.id}/content`, 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.status === 201) {
        toast.success('Content added successfully');
        setIsContentModalOpen(false);
        setContentFile(null);
        setNewContent({
          name: '',
          type: 'VIDEO',
        });
        await fetchModules();
      } else {
        toast.error('Failed to add content');
      }
    } catch (error) {
      console.error('Error adding content:', error);
      toast.error('Failed to add content');
    }
  };

  // Open content modal
  const openAddContentModal = (module: Module, topic: Topic) => {
    setCurrentModule(module);
    setCurrentTopic(topic);
    setNewContent({
      name: '',
      type: 'VIDEO',
    });
    setContentFile(null);
    setIsContentModalOpen(true);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setContentFile(e.target.files[0]);
      
      // Auto-fill name with filename if empty
      if (!newContent.name) {
        const fileName = e.target.files[0].name.split('.')[0];
        setNewContent({...newContent, name: fileName});
      }
      
      // Auto-detect file type based on extension
      const fileExtension = e.target.files[0].name.split('.').pop()?.toLowerCase();
      if (fileExtension) {
        if (['mp4', 'mov', 'avi', 'webm'].includes(fileExtension)) {
          setNewContent({...newContent, type: 'VIDEO'});
        } else if (fileExtension === 'pdf') {
          setNewContent({...newContent, type: 'PDF'});
        } else if (['xls', 'xlsx', 'csv'].includes(fileExtension)) {
          setNewContent({...newContent, type: 'EXCEL'});
        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
          setNewContent({...newContent, type: 'IMAGE'});
        }
      }
    }
  };

  // Handle content name update
  const handleUpdateContent = async () => {
    if (!currentContent || !currentModule || !currentTopic) return;
    
    try {
      const token = await getToken();
      
      const response = await axios.put(
        `${backendUrl}api/v1/admin/content/${currentContent.id}`, 
        {
          name: editedContentName,
          courseName: course.title,
          key: currentContent.key
        }, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      if (response.status === 200) {
        toast.success('Content updated successfully');
        setIsEditContentModalOpen(false);
        setCurrentContent(null);
        await fetchModules();
      } else {
        toast.error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
      toast.error('Failed to update content');
    }
  };

  // Open edit content modal
  const openEditContentModal = (module: Module, topic: Topic, content: Content) => {
    setCurrentModule(module);
    setCurrentTopic(topic);
    setCurrentContent(content);
    setEditedContentName(content.name);
    setIsEditContentModalOpen(true);
  };

  // Add this function to handle content deletion
  const handleDeleteContent = async (content: Content) => {
    if (!confirm('Are you sure you want to delete this content?')) {
      return;
    }
    
    try {
      const token = await getToken();
      
      const response = await axios.delete(
        `${backendUrl}api/v1/admin/content/${content.id}`, 
        {
          params: { key: content.key },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.status === 200) {
        toast.success('Content deleted successfully');
        await fetchModules();
      } else {
        toast.error('Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  // Add this function to handle viewing content
  const handleViewContent = (content: Content) => {
    // Open the content in a new tab using the same URL pattern as viewContent.tsx
    window.open(`/course/${course.id}/content/${encodeURIComponent(content.key)}`, '_blank');
  };

  // Add useEffect for handling Escape key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModuleModalOpen(false);
        setIsTopicModalOpen(false);
        setIsContentModalOpen(false);
        setIsEditContentModalOpen(false);
        setCurrentModule(null);
        setCurrentTopic(null);
        setCurrentContent(null);
      }
    };

    // Add event listener for keydown
    document.addEventListener('keydown', handleEscapeKey);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Modules</h2>
        <button 
          onClick={openAddModuleModal}
          className="px-6 py-3 bg-white border border-gray-300  text-gray-800 font-medium rounded-lg  hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer"
        >
          Add Module
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading modules...</div>
      ) : modules.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No modules found. Add your first module to get started.</div>
      ) : (
        <div className="space-y-6">
          {modules.map((module) => (
            <div key={module.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {module.serialNumber}. {module.title}
                </h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => openAddTopicModal(module)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Add Topic
                  </button>
                  <button 
                    onClick={() => openEditModuleModal(module)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteModule(module.id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {module.topics.length === 0 ? (
                <div className="text-gray-500 text-sm pl-4">No topics in this module yet.</div>
              ) : (
                <div className="pl-4 space-y-3">
                  {module.topics.sort((a, b) => a.serialNumber - b.serialNumber).map((topic) => (
                    <div key={topic.id} className="border-l-2 border-gray-300 pl-4 py-2">
                      <div className="flex justify-between items-center">
                        <div className="w-full">
                          <h4 className="font-medium">
                            {module.serialNumber}.{topic.serialNumber} {topic.title}
                          </h4>
                          <p className="text-sm text-gray-600">{topic.description}</p>
                          
                          {/* Content details with debugging */}
                          {topic.contents ? (
                            <div className="mt-2">
                              <div className="flex items-center">
                                <p className="text-xs font-medium text-gray-500">
                                  Content ({topic.contents.length}):
                                </p>
                                <button 
                                  onClick={() => openAddContentModal(module, topic)}
                                  className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1 px-2 rounded"
                                >
                                  Add Content
                                </button>
                              </div>
                              
                              {topic.contents.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {topic.contents.map((content) => (
                                    <div 
                                      key={content.id} 
                                      className={`text-xs px-2 py-1 rounded-md flex items-center ${
                                        content.type === 'VIDEO' ? 'bg-red-100 text-red-700' :
                                        content.type === 'PDF' ? 'bg-blue-100 text-blue-700' :
                                        content.type === 'EXCEL' ? 'bg-green-100 text-green-700' :
                                        content.type === 'IMAGE' ? 'bg-amber-100 text-amber-700' :
                                        'bg-gray-100 text-gray-700'
                                      }`}
                                    >
                                      <span>{content.name} ({content.type})</span>
                                      <div className="flex ml-2">
                                        <button
                                          onClick={() => handleViewContent(content)}
                                          className="text-blue-600 hover:text-blue-900 mr-1 p-1"
                                          title="View content"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={() => openEditContentModal(module, topic, content)}
                                          className="text-gray-600 hover:text-gray-900 mr-1 p-1"
                                          title="Edit content name"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                          </svg>
                                        </button>
                                        <button
                                          onClick={() => handleDeleteContent(content)}
                                          className="text-red-600 hover:text-red-900 p-1"
                                          title="Delete content"
                                        >
                                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-xs text-gray-500 mt-1">No content available</p>
                              )}
                            </div>
                          ) : (
                            <div className="mt-2">
                              <div className="flex items-center">
                                <p className="text-xs text-gray-500">Content data unavailable</p>
                                <button 
                                  onClick={() => openAddContentModal(module, topic)}
                                  className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1 px-2 rounded"
                                >
                                  Add Content
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-2 shrink-0">
                          <button 
                            onClick={() => openEditTopicModal(module, topic)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteTopic(module.id, topic.id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Module Modal */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 backdrop-blur-lg bg-white/70 flex items-center justify-center z-50"
             onClick={(e) => {
               if (e.target === e.currentTarget) {
                 setIsModuleModalOpen(false);
                 setCurrentModule(null);
               }
             }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Module' : 'Add New Module'}
            </h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Serial Number</label>
              <input
                type="number"
                min="1"
                value={isEditing ? currentModule?.serialNumber : newModule.serialNumber}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  if (isEditing && currentModule) {
                    setCurrentModule({...currentModule, serialNumber: value});
                  } else {
                    setNewModule({...newModule, serialNumber: value});
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
                    setCurrentModule({...currentModule, title: e.target.value});
                  } else {
                    setNewModule({...newModule, title: e.target.value});
                  }
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModuleModalOpen(false);
                  setCurrentModule(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleUpdateModule : handleAddModule}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isEditing ? !currentModule?.title : !newModule.title}
              >
                {isEditing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Topic Modal */}
      {isTopicModalOpen && (
        <div className="fixed inset-0 backdrop-blur-lg bg-white/70 flex items-center justify-center z-50"
             onClick={(e) => {
               if (e.target === e.currentTarget) {
                 setIsTopicModalOpen(false);
                 setCurrentTopic(null);
               }
             }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Topic' : 'Add New Topic'}
            </h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Serial Number</label>
              <input
                type="number"
                min="1"
                value={isEditing ? currentTopic?.serialNumber : newTopic.serialNumber}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  if (isEditing && currentTopic) {
                    setCurrentTopic({...currentTopic, serialNumber: value});
                  } else {
                    setNewTopic({...newTopic, serialNumber: value});
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
                    setCurrentTopic({...currentTopic, title: e.target.value});
                  } else {
                    setNewTopic({...newTopic, title: e.target.value});
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
                    setCurrentTopic({...currentTopic, description: e.target.value});
                  } else {
                    setNewTopic({...newTopic, description: e.target.value});
                  }
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsTopicModalOpen(false);
                  setCurrentTopic(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={isEditing ? handleUpdateTopic : handleAddTopic}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isEditing 
                  ? !currentTopic?.title || !currentTopic?.description 
                  : !newTopic.title || !newTopic.description}
              >
                {isEditing ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Upload Modal */}
      {isContentModalOpen && (
        <div className="fixed inset-0 backdrop-blur-lg bg-white/70 flex items-center justify-center z-50"
             onClick={(e) => {
               if (e.target === e.currentTarget) {
                 setIsContentModalOpen(false);
                 setContentFile(null);
               }
             }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Add Content to Topic: {currentTopic?.title}
            </h2>
            
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
                    setNewContent({...newContent, name: newName});
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
                <option value="EXCEL">Excel</option>
                <option value="IMAGE">Image</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Upload File</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                accept={
                  newContent.type === 'VIDEO' ? 'video/*' :
                  newContent.type === 'PDF' ? 'application/pdf' :
                  newContent.type === 'EXCEL' ? '.xls,.xlsx,.csv' :
                  newContent.type === 'IMAGE' ? 'image/*' : undefined
                }
              />
              {contentFile && (
                <p className="text-sm text-green-600 mt-1">
                  Selected file: {contentFile.name} ({(contentFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsContentModalOpen(false);
                  setContentFile(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContent}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={!newContent.name || !contentFile}
              >
                Upload Content
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Content Name Modal */}
      {isEditContentModalOpen && (
        <div className="fixed inset-0 backdrop-blur-lg bg-white/70 flex items-center justify-center z-50"
             onClick={(e) => {
               if (e.target === e.currentTarget) {
                 setIsEditContentModalOpen(false);
                 setCurrentContent(null);
               }
             }}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Edit Content Name
            </h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Content Name</label>
              <input
                type="text"
                value={editedContentName}
                onChange={(e) => {
                  const newValue = e.target.value.replace(/\./g, '');
                  if (e.target.value.includes('.')) {
                    toast.error('Content name cannot contain periods.');
                  }
                  setEditedContentName(newValue);
                }}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter new content name"
              />
              <p className="text-xs text-gray-500 mt-1">
                Current type: {currentContent?.type}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsEditContentModalOpen(false);
                  setCurrentContent(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateContent}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={!editedContentName}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseModules;