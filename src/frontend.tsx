import "./index.css";

import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import ListingPage from "./pages/ListingPage";
import ListingEditor from "./pages/ListingEditor";
import BulkEditPage from "./pages/BulkEditPage";
import CategoryPage from "./pages/CategoryPage";
import AdminDashboard from "./pages/AdminDashboard";
import CartPage from "./pages/CartPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

import { CartProvider } from "./CartContext";

function AppLayout() {
    // Turn on the Black Templar theme for the whole app.
    // This adds the `templar` class to <body>, which activates all the
    // `body.templar ...` and `.templar-*` CSS rules in index.css.
    useEffect(() => {
        document.body.classList.add("templar");
        return () => document.body.classList.remove("templar");
    }, []);

    return (
        <div>
            <nav
                className="bm-nav"
                style={{
                    background: "linear-gradient(180deg, #0d0f12, #07080a)",
                    padding: "1rem 1.25rem",
                    display: "flex",
                    gap: "1.5rem",
                    alignItems: "center",
                    borderBottom: "1px solid #2a2f38",
                    fontFamily: '"Cinzel", serif',
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    fontSize: ".8rem",
                }}
            >
                <Link to="/"           style={{ color: "#e8d9b0" }}>Listings</Link>
                <Link to="/cart"       style={{ color: "#e8d9b0" }}>Cart</Link>
                <Link to="/orders"     style={{ color: "#e8d9b0" }}>Orders</Link>
                <Link to="/editor"     style={{ color: "#e8d9b0" }}>Create Listing</Link>
                <Link to="/bulk"       style={{ color: "#e8d9b0" }}>Bulk Edit</Link>
                <Link to="/categories" style={{ color: "#e8d9b0" }}>Categories</Link>
                <Link to="/admin"      style={{ color: "#e8d9b0" }}>Dashboard</Link>
            </nav>

            <Routes>
                <Route path="/"           element={<ListingPage />} />
                <Route path="/cart"       element={<CartPage />} />
                <Route path="/orders"     element={<OrderHistoryPage />} />
                <Route path="/editor"     element={<ListingEditor />} />
                <Route path="/editor/:id" element={<ListingEditor />} />
                <Route path="/bulk"       element={<BulkEditPage />} />
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/admin"      element={<AdminDashboard />} />
            </Routes>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <CartProvider>
            <AppLayout />
        </CartProvider>
    </BrowserRouter>
);