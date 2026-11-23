export interface DashboardSummary {
    totalProducts: number;
    totalCategories: number;
    totalStockQuantity: number;
    totalStockValue: number;
    lowStockCount: number;
    outOfStockCount: number;
}
export interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    quantity: number;
    reorderLevel: number;
    categoryId: number;
    categoryName: string;
    isLowStock: boolean;
}
export interface StockTransaction {
    id: number;
    productId: number;
    productName: string;
    type: string;
    quantity: number;
    transactionDate: string;
    note: string;
}
export interface Category {
    id: number;
    name: string;
}