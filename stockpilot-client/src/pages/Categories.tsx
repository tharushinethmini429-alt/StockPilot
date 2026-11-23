import { useEffect, useState } from "react";
import api from "../services/api";
import type { Category, Product } from "../types/Dashboard";
import "./Categories.css";
import { Plus, Search, Tags, Package, Pencil, Trash2 } from "lucide-react";

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryResponse, productResponse] = await Promise.all([
                    api.get<Category[]>("/Categories"),
                    api.get<Product[]>("/Products"),
                ]);

                setCategories(categoryResponse.data);
                setProducts(productResponse.data);
            } catch (err) {
                setError("Unable to load categories.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddCategory = async () => {
    if (!categoryName.trim()) {
        setError("Please enter a category name.");
        return;
    }

    try {
        if (editingCategory) {
            await api.put(`/Categories/${editingCategory.id}`, {
                name: categoryName.trim(),
            });
        } else {
            await api.post("/Categories", {
                name: categoryName.trim(),
            });
        }

        const response = await api.get<Category[]>("/Categories");
        setCategories(response.data);

        setCategoryName("");
        setEditingCategory(null);
        setShowAddForm(false);
        setError("");
    } catch (err) {
        console.error(err);
        setError("Unable to save category.");
    }
};

const getProductCount = (categoryId: number) => {
    return products.filter(
        product => product.categoryId === categoryId
    ).length;
};

const handleDeleteCategory = async () => {
    if (!deleteCategory) return;

    try {
        await api.delete(`/Categories/${deleteCategory.id}`);

        setCategories(prev =>
            prev.filter(category => category.id !== deleteCategory.id)
        );

        setDeleteCategory(null);
        setError("");
    } catch (err) {
        console.error(err);
        setError("Cannot delete this category because products are assigned to it.");
        setDeleteCategory(null);
    }
};

    return (
        <div className="categories-page">
            <div className="categories-heading">
                <div>
                    <h1>Categories</h1>
                    <p>Organize and manage your inventory categories.</p>
                </div>

                <button className="add-category-btn" onClick={() => {
                    setCategoryName("");
                    setEditingCategory(null);
                    setError("");
                    setShowAddForm(true);
                }}>
                    <Plus size={18} />
                    Add Category
                </button>
            </div>

            <div className="category-stats-grid">
                <div className="category-stat-card">
                    <div className="category-stat-icon blue">
                        <Tags size={21} />
                    </div>
                    <div>
                        <span>Total Categories</span>
                        <h2>{categories.length}</h2>
                    </div>
                </div>

                <div className="category-stat-card">
                    <div className="category-stat-icon purple">
                        <Package size={21} />
                    </div>
                    <div>
                        <span>Products Assigned</span>
                        <h2>{products.length}</h2>
                    </div>
                </div>
            </div>

            <div className="categories-panel">
                <div className="categories-toolbar">
                    <div>
                        <h3>All Categories</h3>
                        <p>View and manage your product categories.</p>
                    </div>

                    <div className="category-search">
                        <Search size={17} />
                        <input type="text" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                </div>

                {loading ? (
                    <p className="categories-message">Loading categories...</p>
                ) : error ? (
                    <p className="categories-error">{error}</p>
                ) : (
                    <div className="categories-table-wrapper">
                        <table className="categories-table">
                            <thead>
                                <tr>
                                    <th>CATEGORY NAME</th>
                                    <th>PRODUCTS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCategories.map(category => {
                                    const productCount = products.filter(
                                        product => product.categoryId === category.id
                                    ).length;

                                    return (
                                        <tr key={category.id}>
                                            <td>
                                                <div className="category-name-cell">
                                                    <div className="category-name-icon">
                                                        <Tags size={17} />
                                                    </div>
                                                    {category.name}
                                                </div>
                                            </td>

                                            <td>
                                                <span className="category-count">{productCount} Products</span>
                                            </td>

                                            <td>
                                                <div className="category-actions">
                                                    <button className="category-action-btn edit" title="Edit Category"
                                                    onClick={() => {
                                                        setCategoryName(category.name);
                                                        setEditingCategory(category);
                                                        setShowAddForm(true);
                                                    }}>
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button className="category-action-btn delete" title={getProductCount(category.id) > 0 ? "Cannot delete category with products" : "Delete Category"} onClick={() => setDeleteCategory(category)} disabled={getProductCount(category.id) > 0}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {filteredCategories.length === 0 && (
                            <p className="categories-message">No categories found.</p>
                        )}
                    </div>
                )}

                <div className="categories-footer">
                    Showing {filteredCategories.length} of {categories.length} categories
                </div>
            </div>

            {deleteCategory && (
                <div className="modal-overlay">
                    <div className="category-modal">
                        <h2>Delete Category</h2>
                        <p>Are you sure you want to delete
                        <strong> {deleteCategory.name}</strong>?
                        </p>
                        
                        <div className="modal-actions">
                            <button onClick={() => setDeleteCategory(null)}>Cancel</button>
                            <button onClick={handleDeleteCategory}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
            
            {showAddForm && (
                <div className="modal-overlay">
                    <div className="category-modal">
                        <h2>{editingCategory ? "Edit Category" : "Add New Category"}</h2>

                        <input type="text" placeholder="Enter category name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}/>

                        <div className="modal-actions">
                            <button type="button" onClick={() => {
                                setShowAddForm(false);
                                setCategoryName("");
                                setEditingCategory(null);
                                setError("");
                            }}>
                                Cancel
                            </button>
                            
                            <button onClick={handleAddCategory}>{editingCategory ? "Update Category" : "Save Category"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
