import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./theme.css";

import ListingPage from "./pages/ListingPage";
import ListingEditor from "./pages/ListingEditor";
import BulkEditPage from "./pages/BulkEditPage";
import CategoryPage from "./pages/CategoryPage";
import AdminDashboard from "./pages/AdminDashboard";

function AppLayout() {
    return (
        <div>
            <nav className="bt-nav">
                <Link to="/">Listings</Link>
                <Link to="/editor">Create Listing</Link>
                <Link to="/bulk">Bulk Edit</Link>
                <Link to="/categories">Categories</Link>
                <Link to="/admin">Dashboard</Link>
            </nav>
            <div>
                <Routes>
                    <Route path="/" element={<ListingPage />} />
                    <Route path="/editor" element={<ListingEditor />} />
                    <Route path="/editor/:id" element={<ListingEditor />} />
                    <Route path="/bulk" element={<BulkEditPage />} />
                    <Route path="/categories" element={<CategoryPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </div>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AppLayout />
    </BrowserRouter>
);