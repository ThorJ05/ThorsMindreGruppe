import React from "react";
import ReactDOM from "react-dom/client";
// Router gives us URL-based navigation without page reloads.
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import ListingPage from "./pages/ListingPage";
import ListingEditor from "./pages/ListingEditor";
import BulkEditPage from "./pages/BulkEditPage";
import CategoryPage from "./pages/CategoryPage";
import AdminDashboard from "./pages/AdminDashboard";

// The whole app layout: nav bar on top, page content below.
function AppLayout() {
    return (
        <div>
            <nav style={{ background: "#1a1a1a", padding: "1rem", display: "flex", gap: "1rem" }}>
                {/* Link navigates without reloading the page. */}
                <Link to="/"           style={{ color: "#fbf0df" }}>Listings</Link>
                <Link to="/editor"     style={{ color: "#fbf0df" }}>Create Listing</Link>
                <Link to="/bulk"       style={{ color: "#fbf0df" }}>Bulk Edit</Link>
                <Link to="/categories" style={{ color: "#fbf0df" }}>Categories</Link>
                <Link to="/admin"      style={{ color: "#fbf0df" }}>Dashboard</Link>
            </nav>

            {/* Routes decides which page shows based on the URL. */}
            <div>
                <Routes>
                    <Route path="/"           element={<ListingPage />} />
                    <Route path="/editor"     element={<ListingEditor />} />
                    {/* :id means "any number in the URL, passed as a prop". */}
                    <Route path="/editor/:id" element={<ListingEditor />} />
                    <Route path="/bulk"       element={<BulkEditPage />} />
                    <Route path="/categories" element={<CategoryPage />} />
                    <Route path="/admin"      element={<AdminDashboard />} />
                </Routes>
            </div>
        </div>
    );
}

// Mount the app into <div id="root"> from index.html.
ReactDOM.createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <AppLayout />
    </BrowserRouter>
);