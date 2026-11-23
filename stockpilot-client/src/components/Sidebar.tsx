import "./Sidebar.css";
import { NavLink } from "react-router-dom";

import {
    LayoutDashboard,
    Package,
    Tags,
    ArrowLeftRight,
    History,
    AlertTriangle,
    Boxes,
    Settings,
} from "lucide-react";

const menuItems = [
    {name: "Dashboard", icon: LayoutDashboard, path: "/"},
    {name: "Products", icon: Package, path: "/products"},
    {name: "Categories", icon: Tags, path: "/categories"},
    {name: "Stock Management", icon: ArrowLeftRight, path: "/stock"},
    {name: "Transactions", icon: History, path: "/transactions"},
    {name: "Stock Alerts", icon: AlertTriangle, path: "/alerts"},
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">
                    <Boxes size={25} />
                </div>

                <div>
                    <h2>StockPilot</h2>
                    <span>Inventory Management</span>
                </div>
            </div>

            <div className="sidebar-section">
                <p className="sidebar-label">MAIN MENU</p>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink key={item.name} to={item.path} end={item.path === "/"}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                                }>
                                    <Icon size={19} />
                                    <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            <div className="sidebar-bottom">
                <a href="/settings" className="sidebar-link">
                <Settings size={19} />
                <span>Settings</span>
                </a>

                <div className="sidebar-footer">
                    <div className="sidebar-avater">SP</div>
                    <div className="sidebar-user-info">
                        <strong>StockPilot Admin</strong>
                        <span>Administrator</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}