import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import DataTable from 'react-data-table-component';
import { useEffect, useMemo, useState } from "react";
import RoleChangingDialog from "../../components/ui/dashboard/user/roleChangingDialog";
import ExpandedComponent from "../../components/ui/dashboard/user/expandedUserDetails";
import { useNavigate } from "react-router-dom";


interface User {
    id: number;
    clerkuserId: string;
    phoneNumber: string | null;
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
        cell: (row: any) => {
            let bgColor = 'bg-green-100 text-green-800';
            if (row.role === 'ADMIN') {
                bgColor = 'bg-red-100 text-red-800';
            } else if (row.role === 'MANAGER') {
                bgColor = 'bg-blue-100 text-blue-800';
            }
            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
                    {row.role}
                </span>
            );
        }
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


const UserManagement = () => {

    const { getToken } = useAuth();
    const navigate = useNavigate();
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [users, setUsers] = useState<User[]>([]);
    const [adminCount, setAdminCount] = useState(0);
    const [managerCount, setManagerCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    // data is used to search for keywords in the table and update filtered data
    const [data, setData] = useState<{
        email: string;
        id: number;
        firstName: string;
        lastName: string | null;
        role: "ADMIN" | "USER" | "MANAGER";
        createdAt: string;
        updatedAt: string;
        clerkuserId: string;
        phoneNumber: string | null;
    }[]>([]);
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
        phoneNumber: ''
    });
    //this is the data that is displayed in the table
    const [filteredData, setFilteredData] = useState<typeof data>([]);
    const [expandedRow, setExpandedRow] = useState<{
        clerkuserId: string;
        id: number;
        firstName: string;
        lastName: string | null;
        email: string;
        phoneNumber: string | null;
        role: string;
        createdAt: string;
        updatedAt: string;
    } | null>(null);
    const [selectedTab, setSelectedTab] = useState<'users' | 'roles'>('users');

    //fetch all users
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

    useEffect(() => {
        if (isRoleDialogOpen) {
            document.body.style.overflow="hidden";
        } else {
            document.body.style.overflow="visible";
        }
    }, [isRoleDialogOpen]);

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
                clerkuserId: user.clerkuserId,
                phoneNumber: user.phoneNumber
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
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 text-sm font-medium montserrat-500"
                onClick={() => setIsRoleDialogOpen(true)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Change Role
            </button>
        ), []);

    // Apply  filters
    useEffect(() => {
        const filtered = data.filter(item => {
         
            if (filters.email && !item.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
            if (filters.firstName && !item.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) return false;
            if (filters.lastName && item.lastName && !item.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) return false;
            
            // Phone number filter - handle null values
            if (filters.phoneNumber) {
                // If we're filtering by phone number but the user has no phone number, exclude them
                if (!item.phoneNumber) return false;
                // Otherwise check if their phone number includes the filter text
                if (!item.phoneNumber.includes(filters.phoneNumber)) return false;
            }
            
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
            phoneNumber: ''
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

    // filter toggle button and reset button when filters are applied
    const subHeaderComponentMemo = useMemo(() => {
        // Check if any filter is applied
        const isAnyFilterApplied = Object.values(filters).some(value => value !== '');
        
        return (
            <div className="mb-4 flex justify-end items-center montserrat-400 w-full gap-2">
                {isAnyFilterApplied && (
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Reset Filters
                    </button>
                )}
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
    }, [showFilters, filters, resetFilters]);

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="flex flex-col md:flex-row">

                        {/* Sidebar */}
                        <div className="w-full md:w-64 bg-gray-900 text-white p-6">
                            <h2 className="text-xl font-bold mb-8 border-b montserrat-700 border-gray-700 pb-4">User Management</h2>
                            <div className="flex flex-col gap-3 montserrat-500">
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
                        <div className="flex-1 ">
                            <div className="p-6">
                                {selectedTab === 'users' && (
                                    <div className="overflow-x-auto bg-white min-h-[200px] rounded-lg shadow">
                                        <DataTable
                                            title="Users"
                                            className="montserrat-500 bg-gradient-to-r from-gray-200 via-gray-400 to-yellow-200 p-10 border-gray-700"
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
                                            progressComponent={<ProgressLoader></ProgressLoader>}
                                            paginationResetDefaultPage={resetPaginationToggle}
                                            subHeader
                                            subHeaderComponent={subHeaderComponentMemo}
                                            highlightOnHover
                                            pointerOnHover
                                            customStyles={
                                                {
                                                    rows: {
                                                        style: {
                                                            backgroundColor: '#e5e7eb',
                                                        }
                                                    }
                                                }
                                            }
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
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={filters.phoneNumber}
                                onChange={handleFilterChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Filter by phone number"
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


            {/* Expanded user details sidebar */}
            {expandedRow && (
                <div className="fixed top-4 bottom-4 right-0 h-[70%] w-full md:w-1/3 bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform translate-x-0 rounded-lg mr-4">
                    <div className="p-4 sticky top-0 bg-white z-10 flex justify-between items-center rounded-lg">
                        <h2 className=""></h2>
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
                    <button onClick={() => navigate(`/admin/user/${expandedRow?.clerkuserId}`)} className="w-full p-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors">
                        View Details
                    </button>
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

const ProgressLoader = () => {
    return (
        <div className="w-full p-4">
            <div className="animate-pulse space-y-4">
                {/* Header shimmer */}
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                
                {/* Table rows shimmer */}
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex space-x-4">
                        <div className="h-12 bg-gray-200 rounded w-12"></div>
                        <div className="flex-1 space-y-2 py-1">
                            <div className="grid grid-cols-6 gap-4">
                                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                                <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Pagination shimmer */}
                <div className="flex justify-between items-center pt-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex space-x-2">
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
