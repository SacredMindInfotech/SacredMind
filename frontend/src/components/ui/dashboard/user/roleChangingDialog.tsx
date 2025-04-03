//role changing dialog
const RoleChangingDialog = ({ isLoading, setIsRoleDialogOpen, handleRoleChange }: { isLoading: boolean, setIsRoleDialogOpen: (value: boolean) => void, handleRoleChange: (newRole: "ADMIN" | "MANAGER" | "USER") => void }) => {
    return (
        <div className="fixed inset-0 bg-black/20  flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md transform transition-all">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 montserrat-500">Select New Role</h2>
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
                            <div className="font-medium montserrat-400 text-gray-900">Admin</div>
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
                            <div className="font-medium text-gray-900  montserrat-400">Manager</div>
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
                            <div className="font-medium text-gray-900  montserrat-400">User</div>
                            <div className="text-sm text-gray-500">Standard user access</div>
                        </div>
                    </button>
                </div>

                <div className="mt-6 flex justify-end gap-3"></div>
                <button
                    onClick={() => !isLoading && setIsRoleDialogOpen(false)}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-700  montserrat-500 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
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

export default RoleChangingDialog;
