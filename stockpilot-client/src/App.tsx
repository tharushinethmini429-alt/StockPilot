import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import StockManagement from "./pages/StockManagement";
import Transactions from "./pages/Transactions";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import { BrowserRouter, Routes, Route,} from "react-router-dom";


  function App() {
    return(
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<Categories />} />
        <Route path="stock" element={<StockManagement />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      </BrowserRouter>
    );
  }
  

  export default App;