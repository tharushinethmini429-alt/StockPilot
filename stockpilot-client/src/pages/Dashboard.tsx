import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css"
import StockStatusChart from "../components/StockStatusChart";
import StockMovementChart from "../components/StockMovementChart";
import TransactionTrendChart from "../components/TransactionTrendChart";

import type {
    DashboardSummary,
    StockTransaction,
    Product,
} from "../types/Dashboard";

import {
    Package,
    Tags,
    DollarSign,
    AlertTriangle,
    Boxes,
    PackageX,
} from "lucide-react";


export default function Dashboard() {

    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [transactions, setTransactions] = useState<StockTransaction[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [lowStockThreshold, setLowStockThreshold] = useState(5);


    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get<DashboardSummary>(
                    "/Analytics/summary"
                );
                setSummary(response.data);
            } catch {
                setError("Unable to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        
        const fetchTransactions = async () => {
            try {
                const response = await api.get<StockTransaction[]>(
                    "/StockTransactions"
                );
                setTransactions(response.data);
            } catch (error) {
                console.error("Failed to load transactions:", error);
            }
        };

        const fetchProducts = async () => {
    try {
        const response = await api.get<Product[]>("/Products");
        setProducts(response.data);
    } catch (error) {
        console.error("Failed to load products:", error);
    }
};
const fetchSettings = async () => {
    try {
        const response = await api.get("/Settings");
        setLowStockThreshold(response.data.lowStockThreshold);
    } catch (error) {
        console.error("Failed to load settings:", error);
    }
};
        
fetchSummary();
fetchTransactions();
fetchProducts();
fetchSettings();
}, []);


const lowStockCount = products.filter(
    product => product.quantity > 0 && product.quantity <= lowStockThreshold
).length;

const outOfStockCount = products.filter(
    product => product.quantity === 0
).length;

const categoryData = Object.values(
    products.reduce<Record<string, number>>((acc, product) => {
        const category = product.categoryName || "Uncategorized";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {})
).map((count, index) => ({
    name: Object.keys(
        products.reduce<Record<string, number>>((acc, product) => {
            const category = product.categoryName || "Uncategorized";
            acc[category] = (acc[category] || 0) + 1;
            return acc;
        }, {})
    )[index],
    count,
}));

const maxCategoryCount = Math.max(
    ...categoryData.map(category => category.count),
    1
);

const recentTransactions = [...transactions]
.sort(
    (a, b) =>
        new Date(b.transactionDate).getTime() -
        new Date(a.transactionDate).getTime()
    )
    .slice(0, 5);

    const stats = [
    {
        title: "Total Products",
        value: summary?.totalProducts ?? 0,
        change: "Registered products",
        icon: Package,
        color: "blue",
    },
    {
        title: "Total Categories",
        value: summary?.totalCategories ?? 0,
        change: "Product categories",
        icon: Tags,
        color: "purple",
    },
    {
        title: "Total Stock Quantity",
        value: summary?.totalStockQuantity ?? 0,
        change: "Total available units",
        icon: Boxes,
        color: "cyan",
    },
    {
        title: "Total Inventory Value",
        value: `Rs. ${(summary?.totalStockValue ?? 0).toLocaleString("en-LK")}`,
        change: "Current inventory value",
        icon: DollarSign,
        color: "green",
    },
    {
        title: "Low Stock Items",
        value: lowStockCount,
        change: "Needs attention",
        icon: AlertTriangle,
        color: "orange",
    },
    {
        title: "Out of Stock Items",
        value: outOfStockCount,
        change: "Products unavailable",
        icon: PackageX,
        color: "red",
    },
];
return (
    <div className="dashboard">
        {loading && <p>Loading Dashboard...</p>}
        {error &&<p>{error}</p>}

        <div className="page-heading">
            <div>
                <h1>Dashboard</h1>
                <p>Welcome back! Here's what's happening with your inventory.</p>
            </div>
            <span className="dashboard-date">Stock Overview</span>
        </div>

        {/*KPI CARDS*/}
        <div className="stats-grid">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <div className="stat-card" key={stat.title}>
                        <div className={`stat-icon ${stat.color}`}>
                            <Icon size={22} />
                        </div>
                        <p className="stat-title">{stat.title}</p>
                        <h2 className="stat-value">{stat.value}</h2>
                        <span className="stat-description">{stat.change}</span>
                    </div>
                );
            })}
        </div>

        {/* DASHBOARD ANALYTICS */}
        <div className="dashboard-charts-grid">
            
            {/* Transaction Trends */}
            <div className="dashboard-panel">
                <h3>Transaction Trends</h3>
                <p className="panel-description">Daily stock movement over time.</p>
                <TransactionTrendChart transactions={transactions} />
            </div>
            
            {/* Stock Overview */}
            <div className="dashboard-panel">
                <h3>Stock Overview</h3>
                <p className="panel-description">Inventory status at a glance.</p>
                <StockStatusChart inStock={products.length - lowStockCount - outOfStockCount} lowStock={lowStockCount} outOfStock={outOfStockCount}/>
            </div>
            
            {/* Stock Movement */}
            <div className="dashboard-panel">
                <h3>Stock Movement</h3>
                <p className="panel-description">Stock received vs stock issued.</p>
                <StockMovementChart transactions={transactions} />
            </div>
            
            {/* Category Distribution */}
            <div className="dashboard-panel">
                <h3>Category Distribution</h3>
                <p className="panel-description">Inventory distribution by category.</p>
                
                <div className="category-list">
                    {categoryData.length === 0 ? (
                        <div className="empty-state">
                            <Tags size={30} />
                            <p>No category data available.</p>
                        </div>
                    ) : (
                        categoryData.map((category) => (
                        <div className="category-item" key={category.name}>
                            <div className="category-info">
                                <span>{category.name}</span>
                                <strong>{category.count} products</strong>
                            </div>
                            
                            <div className="category-progress">
                                <div className="category-progress-fill"
                                style={{ width: `${(category.count / maxCategoryCount) * 100}%` }}/>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
        
        {/* RECENT ACTIVITY */}
        <div className="dashboard-panel recent-activity-panel">
            <h3>Recent Activity</h3>
            <p className="panel-description">Your latest inventory activities</p>
            
            <div className="recent-activity-list">
                {transactions.length === 0 ? (
                    <div className="empty-state">
                        <Package size={30} />
                        <p>No recent transactions yet</p>
                    </div>
                ) : (

                    recentTransactions.map((transaction) => (
                    <div className="activity-item" key={transaction.id}>
                        <div className={`activity-icon ${
                            transaction.type === "Stock In"
                            ? "stock-in"
                            : "stock-out"
                        }`}>
                            <Package size={19} />
                        </div>
                        
                        <div className="activity-details">
                            <strong>{transaction.productName}</strong>
                            <span className={`activity-status ${
                                transaction.type === "Stock In"
                                ? "status-in"
                                : "status-out"
                            }`}>
                                {transaction.type} · {transaction.quantity} units
                            </span>
                            <small>{new Date(transaction.transactionDate).toLocaleString("en-LK")}</small>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
</div>
)
}
