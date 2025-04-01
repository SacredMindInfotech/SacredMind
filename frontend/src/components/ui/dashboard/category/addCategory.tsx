const AddCategory = ({newCategoryName,setNewCategoryName,selectedParentId,setSelectedParentId,handleAddCategory,categories}:any) => {
    return (
        <div>
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-3">Add New Category</h2>
                <div className="flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category name"
                        className="px-3 py-2 border rounded-md"
                    />
                    <select
                        className="px-3 py-2 border rounded-md"
                        value={selectedParentId || ""}
                        onChange={(e) => setSelectedParentId(e.target.value ? Number(e.target.value) : null)}
                    >
                        <option value="">No parent (Main category)</option>
                        {categories?.map((cat:any) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleAddCategory}
                        className="px-4 py-2 rounded-md border border-white bg-gray-900 text-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] hover:text-black hover:border-gray-900 hover:bg-white transition duration-200 montserrat-secondary cursor-pointer whitespace-nowrap"
                    >
                        Add Category
                    </button>
                </div>
            </div>
        </div>
    )
}
export default AddCategory;
