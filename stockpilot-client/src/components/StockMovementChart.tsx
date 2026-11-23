import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import type { StockTransaction } from "../types/Dashboard";

interface StockMovementChartProps {
    transactions: StockTransaction[];
}

export default function StockMovementChart({
    transactions,
}: StockMovementChartProps) {

    const data = [
        {
            name: "Stock In",
            quantity: transactions
                .filter((item) => item.type === "Stock In")
                .reduce((total, item) => total + item.quantity, 0),
        },
        {
            name: "Stock Out",
            quantity: transactions
                .filter((item) => item.type === "Stock Out")
                .reduce((total, item) => total + item.quantity, 0),
        },
    ];

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data}>

                    {data.every(item => item.quantity === 0) && (
                        <text x="50%" y="50%" textAnchor="middle" fill="#8c9ab5" fontSize={13}>No stock movements yet</text>
                    )}

                    <CartesianGrid strokeDasharray="3 3" stroke="#26344d" vertical={false}/>

                    <XAxis dataKey="name" stroke="#8c9ab5" tick={{ fontSize: 12 }}/>

                    <YAxis stroke="#8c9ab5" allowDecimals={false} tick={{ fontSize: 12 }}/>

                    <Tooltip contentStyle={{ backgroundColor: "#172238", border: "1px solid #31415d", borderRadius: "10px", color: "#fff",}}/>

                    <Bar dataKey="quantity" barSize={55} radius={[8, 8, 0, 0]} animationDuration={1000}>
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={entry.name === "Stock In" ? "#39d9a0" : "#ffad62"}/>
                        ))}
                    </Bar>
                
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
