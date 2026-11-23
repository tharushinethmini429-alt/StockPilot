import { useEffect, useState } from "react";
import api from "../services/api";
import type { StockTransaction } from "../types/Dashboard";
import { ArrowDownCircle, ArrowUpCircle, Search } from "lucide-react";
import "./Transactions.css";

export default function Transactions() {
    const [transactions, setTransactions] = useState<StockTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get<StockTransaction[]>("/StockTransactions");
                setTransactions(response.data);
            } catch (error) {
                console.error("Unable to load transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(transaction =>
        transaction.productName.toLowerCase().includes(search.toLowerCase()) ||
        transaction.type.toLowerCase().includes(search.toLowerCase()) ||
        (transaction.note || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="transactions-page">
            <div className="transactions-heading">
                <div>
                    <h1>Transactions</h1>
                    <p>Track and review all stock movements.</p>
                </div>
            </div>

            <div className="transactions-panel">
                <div className="transactions-toolbar">
                    <div>
                        <h3>Transaction History</h3>
                        <p>All stock in and stock out activities.</p>
                    </div>

                    <div className="transactions-search">
                        <Search size={17} />
                        <input type="text" placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                    </div>
                </div>

                {loading ? (
                    <p className="transactions-message">Loading transactions...</p>
                ) : (
                    <div className="transactions-table-wrapper">
                        <table className="transactions-table">
                            <thead>
                                <tr>
                                    <th>PRODUCT</th>
                                    <th>TYPE</th>
                                    <th>QUANTITY</th>
                                    <th>DATE</th>
                                    <th>NOTE</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map(transaction => (
                                    <tr key={transaction.id}>
                                        <td>{transaction.productName}</td>
                                        <td>
                                            <span className={
                                                transaction.type === "Stock In"
                                                    ? "transaction-type stock-in"
                                                    : "transaction-type stock-out"
                                            }>
                                                {transaction.type === "Stock In"
                                                    ? <ArrowDownCircle size={15} />
                                                    : <ArrowUpCircle size={15} />}
                                                {transaction.type}
                                            </span>
                                        </td>
                                        <td>{transaction.quantity}</td>
                                        <td>
                                            {transaction.transactionDate
                                            ? new Date(transaction.transactionDate).toLocaleString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })
                                            : "—"}
                                        </td>
                                        <td>{transaction.note || "—"}</td>
                                    </tr>
                                ))
                            ) : (
                        <tr>
                            <td colSpan={5} className="transactions-message">
                                {search
                                ? "No transactions match your search."
                                : "No stock transactions available yet."}
                            </td>
                        </tr>
                    )}            
                        </tbody>
                        </table>
                    </div>
                )}

                <div className="transactions-footer">
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                </div>
            </div>
        </div>
    );
}
