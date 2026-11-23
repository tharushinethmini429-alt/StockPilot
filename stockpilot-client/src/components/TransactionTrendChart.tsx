import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import type { StockTransaction } from "../types/Dashboard";

interface TransactionTrendChartProps {
    transactions: StockTransaction[];
}

export default function TransactionTrendChart({
    transactions,
}: TransactionTrendChartProps) {

    const groupedData = transactions.reduce<
        Record<string, { date: string; stockIn: number; stockOut: number }>
    >((acc, transaction) => {
        const date = new Date(transaction.transactionDate)
            .toLocaleDateString("en-CA");

        if (!acc[date]) {
            acc[date] = {
                date,
                stockIn: 0,
                stockOut: 0,
            };
        }

        if (transaction.type === "Stock In") {
            acc[date].stockIn += transaction.quantity;
        } else if (transaction.type === "Stock Out") {
            acc[date].stockOut += transaction.quantity;
        }

        return acc;
    }, {});

    const data = Object.values(groupedData).sort(
        (a, b) => a.date.localeCompare(b.date)
    );

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={data} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                
                <defs>
                    <linearGradient id="stockInGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#39d9a0" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#39d9a0" stopOpacity={0.02} />
                    </linearGradient>
                    
                    <linearGradient id="stockOutGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffad62" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#ffad62" stopOpacity={0.02} />
                    </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#26344d" vertical={false} />
                <XAxis dataKey="date" stroke="#8c9ab5" />
                <YAxis allowDecimals={false} stroke="#8c9ab5" />
                
                <Tooltip contentStyle={{
                    backgroundColor: "#172238",
                    border: "1px solid #31415d",
                    borderRadius: "10px",
                    color: "#fff",
                }} />
            <Legend />
            
            <Area type="monotone" dataKey="stockIn" name="Stock In" stroke="#39d9a0" fill="url(#stockInGradient)" strokeWidth={2.5} activeDot={{ r: 5 }} />
            
            <Area type="monotone" dataKey="stockOut" name="Stock Out" stroke="#ffad62" fill="url(#stockOutGradient)" strokeWidth={2.5} activeDot={{ r: 5 }} />
        
        </AreaChart>
    </ResponsiveContainer>
</div>
);
}
