import { useEffect, useState } from "react";
import { User, Store, Bell, Info, Save } from "lucide-react";
import api from "../services/api";
import "./Settings.css";

export default function Settings() {
    const [adminName, setAdminName] = useState("Administrator");
    const [storeName, setStoreName] = useState("StockPilot");
    const [email, setEmail] = useState("admin@stockpilot.com");
    const [lowStockLevel, setLowStockLevel] = useState("5");
    const [notifications, setNotifications] = useState(true);

    const [role, setRole] = useState("System Administrator");
    const [businessType, setBusinessType] = useState("General Inventory");
    const [currency, setCurrency] = useState("LKR");
    const [outOfStockAlerts, setOutOfStockAlerts] = useState(true);
    const [criticalStockLevel, setCriticalStockLevel] = useState("2");
    const [dateFormat, setDateFormat] = useState("MM/dd/yyyy");
    const [dashboardAutoRefresh, setDashboardAutoRefresh] = useState(true);
    const [backupReminder, setBackupReminder] = useState(true);

    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await api.get("/Settings");
                setAdminName(response.data.adminName);
                setEmail(response.data.email);
                setStoreName(response.data.storeName);
                setLowStockLevel(String(response.data.lowStockThreshold));
                setNotifications(response.data.enableNotifications);

                setRole(response.data.role);
                setBusinessType(response.data.businessType);
                setCurrency(response.data.currency);
                setOutOfStockAlerts(response.data.enableOutOfStockAlerts);
                setCriticalStockLevel(String(response.data.criticalStockLevel));
                setDateFormat(response.data.dateFormat);
                setDashboardAutoRefresh(response.data.dashboardAutoRefresh);
                setBackupReminder(response.data.enableBackupReminder);


            } catch {
                setError("Failed to load settings.");
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
    }, []);

    const handleSave = async () => {
        setSaved(false);
        setError("");
        
        if (
            !adminName.trim() ||
            !email.trim() ||
            !storeName.trim()
        ) {
            setError("Please fill in all required fields.");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            setError("Please enter a valid email address.");
        return;
    }
        
        if (
            !lowStockLevel ||
            !Number.isInteger(Number(lowStockLevel)) ||
            Number(lowStockLevel) < 1
        ) {
            setError("Low stock threshold must be a positive whole number.");
            return;
        }
        if (
            criticalStockLevel === "" ||
            !Number.isInteger(Number(criticalStockLevel)) ||
            Number(criticalStockLevel) < 0
        ) {
            setError("Critical stock level must be a whole number (0 or higher).");
            return;
        }
        setSaving(true);
        try {
            await api.put("/Settings", {
                adminName,
                email,
                storeName,
                lowStockThreshold: Number(lowStockLevel),
                enableNotifications: notifications,
                role,
                businessType,
                currency,
                enableOutOfStockAlerts: outOfStockAlerts,
                criticalStockLevel: Number(criticalStockLevel),
                dateFormat,
                dashboardAutoRefresh,
                enableBackupReminder: backupReminder
            });
            setSaved(true);
        } catch {
            setError("Failed to save settings. Please try again.");
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return <div className="settings-page">Loading settings...</div>;
    }
    return (
        <div className="settings-page">
            <div className="settings-heading">
                <h1>Settings</h1>
                <p>Manage your account and inventory preferences.</p>
            </div>

            <div className="settings-section">
                <div className="settings-section-heading">
                    <User size={20} />
                    <div>
                        <h3>Profile Information</h3>
                        <p>Manage administrator details.</p>
                    </div>
                </div>

                <div className="settings-fields">
                    <label>Administrator Name
                        <input value={adminName} onChange={e => setAdminName(e.target.value)}/>
                    </label>

                    <label>Email Address
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}/>
                    </label>

                    <label>Administrator Role
                        <input value={role} onChange={e => setRole(e.target.value)} />
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <div className="settings-section-heading">
                    <Store size={20} />
                    <div>
                        <h3>Store Information</h3>
                        <p>Set your inventory store name.</p>
                    </div>
                </div>

                <div className="settings-fields">
                    <label>Store Name
                        <input value={storeName} onChange={e => setStoreName(e.target.value)}/>
                    </label>

                    <label>Business Type
                        <input value={businessType} onChange={e => setBusinessType(e.target.value)} />
                    </label>
                    
                    <label>Currency
                        <select value={currency} onChange={e => setCurrency(e.target.value)}>
                            <option value="LKR">LKR - Sri Lankan Rupee</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <div className="settings-section-heading">
                    <Bell size={20} />
                    <div>
                        <h3>Stock Alert Preferences</h3>
                        <p>Configure your low stock notification preferences.</p>
                    </div>
                </div>

                <div className="settings-fields">
                    <label>Low Stock Threshold
                        <input type="number" min="1" value={lowStockLevel} onChange={e => setLowStockLevel(e.target.value)}/>
                    </label>

                    <label className="settings-toggle">
                        <span>Enable Stock Notifications</span>
                        <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)}/>
                    </label>

                    <label className="settings-toggle">
                        <span>Enable Out-of-Stock Alerts</span>
                        <input type="checkbox" checked={outOfStockAlerts} onChange={e => setOutOfStockAlerts(e.target.checked)}/>
                    </label>
                    <label>Critical Stock Level
                        <input type="number" min="0" value={criticalStockLevel} onChange={e => setCriticalStockLevel(e.target.value)}/>
                    </label>
                </div>
            </div>

            <div className="settings-section">
                <div className="settings-section-heading">
                    <Info size={20} />
                    <div>
                        <h3>System Preferences</h3>
                        <p>Customize your inventory management experience.</p>
                    </div>
                </div>
                
                <div className="settings-fields">
                    <label>Date Format
                        <select value={dateFormat} onChange={e => setDateFormat(e.target.value)}>
                            <option value="MM/dd/yyyy">MM/DD/YYYY</option>
                            <option value="dd/MM/yyyy">DD/MM/YYYY</option>
                            <option value="yyyy-MM-dd">YYYY-MM-DD</option>
                        </select>
                    </label>
                    
                    <label className="settings-toggle">
                        <span>Dashboard Auto Refresh</span>
                        <input type="checkbox" checked={dashboardAutoRefresh} onChange={e => setDashboardAutoRefresh(e.target.checked)}/>
                    </label>
                    
                    <label className="settings-toggle">
                        <span>Enable Backup Reminder</span>
                        <input type="checkbox" checked={backupReminder} onChange={e => setBackupReminder(e.target.checked)}/>
                    </label>
                </div>
            </div>

            <div className="settings-section app-info">
                <div className="settings-section-heading">
                    <Info size={20} />
                    <div>
                        <h3>Application Information</h3>
                        <p>StockPilot Inventory Management System</p>
                    </div>
                </div>

                <p className="settings-version">Version 1.0.0</p>
            </div>

            {error && (
                <span className="settings-error">{error}</span>
            )}

            <div className="settings-actions">
                {saved && (
                    <span className="settings-success">Settings saved successfully.</span>
                )}

                <button onClick={handleSave} disabled={saving}>
                    <Save size={16} />
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
}
