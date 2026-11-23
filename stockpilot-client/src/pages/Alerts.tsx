import { useEffect, useState } from "react";
import api from "../services/api";
import type { Product } from "../types/Dashboard";
import { AlertTriangle, PackageX, Search } from "lucide-react";
import "./Alerts.css";

export default function Alerts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [lowStockThreshold, setLowStockThreshold] = useState(5);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get<Product[]>("/Products");
                setProducts(response.data);
            } catch (error) {
                console.error("Unable to load stock alerts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get("/Settings");
                setLowStockThreshold(response.data.lowStockThreshold);
            } catch (error) {
                console.error("Unable to load settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const lowStockProducts = products.filter(
        product => product.quantity > 0 && product.quantity <= lowStockThreshold
    );

    const outOfStockProducts = products.filter(
        product => product.quantity === 0
    );

    const filteredProducts = [...lowStockProducts, ...outOfStockProducts]
    .filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        (product.quantity === 0 ? "out of stock" : "low stock")
            .includes(search.toLowerCase())
    );

    return (
        <div className="alerts-page">
            <div className="alerts-heading">
                <div>
                    <h1>Stock Alerts</h1>
                    <p>Monitor products that need your attention.</p>
                </div>
            </div>

            <div className="alerts-summary">
                <div className="alert-card low-alert">
                    <div className="alert-icon">
                        <AlertTriangle size={22} />
                    </div>
                    <div>
                        <p>Low Stock Items</p>
                        <h2>{lowStockProducts.length}</h2>
                    </div>
                </div>

                <div className="alert-card out-alert">
                    <div className="alert-icon">
                        <PackageX size={22} />
                    </div>
                    <div>
                        <p>Out of Stock Items</p>
                        <h2>{outOfStockProducts.length}</h2>
                    </div>
                </div>
            </div>

            <div className="alerts-panel">
                <div className="alerts-toolbar">
                    <div>
                        <h3>Products Requiring Attention</h3>
                        <p>Low stock and unavailable products.</p>
                    </div>

                    <div className="alerts-search">
                        <Search size={17} />
                        <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}/>
                    </div>
                </div>

                {loading ? (
                    <p className="alerts-message">Loading stock alerts...</p>
                ) : (
                    <div className="alerts-table-wrapper">
                        <table className="alerts-table">
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>SKU</th>
                                    <th>CURRENT STOCK</th>
                                    <th>LOW STOCK THRESHOLD</th>
                                    <th>STATUS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.sku}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.quantity === 0 ? "—" : lowStockThreshold}</td>
                                        <td>
                                            <span className={
                                                product.quantity === 0
                                                    ? "alert-status out"
                                                    : "alert-status low"
                                            }>
                                                {product.quantity === 0
                                                    ? "Out of Stock"
                                                    : "Low Stock"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredProducts.length === 0 && (
                            <p className="alerts-message">
                                {products.length === 0
                                    ? "No products available."
                                    : "No stock alerts found."}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
