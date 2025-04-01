import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

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
    overview: string[];
    learningOutcomes: string[];
    requirements: string[];
    forwhom: string[];
    language: string;
    courseNotice: string | null;
}

interface EnrolledUser {
    id: number;
    email: string;
    firstName: string;
    lastName: string | null;
    role: string | null;
    enrolledAt: string;
}

interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string | null;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const CourseEnrollments = ({ course }: {course: Course}) => {
    const [enrolledUsers, setEnrolledUsers] = useState<EnrolledUser[]>([]);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getToken } = useAuth();
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<EnrolledUser | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchEnrolledUsers = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                const response = await axios.get(`${backendUrl}api/v1/admin/courses/${course.id}/enrollments`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                //@ts-ignore
                setEnrolledUsers(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching enrolled users:", err);
                setError("Failed to load enrolled users. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (course?.id) {
            fetchEnrolledUsers();
        }
    }, [course?.id, getToken]);

    const fetchAllUsers = async () => {
        try {
            const token = await getToken();
            const response = await axios.get(`${backendUrl}api/v1/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            //@ts-ignore
            setAllUsers(response.data);
        } catch (err) {
            console.error("Error fetching all users:", err);
        }
    };

    const handleAddUser = async () => {
        if (!selectedUser) return;
        
        try {
            setActionLoading(true);
            const token = await getToken();
            await axios.post(`${backendUrl}api/v1/admin/${course.id}/adduser`, 
                { userId: selectedUser.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Refresh enrolled users list
            const response = await axios.get(`${backendUrl}api/v1/admin/courses/${course.id}/enrollments`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            //@ts-ignore
            setEnrolledUsers(response.data);
            toast.success("User added to course successfully");
            // Close modal and reset selection
            setShowAddUserModal(false);
            setSelectedUser(null);
            setSearchTerm("");
        } catch (err) {
            console.error("Error adding user to course:", err);
            setError("Failed to add user to course. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveUser = async () => {
        if (!userToDelete || deleteConfirmation !== "delete") return;
        
        try {
            setActionLoading(true);
            const token = await getToken();
            await axios.post(`${backendUrl}api/v1/admin/${course.id}/removeuser`, 
                { userId: userToDelete.id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            // Update the local state to remove the user
            setEnrolledUsers(enrolledUsers.filter(user => user.id !== userToDelete.id));
            toast.success("User removed from course successfully");
            // Close modal and reset
            setShowDeleteModal(false);
            setUserToDelete(null);
            setDeleteConfirmation("");
        } catch (err) {
            console.error("Error removing user from course:", err);
            setError("Failed to remove user from course. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const filteredUsers = allUsers.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !enrolledUsers.some(enrolledUser => enrolledUser.id === user.id)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-md">
                <p className="text-red-600">{error}</p>
            </div>
        );
    }

    return (    
        <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Users Enrolled</h2>
                    <button 
                        onClick={() => {
                            fetchAllUsers();
                            setShowAddUserModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Add User
                    </button>
                </div>
                
                {enrolledUsers.length === 0 ? (
                    <p className="text-gray-500">No users are currently enrolled in this course.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Enrolled On
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {enrolledUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.firstName} {user.lastName || ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">{user.role || 'User'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-500">
                                                {user.enrolledAt ? format((user.enrolledAt), 'dd/MM/yyyy') : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => {
                                                    setUserToDelete(user);
                                                    setShowDeleteModal(true);
                                                }}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add User Modal - Slide-in from right */}
            <div 
                className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${showAddUserModal ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="h-full flex flex-col p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Add User to Course</h3>
                        <button 
                            onClick={() => {
                                setShowAddUserModal(false);
                                setSelectedUser(null);
                                setSearchTerm("");
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search users by email..."
                            className="w-full p-2 border border-gray-300 rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex-grow overflow-y-auto mb-4">
                        {/* Selected User Section */}
                        {selectedUser && (
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Selected User</h4>
                                <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
                                    <div className="font-medium">{selectedUser.firstName} {selectedUser.lastName || ''}</div>
                                    <div className="text-sm text-gray-600">{selectedUser.email}</div>
                                    <button 
                                        onClick={() => setSelectedUser(null)}
                                        className="mt-2 text-xs text-blue-600 hover:text-blue-800"
                                    >
                                        Remove selection
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* User List */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Available Users</h4>
                            {filteredUsers.length > 0 ? (
                                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                                    {filteredUsers
                                        .filter(user => !selectedUser || user.id !== selectedUser.id)
                                        .map(user => (
                                            <li 
                                                key={user.id} 
                                                className="p-2 cursor-pointer hover:bg-gray-100"
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                <div className="font-medium">{user.firstName} {user.lastName || ''}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </li>
                                        ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 text-center py-2 border border-gray-200 rounded-md">
                                    {searchTerm ? "No matching users found" : "No users available to add"}
                                </p>
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-auto">
                        <button
                            onClick={handleAddUser}
                            disabled={!selectedUser || actionLoading}
                            className={`w-full px-4 py-2 bg-blue-600 text-white rounded-md ${!selectedUser || actionLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        >
                            {actionLoading ? 'Adding...' : 'Add User'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete User Modal - Slide-in from right */}
            <div 
                className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${showDeleteModal ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {userToDelete && (
                    <div className="h-full flex flex-col p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Remove User</h3>
                            <button 
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setUserToDelete(null);
                                    setDeleteConfirmation("");
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <div className="mb-4 bg-red-50 p-4 rounded-md">
                                <p className="mb-2">
                                    Are you sure you want to remove this user from the course?
                                </p>
                                <div className="font-medium">{userToDelete.firstName} {userToDelete.lastName || ''}</div>
                                <div className="text-sm text-gray-600">{userToDelete.email}</div>
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
                                onClick={handleRemoveUser}
                                disabled={deleteConfirmation !== "delete" || actionLoading}
                                className={`w-full px-4 py-2 bg-red-600 text-white rounded-md ${deleteConfirmation !== "delete" || actionLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
                            >
                                {actionLoading ? 'Removing...' : 'Remove User'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Main content wrapper - adjusts width when either sidebar is open */}
            <div className={`transition-all duration-300 ${showAddUserModal || showDeleteModal ? 'pr-80' : ''}`}>
                {/* Content goes here */}
            </div>
        </div>
    );
};

export default CourseEnrollments;
