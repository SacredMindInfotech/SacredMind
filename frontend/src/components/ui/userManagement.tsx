import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import DataTable from 'react-data-table-component';
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";


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
];


const UserManagement = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [adminCount, setAdminCount] = useState(0);
    const [managerCount, setManagerCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
    const [filterText, setFilterText] = useState('');
    const [filteredData, setFilteredData] = useState<typeof data>([]);  

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

    // Filter data based on search text
    useEffect(() => {
        const filtered = data.filter(item => {
            const searchText = filterText.toLowerCase();
            return (
                item.firstName?.toLowerCase().includes(searchText) ||
                item.lastName?.toLowerCase().includes(searchText) ||
                item.email.toLowerCase().includes(searchText) || 
                item.role.toLowerCase().includes(searchText)
            );
        });
        setFilteredData(filtered);
    }, [filterText, data]);

    //disable row if user is the same as the current user
    const rowDisabledCriteria = (row: any) => row.email === user?.emailAddresses[0].emailAddress;
    //option for pagination to see all rows at once
    const paginationComponentOptions = {
        selectAllRowsItem: true,
    };
    //expanded component
    const ExpandedComponent = ({ data }: { data: any }) => (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">User Details</h4>
                    <p className="text-sm text-gray-600"><span className="font-bold">Email:</span> {data.email}</p>
                    <p className="text-sm text-gray-600"><span className="font-bold">Name:</span> {data.firstName} {data.lastName}</p>
                    <p className="text-sm text-gray-600"><span className="font-bold">Role:</span> <span className="font-medium">{data.role}</span></p>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-600"><span className="font-bold">Created:</span> {data.createdAt}</p>
                    <p className="text-sm text-gray-600"><span className="font-bold">Last Updated:</span> {data.updatedAt}</p>
                    <p className="text-sm text-gray-600"><span className="font-bold">ID:</span> {data.clerkuserId}</p>
                </div>
            </div>
        </div>
    );

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

    //context actions for the table
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

    //text field for filter
    const TextField = styled.input`
	height: 32px;
	width: 200px;
	border-radius: 3px;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
	border: 1px solid #e5e5e5;
	padding: 0 32px 0 16px;

	&:hover {
		cursor: pointer;
	}
`;




    //used by filter bar component
    const FilterComponent = ({ filterText, onFilter, onClear }: { filterText: string, onFilter: (e: any) => void, onClear: () => void }) => (
        <div className="flex gap-2">
            <TextField
                id="search"
                type="text"
                placeholder="Search"
                aria-label="Search Input"
                value={filterText}
                onChange={onFilter}
                autoFocus
            />

            <button
                type="button"
                className="px-4 border border-l-0 border-gray-200 hover:bg-gray-100"
                onClick={onClear}
            >
                clear 
            </button>
        </div>
    );

    //filter bar component
    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <div className="mb-4">
                <FilterComponent
                    onFilter={e => setFilterText(e.target.value)}
                    onClear={handleClear}
                    filterText={filterText}
                />
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-600">Total Users: {users.length}</p>
                    <p className="text-sm text-gray-600">Admins: {adminCount}</p>
                    <p className="text-sm text-gray-600">Managers: {managerCount}</p>
                    <p className="text-sm text-gray-600">Users: {userCount}</p>
                </div>
            </div>
            <div className="overflow-x-auto bg-white min-h-[200px] rounded-lg shadow">
                <DataTable
                    title="Users"
                    columns={columns}
                    data={filteredData}
                    selectableRows
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    pagination
                    expandOnRowClicked
                    expandableRowsHideExpander
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
                />
            </div>

            {/* Role Selection Dialog */}
            {isRoleDialogOpen && (
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

            )}

        </div>
    );
};

export default UserManagement;