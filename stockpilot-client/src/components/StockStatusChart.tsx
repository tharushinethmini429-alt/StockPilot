import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface StockStatusChartProps {
    inStock: number;
    lowStock: number;
    outOfStock: number;
}

const COLORS = ["#39d9a0", "#ffad62", "#ff687d"];

export default function StockStatusChart({
    inStock,
    lowStock,
    outOfStock,   
}: StockStatusChartProps) {

    const data = [
        {name: "In Stock", value: inStock },
        {name: "Low Stock", value: lowStock },
        {name: "Out of Stock", value: outOfStock}
    ];

    const total = inStock + lowStock + outOfStock;
    const healthyPercentage = total > 0
    ? Math.round((inStock / total) * 100)
    : 0;

    return (
        <div className="chart-container">
            <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={5} dataKey="value" animationDuration={1000}>
                    {data.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index]} />
                    ))}
                    </Pie>
                    <Tooltip
                    contentStyle={{
                        backgroundColor: "#172238",
                        border: "1px solid #31415d",
                        borderRadius: "10px",
                        color: "#fff",
                    }}
                    />

                    <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="25" fontWeight="700">{healthyPercentage}%</text>
                    <text x="50%" y="59%" textAnchor="middle" dominantBaseline="middle" fill="#8c9ab5" fontSize="11">Healthy</text>
                </PieChart>
            </ResponsiveContainer>

            <div className="chart-legend">
                {data.map((item, index) => (
                    <div className="legend-item" key={item.name}>
                        <div className="legend-label">
                            <span className="legend-dot" style={{backgroundColor: COLORS[index] }}/>
                            <span>{item.name}</span>
                        </div>
                        <strong>{item.value}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}
