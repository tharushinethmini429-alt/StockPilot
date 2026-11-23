import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    Bell,
    ChevronDown,
    Package,
    AlertTriangle,
    X
} from "lucide-react";

import api from "../services/api";
import "./Header.css";

interface Product {
    id: number;
    name: string;
    sku: string;
    quantity: number;
}

export default function Header() {
    
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [lowStockThreshold, setLowStockThreshold] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    
    useEffect(() => {
        const loadData = async () => {
            try {
                const [productResponse, settingsResponse] = await Promise.all([
                    api.get<Product[]>("/Products"),
                    api.get("/Settings")
                ]);
                setProducts(productResponse.data);
                setLowStockThreshold(settingsResponse.data.lowStockThreshold);
            } catch (error) {
                console.error("Header data loading failed:", error);

            }
        };
        loadData();
    }, []);
    
    const searchResults = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5);
    }, [products, searchTerm]);
    
    const lowStockProducts = products.filter(
        product => product.quantity > 0 &&
        product.quantity <= lowStockThreshold
    );
    const outOfStockProducts = products.filter(
        product => product.quantity === 0
    );
    const notificationCount =
    lowStockProducts.length + outOfStockProducts.length;
    
    const openAlerts = () => {
        setShowNotifications(false);
        navigate("/alerts");
    };


    return (
        <header className="header">
            <div className="header-search">
                <Search size={19} />
                <input type="text" placeholder="Search products by name or SKU..." value={searchTerm} onChange={e => {
                    setSearchTerm(e.target.value);
                    setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}/>
                
                {searchTerm && (
                    <button className="search-clear" onClick={() => {
                        setSearchTerm("");
                        setShowSearchResults(false);
                    }}>
                        <X size={16} />
                    </button>
                )}
                
                {showSearchResults && searchTerm.trim() && (
                    <div className="header-search-results">
                        {searchResults.length > 0 ? (
                            searchResults.map(product => (
                            <button key={product.id} className="search-result-item" onClick={() => {
                                setShowSearchResults(false);
                                setSearchTerm("");
                                navigate("/products");
                            }}>
                                <Package size={18} />
                                <span>
                                    <strong>{product.name}</strong>
                                    <small>{product.sku}</small>
                                </span>
                            </button>
                        ))
                    ) : (
                    <p className="search-no-results">No products found.</p>
                )}
            </div>
        )}
    </div>
    <div className="header-actions">
        <div className="notification-wrapper">
            <button className="notification-button" aria-label="Notifications" onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSearchResults(false);
            }}>
                <Bell size={20} />
                {notificationCount > 0 && (
                    <span className="notification-count">{notificationCount}</span>
                )}
            </button>
            
            {showNotifications && (
                <div className="notification-dropdown">
                    <div className="notification-heading">
                        <strong>Notifications</strong>
                        <span>{notificationCount} alerts</span>
                    </div>
                    
                    {outOfStockProducts.length > 0 && (
                        <button className="notification-item" onClick={openAlerts}>
                            <AlertTriangle size={19} />
                            <span>
                                <strong>Out of Stock</strong>
                                <small>{outOfStockProducts.length} products unavailable</small>
                            </span>
                        </button>
                    )}
                    
                    {lowStockProducts.length > 0 && (
                        <button className="notification-item" onClick={openAlerts}>
                            <AlertTriangle size={19} />
                            <span>
                                <strong>Low Stock</strong>
                                <small>{lowStockProducts.length} products need attention</small>
                            </span>
                        </button>
                    )}
                    {notificationCount === 0 && (
                        <p className="no-notifications">No stock alerts right now.</p>
                    )}
                    <button className="view-all-notifications" onClick={openAlerts}>View all alerts</button>
                </div>
            )}
            </div>
                <div className="header-profile">
                    <div className="profile-avatar">SP</div>

                    <div className="profile-info">
                        <strong>Admin</strong>
                        <span>Administrator</span>
                    </div>

                    <ChevronDown size={16} />
                </div>
            </div>
        </header>
    )
}