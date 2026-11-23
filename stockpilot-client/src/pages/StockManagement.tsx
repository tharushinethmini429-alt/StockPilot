import { useEffect, useState } from "react";
import api from "../services/api";
import type { Product } from "../types/Dashboard";
import { PackagePlus, PackageMinus, ArrowDownUp } from "lucide-react";
import "./StockManagement.css";

export default function StockManagement() {
    const [products, setProducts] = useState<Product[]>([]);
    const [lowStockThreshold, setLowStockThreshold] = useState(5);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [transactionType, setTransactionType] = useState<"Stock In" | "Stock Out">("Stock In");
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [note, setNote] = useState("");
    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const [productResponse, settingsResponse] = await Promise.all([
                    api.get<Product[]>("/Products"),
                    api.get<{ lowStockThreshold: number }>("/Settings"),
                ]);
                setProducts(productResponse.data);
                setLowStockThreshold(settingsResponse.data.lowStockThreshold);
            } catch (error) {
                console.error("Unable to load products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleStockSubmit = async () => {
        if (!selectedProductId || !quantity || Number(quantity) <= 0 || !Number.isInteger(Number(quantity))) {
            setFormError("Please select a product and enter a valid quantity.");
            return;
        }
        setSaving(true);
        setFormError("");
        
        try {
            await api.post("/StockTransactions", {
                productId: Number(selectedProductId),
                type: transactionType,
                quantity: Number(quantity),
                note: note,
            });
            const response = await api.get<Product[]>("/Products");
            setProducts(response.data);
            
            setShowForm(false);
            setSelectedProductId("");
            setQuantity("");
            setNote("");
        } catch (error) {
            const message = (error as {
                response?: { data?: string | { message?: string; title?: string } }
            }).response?.data;
            if (typeof message === "string") {
                setFormError(message);
            } else {
                setFormError(
                    message?.message ||
                    message?.title ||
                    "Unable to process stock transaction."
                );
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="stock-page">
            <div className="stock-heading">
                <div>
                    <h1>Stock Management</h1>
                    <p>Manage stock movements and inventory levels.</p>
                </div>
            </div>

            <div className="stock-action-grid">
                <div className="stock-action-card">
                    <div className="stock-action-icon stock-in-icon">
                        <PackagePlus size={24} />
                    </div>
                    <h3>Stock In</h3>
                    <p>Add new stock to your inventory.</p>
                    <button onClick={() => {
                        setTransactionType("Stock In");
                        setFormError("");
                        setShowForm(true);
                    }}>Stock In</button>
                </div>

                <div className="stock-action-card">
                    <div className="stock-action-icon stock-out-icon">
                        <PackageMinus size={24} />
                    </div>
                    <h3>Stock Out</h3>
                    <p>Remove stock from your inventory.</p>
                    <button onClick={() => {
                        setTransactionType("Stock Out");
                        setFormError("");
                        setShowForm(true);
                    }}>Stock Out</button>
                </div>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="category-modal">
                        <h2>{transactionType}</h2>
                        <label>Select Product</label>
                        <select value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
                            <option value="">Choose a product</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} ({product.quantity} available)
                                </option>
                            ))}
                        </select>
                        
                        <label>Quantity</label>
                        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Enter quantity"/>
                        
                        <label>Note (Optional)</label>
                        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Enter a note" maxLength={200}/>
                        
                        {formError && <p className="categories-error">{formError}</p>}
                        <div className="modal-actions">
                            <button onClick={() => {
                                setShowForm(false);
                                setSelectedProductId("");
                                setQuantity("");
                                setNote("");
                                setFormError("");
                            }}>Cancel</button>
                            <button onClick={handleStockSubmit} disabled={saving}>{saving ? "Processing..." : "Confirm"}</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="stock-panel">
                <div className="stock-panel-heading">
                    <div>
                        <h3>Current Stock Levels</h3>
                        <p>Overview of available inventory.</p>
                    </div>
                    <ArrowDownUp size={20} />
                </div>

                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>PRODUCT</th>
                                <th>SKU</th>
                                <th>CURRENT STOCK</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.sku}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        {product.quantity === 0
                                        ? "Out of Stock"
                                        : product.quantity <= lowStockThreshold
                                        ? "Low Stock"
                                        : "In Stock"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );


}