import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import DataTable from 'react-data-table-component';
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";


interface User {
    id: number;
    clerkuserId: string;
    email: string;
    firstName: string;
    lastName: string | null;
    imageUrl: string | null;
    role: "ADMIN" | "USER" | "MANAGER";
    createdAt: Date;
    updatedAt: Date;
}

interface SelectedRows {
    allSelected: boolean;
    selectedCount: number;
    selectedRows: {
        clerkuserId: string,
        createdAt: string,
        email: string,
        firstName: string,
        lastName: string,
        role: string,
        updatedAt: string,
    }[];
}


const columns = [
    {
        name: 'email',
        selector: (row: any) => row.email,
        sortable: true,
    },
    {
        name: 'firstName',
        selector: (row: any) => row.firstName,
        sortable: true,
    },
    {
        name: 'lastName',
        selector: (row: any) => row.lastName,
        sortable: true,
    },
    {
        name: 'role',
        selector: (row: any) => row.role,
        sortable: true,
    },
    {
        name: 'createdAt',
        selector: (row: any) => row.createdAt,
        sortable: true,
    },
    {
        name: 'updatedAt',
        selector: (row: any) => row.updatedAt,
        sortable: true,
    },
];

//expanded user details component
const ExpandedComponent = ({ data }: { data: any }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="p-8 space-y-6 bg-white shadow-xl rounded-xl mx-4 my-6 border border-gray-100"
        style={{ 
            maxWidth: "calc(100% - 2rem)",
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)"
        }}
    >
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 flex items-center gap-4"
        >
            {data.imageUrl ? (
                <img 
                    src={data.imageUrl}
                    alt={`${data.firstName} ${data.lastName}`} 
                    className="h-16 w-16 rounded-full object-cover border-2 border-blue-100"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=User';
                    }}
                />
            ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {data.firstName.charAt(0)}{data.lastName?.charAt(0)}
                </div>
            )}
            <div>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    data.role === "ADMIN" ? "bg-red-100 text-red-800" : 
                    data.role === "MANAGER" ? "bg-blue-100 text-blue-800" : 
                    "bg-green-100 text-green-800"
                } mb-2`}>
                    {data.role}
                </span>
                <h1 className="text-2xl font-bold text-gray-800">{data.firstName} {data.lastName}</h1>
                <p className="text-gray-600">{data.email}</p>
            </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-6"
        >
            <motion.div 
                whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
                className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
            >
                <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">User ID</h2>
                <p className="text-sm text-gray-800 font-mono bg-gray-50 p-2 rounded overflow-x-auto">{data.clerkuserId}</p>
            </motion.div>

            <motion.div 
                whileHover={{ y: -5, boxShadow: "0 12px 20px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
                className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm"
            >
                {/* <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Dates</h2> */}
                <div className="space-y-2">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Created at</span>
                        <span className="text-sm font-medium text-gray-800">{data.createdAt}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Updated at</span>
                        <span className="text-sm font-medium text-gray-800">{data.updatedAt}</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    </motion.div>
);

//role changing dialog
const RoleChangingDialog = ({ isLoading, setIsRoleDialogOpen, handleRoleChange }: { isLoading: boolean, setIsRoleDialogOpen: (value: boolean) => void, handleRoleChange: (newRole: "ADMIN" | "MANAGER" | "USER") => void }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Select New Role</h2>
                    <button
                        onClick={() => !isLoading && setIsRoleDialogOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="space-y-3">
                    <button
                        onClick={() => !isLoading && handleRoleChange("ADMIN")}
                        disabled={isLoading}
                        className="w-full p-3 text-left hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3 group disabled:opacity-50"
                    >
                        <span className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <div>
                            <div className="font-medium text-gray-900">Admin</div>
                            <div className="text-sm text-gray-500">Full system access</div>
                        </div>
                    </button>
                    <button
                        onClick={() => !isLoading && handleRoleChange("MANAGER")}
                        disabled={isLoading}
                        className="w-full p-3 text-left hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3 group disabled:opacity-50"
                    >
                        <span className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                        </span>
                        <div>
                            <div className="font-medium text-gray-900">Manager</div>
                            <div className="text-sm text-gray-500">Limited administrative access</div>
                        </div>
                    </button>
                    <button
                        onClick={() => !isLoading && handleRoleChange("USER")}
                        disabled={isLoading}
                        className="w-full p-3 text-left hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-3 group disabled:opacity-50"
                    >
                        <span className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <div>
                            <div className="font-medium text-gray-900">User</div>
                            <div className="text-sm text-gray-500">Standard user access</div>
                        </div>
                    </button>
                </div>

                <div className="mt-6 flex justify-end gap-3"></div>
                <button
                    onClick={() => !isLoading && setIsRoleDialogOpen(false)}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                {isLoading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Updating roles...
                    </div>
                )}
            </div>

        </div>
    );
};

const UserManagement = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [adminCount, setAdminCount] = useState(0);
    const [managerCount, setManagerCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    //data is used to search for keywords in the table and update filtered data
    const [data, setData] = useState<{
        email: string;
        firstName: string;
        lastName: string | null;
        role: "ADMIN" | "USER" | "MANAGER";
        createdAt: string;
        updatedAt: string;
        clerkuserId: string;
    }[]>([]);
    const { getToken } = useAuth();
    const [selectedRows, setSelectedRows] = useState<SelectedRows | null>(null);
    const [toggleClearSelectedRows, setToggleClearSelectedRows] = useState(false);
    const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = useUser().user;
    const [progressPending, setProgressPending] = useState(true);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        email: '',
        firstName: '',
        lastName: '',
        role: '' as '' | 'ADMIN' | 'MANAGER' | 'USER',
        createdAfter: '',
        createdBefore: '',
    });
    const [filteredData, setFilteredData] = useState<typeof data>([]);
    const [expandedRow, setExpandedRow] = useState<any>(null);
    const [selectedTab, setSelectedTab] = useState<'users' | 'roles'>('users');

    //fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            const token = await getToken();
            const response = await axios.get(`${backendUrl}api/v1/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data as User[]);
        };
        fetchUsers();
    }, [getToken]);

    //fetch counts for admins, managers and users
    const fetchCounts = () => {
        const adminCount = users.filter(user => user.role === "ADMIN").length;
        const managerCount = users.filter(user => user.role === "MANAGER").length;
        const userCount = users.filter(user => user.role === "USER").length;

        setAdminCount(adminCount);
        setManagerCount(managerCount);
        setUserCount(userCount);
    };

    useEffect(() => {
        fetchCounts();
    }, [users]);

    //set data for table
    useEffect(() => {
        if (users.length > 0) {
            const formattedData = users.map((user) => ({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                createdAt: new Date(user.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }),
                updatedAt: new Date(user.updatedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                }),
                clerkuserId: user.clerkuserId
            }));
            setData(formattedData);
            setFilteredData(formattedData);
            setProgressPending(false);
        }
    }, [users]);



    //disable row if user is the same as the current user
    const rowDisabledCriteria = (row: any) => row.email === user?.emailAddresses[0].emailAddress;
    
    //option for pagination to see all rows at once
    const paginationComponentOptions = {
        selectAllRowsItem: true,
    };

    //handle row selected - setting the selected rows
    const handleRowSelected = (selectedRows: SelectedRows) => {
        setSelectedRows(selectedRows);
    };

    //role change handler for selected rows
    const handleRoleChange = async (newRole: "ADMIN" | "MANAGER" | "USER") => {
        setIsLoading(true);
        const token = await getToken();
        try {
            // Update each selected user's role
            const updatePromises = selectedRows?.selectedRows.map(user =>
                axios.post(
                    `${backendUrl}api/v1/admin/users/${user.clerkuserId}`,
                    { role: newRole },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
            );

            if (updatePromises) {
                await Promise.all(updatePromises);
                // Refresh the users list
                const response = await axios.get(`${backendUrl}api/v1/admin/users`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data as User[]);
                setToggleClearSelectedRows(!toggleClearSelectedRows);
                setIsRoleDialogOpen(false);
            }
        } catch (error) {
            console.error('Failed to update roles:', error);
            // Add error handling here
        } finally {
            setIsLoading(false);
        }
    };

    //context actions for the table for changing role of selected users
    const contextActions = useMemo(
        () => (
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium"
                onClick={() => setIsRoleDialogOpen(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Change Role
            </button>
        ), []);

    // Apply advanced filters
    useEffect(() => {
        const filtered = data.filter(item => {
            // Advanced filters
            if (filters.email && !item.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
            if (filters.firstName && !item.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) return false;
            if (filters.lastName && item.lastName && !item.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) return false;
            if (filters.role && item.role !== filters.role) return false;
            
            // Date filters - convert DD/MM/YY format to Date objects
            if (filters.createdAfter) {
                // Parse date from DD/MM/YY format
                const parts = item.createdAt.split('/');
                if (parts.length === 3) {
                    // Convert to YYYY-MM-DD for comparison
                    const day = parts[0];
                    const month = parts[1];
                    const year = "20" + parts[2]; // Assuming 20xx for the year
                    const itemDate = new Date(`${year}-${month}-${day}`);
                    const filterDate = new Date(filters.createdAfter);
                    if (itemDate < filterDate) return false;
                }
            }
            
            if (filters.createdBefore) {
                // Parse date from DD/MM/YY format
                const parts = item.createdAt.split('/');
                if (parts.length === 3) {
                    // Convert to YYYY-MM-DD for comparison
                    const day = parts[0];
                    const month = parts[1];
                    const year = "20" + parts[2]; // Assuming 20xx for the year
                    const itemDate = new Date(`${year}-${month}-${day}`);
                    const filterDate = new Date(filters.createdBefore);
                    if (itemDate > filterDate) return false;
                }
            }
            
            return true;
        });
        
        setFilteredData(filtered);
    }, [data, filters]);

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            email: '',
            firstName: '',
            lastName: '',
            role: '',
            createdAfter: '',
            createdBefore: '',
        });
        setResetPaginationToggle(!resetPaginationToggle);
    };

    // Handle filter changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Update subHeaderComponent to only show the filter toggle button
    const subHeaderComponentMemo = useMemo(() => {
        return (
            <div className="mb-4 flex justify-end items-center w-full">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    Filters
                </button>
            </div>
        );
    }, [showFilters]);

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-gray-900 text-white p-6">
                            <h2 className="text-xl font-bold mb-8 border-b border-gray-700 pb-4">User Management</h2>
                            <div className="flex flex-col gap-3">
                                <button 
                                    className={`p-3 rounded-md flex items-center transition-all ${selectedTab === 'users' ? 'bg-white text-gray-900 font-medium' : 'hover:bg-gray-800'}`} 
                                    onClick={() => setSelectedTab('users')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                    </svg>
                                    User List
                                </button>
                                <button
                                    className={`p-3 rounded-md flex items-center transition-all ${selectedTab === 'roles' ? 'bg-white text-gray-900 font-medium' : 'hover:bg-gray-800'}`} 
                                    onClick={() => setSelectedTab('roles')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Role Management
                                </button>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            
                            <div className="p-6">
                                {selectedTab === 'users' && (
                                    <div className="overflow-x-auto bg-white min-h-[200px] rounded-lg shadow">
                                        <DataTable
                                            title="Users"
                                            columns={columns}
                                            data={filteredData}
                                            selectableRows
                                            pagination
                                            onRowClicked={(row) => setExpandedRow(row)}
                                            selectableRowDisabled={rowDisabledCriteria}
                                            //@ts-ignore
                                            onSelectedRowsChange={handleRowSelected}
                                            contextActions={contextActions}
                                            clearSelectedRows={toggleClearSelectedRows}
                                            paginationComponentOptions={paginationComponentOptions}
                                            fixedHeader
                                            progressPending={progressPending}
                                            progressComponent={<div className="flex justify-center items-center h-full">
                                                <div className="w-10 h-10 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
                                            </div>}
                                            paginationResetDefaultPage={resetPaginationToggle}
                                            subHeader
                                            subHeaderComponent={subHeaderComponentMemo}
                                            highlightOnHover
                                            pointerOnHover
                                        />
                                    </div>
                                )}
                                
                                {selectedTab === 'roles' && (
                                    <div className="bg-white p-6 rounded-lg shadow">
                                        <h2 className="text-xl font-bold mb-6">Role Distribution</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-red-50 p-6 rounded-lg border border-red-100">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-red-800 text-sm font-medium">Admins</p>
                                                        <p className="text-3xl font-bold text-red-900">{adminCount}</p>
                                                    </div>
                                                    <div className="p-3 bg-red-100 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-red-700">Full system access</p>
                                            </div>
                                            
                                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-blue-800 text-sm font-medium">Managers</p>
                                                        <p className="text-3xl font-bold text-blue-900">{managerCount}</p>
                                                    </div>
                                                    <div className="p-3 bg-blue-100 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-blue-700">Limited administrative access</p>
                                            </div>
                                            
                                            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-green-800 text-sm font-medium">Users</p>
                                                        <p className="text-3xl font-bold text-green-900">{userCount}</p>
                                                    </div>
                                                    <div className="p-3 bg-green-100 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-sm text-green-700">Standard user access</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Filters Sidebar */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button 
                            onClick={() => setShowFilters(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="text"
                                id="email"
                                name="email"
                                value={filters.email}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by email"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={filters.firstName}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by first name"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={filters.lastName}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by last name"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={filters.role}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Roles</option>
                                <option value="ADMIN">Admin</option>
                                <option value="MANAGER">Manager</option>
                                <option value="USER">User</option>
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="createdAfter" className="block text-sm font-medium text-gray-700 mb-1">Created After</label>
                            <input
                                type="date"
                                id="createdAfter"
                                name="createdAfter"
                                value={filters.createdAfter}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="createdBefore" className="block text-sm font-medium text-gray-700 mb-1">Created Before</label>
                            <input
                                type="date"
                                id="createdBefore"
                                name="createdBefore"
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        
                        <div className="pt-4 flex gap-2">
                            <button
                                onClick={resetFilters}
                                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overlay for filters sidebar - removed blur effect */}
            {showFilters && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => setShowFilters(false)}
                ></div>
            )}

            {/* Overlay when expanded component is shown */}
            {expandedRow && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setExpandedRow(null)}
                ></div>
            )}

            {/* Expanded user details sidebar */}
            {expandedRow && (
                <div className="fixed top-4 bottom-4 right-0 h-[90%] w-full md:w-1/3 bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform translate-x-0 rounded-lg mr-4">
                    <div className="p-4 sticky top-0 bg-white z-10 flex justify-between items-center rounded-lg">
                        <h2 className="text-xl font-bold">User Details</h2>
                        <button 
                            onClick={() => setExpandedRow(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <ExpandedComponent data={expandedRow} />
                </div>
            )}

            {/* Role Selection Dialog */}
            {isRoleDialogOpen && (
                <RoleChangingDialog isLoading={isLoading} setIsRoleDialogOpen={setIsRoleDialogOpen} handleRoleChange={handleRoleChange}></RoleChangingDialog>
            )}
        </div>
    );
};

export default UserManagement;