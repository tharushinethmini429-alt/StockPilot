import { useEffect, useState } from "react";
import api from "../services/api";
import type { Product, Category } from "../types/Dashboard";
import "./Products.css";

import {
    Plus,
    Search,
    Package,
    AlertTriangle,
    PackageX,
    Pencil,
    Trash2,
} from "lucide-react";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [lowStockThreshold, setLowStockThreshold] = useState(5);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productResponse, categoryResponse, settingsResponse] =
                await Promise.all([
                    api.get<Product[]>("/Products"),
                    api.get<Category[]>("/Categories"),
                    api.get<{ lowStockThreshold: number }>("/Settings"),
                ]);
                
                setProducts(productResponse.data);
                setCategories(categoryResponse.data);
                setLowStockThreshold(settingsResponse.data.lowStockThreshold);
            } catch {
                setError("Unable to load products.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.sku.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
            selectedCategory === "all" ||
            product.categoryId.toString() === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const lowStockCount = products.filter(
        (product) =>
            product.quantity > 0 &&
        product.quantity <= lowStockThreshold
    ).length;

    const outOfStockCount = products.filter(
        (product) => product.quantity === 0
    ).length;

    const [newProduct, setNewProduct] = useState({
        name: "",
        sku: "",
        price: "",
        quantity: "",
        reorderLevel: "5",
        categoryId: "",
    });

    const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            await api.post("/Products", {
                name: newProduct.name,
                sku: newProduct.sku,
                price: Number(newProduct.price),
                quantity: Number(newProduct.quantity),
                reorderLevel: Number(newProduct.reorderLevel),
                categoryId: Number(newProduct.categoryId),
            });
            
            const response = await api.get<Product[]>("/Products");
            setProducts(response.data);
            
            setNewProduct({
                name: "",
                sku: "",
                price: "",
                quantity: "",
                reorderLevel: "5",
                categoryId: "",
            });
            
            setShowAddForm(false);
            setError("");
        } catch (err) {
            setError("Unable to add product. Check the details and try again.");
            console.error(err);
        }
    };
    
    const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingProduct) return;
        try {
            await api.put(`/Products/${editingProduct.id}`, {
                name: newProduct.name,
                sku: newProduct.sku,
                price: Number(newProduct.price),
                quantity: Number(newProduct.quantity),
                reorderLevel: Number(newProduct.reorderLevel),
                categoryId: Number(newProduct.categoryId),
            });
            
            const response = await api.get<Product[]>("/Products");
            setProducts(response.data);
            setEditingProduct(null);
            setShowAddForm(false);
            setNewProduct({
                name: "",
                sku: "",
                price: "",
                quantity: "",
                reorderLevel: "5",
                categoryId: "",
            });
            setError("");
        } catch (err) {
            setError("Unable to update product. Please check the details.");
            console.error(err);
        }
    };

    const handleDeleteProduct = async () => {
        if (!deleteProduct) return;
        try {
            await api.delete(`/Products/${deleteProduct.id}`);
            setProducts(prev =>
                prev.filter(product => product.id !== deleteProduct.id)
            );
            setDeleteProduct(null);
            setError("");
        } catch (err) {
            setError("Unable to delete product. It may have existing transactions.");
            console.error(err);
            setDeleteProduct(null);
        }
    };

    return (
        <div className="products-page">
            {deleteProduct && (
                <div className="delete-warning-overlay">
                    <div className="delete-warning-box">
                        <div className="delete-warning-icon">
                            <AlertTriangle size={28} />
                        </div>
                        <h2>Delete Product?</h2>
                        <p>Are you sure you want to delete
                            <strong> {deleteProduct.name}</strong>?This action cannot be undone.</p>
                            <div className="delete-warning-actions">
                                <button type="button" onClick={() => setDeleteProduct(null)}>
                                    Cancel
                                </button>
                                
                                <button type="button" className="confirm-delete-btn" onClick={handleDeleteProduct}>Delete Product</button>
                            </div>
                        </div>
                    </div>
                )}


            {(showAddForm || editingProduct) && (
                <div className="product-modal-overlay">
                    <div className="product-modal">
                        <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                        <p>Enter the details of your new inventory item.</p>
                        
                        <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                            <label>Product Name</label>
                            <input type="text" placeholder="Enter product name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value})}/>
                            
                            <label>SKU</label>
                            <input type="text" placeholder="Enter SKU" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}/>
                            
                            <label>Price</label>
                            <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value})}/>
                            
                            <label>Quantity</label>
                            <input type="number" value={newProduct.quantity} onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value })}/>
                            
                            <label>Reorder Level</label>
                            <input type="number" value={newProduct.reorderLevel} onChange={(e) => setNewProduct({ ...newProduct, reorderLevel: e.target.value})}/>
                            
                            <label>Category</label>
                            <select value={newProduct.categoryId} onChange={(e) => setNewProduct({...newProduct, categoryId: e.target.value})}>
                                <option value="">Select Category</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            
                            <div className="product-modal-actions">
                                <button type="button"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setEditingProduct(null);
                                }}>Cancel</button>
                                <button type="submit">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            <div className="products-heading">
                <div>
                    <h1>Products</h1>
                    <p>Manage and monitor your inventory products.</p>
                </div>

                <button className="add-product-btn" onClick={() => {
                    setEditingProduct(null);
                    setNewProduct({
                        name: "",
                        sku: "",
                        price: "",
                        quantity: "",
                        reorderLevel: "5",
                        categoryId: "",
                    });
                    setShowAddForm(true);
                }}>
                    <Plus size={18} />
                    <span>Add Product</span>
                </button>
                
            </div>

            <div className="product-stats-grid">
                <div className="product-stat-card">
                    <div className="product-stat-icon blue">
                        <Package size={21} />
                    </div>
                    <div>
                        <span>Total Products</span>
                        <h2>{products.length}</h2>
                    </div>
                </div>
                <div className="product-stat-card">
                    <div className="product-stat-icon orange">
                        <AlertTriangle size={21} />
                    </div>
                    <div>
                        <span>Low Stock</span>
                        <h2>{lowStockCount}</h2>
                    </div>
                </div>

                <div className="product-stat-card">
                    <div className="product-stat-icon red">
                        <PackageX size={21} />
                    </div>

                    <div>
                        <span>Out of Stock</span>
                        <h2>{outOfStockCount}</h2>
                    </div>
                </div>
            </div>

            <div className="products-table-panel">
                <div className="products-toolbar">
                    <div>
                        <h3>All Products</h3>
                        <p>View and manage your inventory items.</p>
                    </div>

                    <div className="products-filters">
                        <div className="product-search">
                            <Search size={17} />
                            <input type="text" placeholder="Search products or SKU..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                        </div>

                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading ? (
                    <p className="products-message">Loading products...</p>
                ) : error ? (
                    <p className="products-error">{error}</p>
                ) : (
                    <div className="products-table-wrapper">
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>SKU</th>
                                    <th>CATEGORY</th>
                                    <th>PRICE</th>
                                    <th>QUANTITY</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="products-empty">No products found.</td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id}>
                                            <td className="product-name">{product.name}</td>
                                            <td>{product.sku}</td>
                                            <td>{product.categoryName}</td>
                                            <td>Rs. {product.price.toLocaleString("en-LK")}</td>
                                            <td>{product.quantity}</td>
                                            <td>
                                                <span className={`product-status ${
                                                    product.quantity === 0
                                                        ? "out"
                                                        : product.quantity <= lowStockThreshold
                                                        ? "low"
                                                        : "in"
                                                }`}>
                                                    {product.quantity === 0
                                                        ? "Out of Stock"
                                                        : product.quantity <= lowStockThreshold
                                                        ? "Low Stock"
                                                        : "In Stock"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="product-actions">
                                                    <button className="product-action-btn edit" title="Edit Product"
                                                    onClick={() => {
                                                        setEditingProduct(product);
                                                        setNewProduct({
                                                            name: product.name,
                                                            sku: product.sku,
                                                            price: product.price.toString(),
                                                            quantity: product.quantity.toString(),
                                                            reorderLevel: product.reorderLevel.toString(),
                                                            categoryId: product.categoryId.toString(),
                                                        });
                                                    }}>
                                                        <Pencil size={16} />
                                                    </button>

                                                    <button className="product-action-btn delete" title="Delete Product"
                                                    onClick={() => setDeleteProduct(product)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="products-table-footer">
                    Showing {filteredProducts.length} of {products.length} products
                </div>

            </div>
        </div>
    );
}