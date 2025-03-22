import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";



const backendUrl = import.meta.env.VITE_BACKEND_URL;


interface Category {
    id: number;
    name: string;
    parentId: number | null;
}

const CategoryManagement = () => {

    const [categories, setCategories] = useState<Category[] | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const res = await axios.get(`${backendUrl}api/v1/category`);
            setCategories(res.data as Category[]);
            console.log(res.data);
        }
        fetchCategories();
    }, []);
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Category Management</h1>
            {categories ? (
                <ul>
                    {categories.map((category) => (
                        <li key={category.id} className="mb-2">
                            {category.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading categories...</p>
            )}
        </div>
    );
};

export default CategoryManagement;
