import { useEffect, useState } from "react";
import { Api } from "../Api";

const api = new Api();

export default function AdminDashboard() {
    const [listings, setListings] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch both lists in parallel.
    useEffect(() => {
        Promise.all([api.api.listingGetAll(), api.api.categoryGetAll()])
            .then(([l, c]) => { setListings(l.data); setCategories(c.data); setLoading(false); });
    }, []);

    if (loading) return <p>Loading...</p>;

    // .filter() keeps only the items that match.
    const lowStock   = listings.filter(l => l.stock <= l.lowStockThreshold && !l.isOutOfStock);
    const outOfStock = listings.filter(l => l.isOutOfStock);
    const hidden     = listings.filter(l => !l.isActive);
    const discounted = listings.filter(l => l.discount);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Admin Dashboard</h1>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                {/* .length = how many items in each filtered list. */}
                <DashboardCard title="Total Listings"   value={listings.length} />
                <DashboardCard title="Categories"       value={categories.length} />
                <DashboardCard title="Low Stock"        value={lowStock.length}   color="#ff9800" />
                <DashboardCard title="Out of Stock"     value={outOfStock.length} color="#b00020" />
                <DashboardCard title="Hidden Listings"  value={hidden.length}     color="#555" />
                <DashboardCard title="Active Discounts" value={discounted.length} color="#f3d5a3" />
            </div>
        </div>
    );
}

// Reusable card so we don't repeat the same box six times.
function DashboardCard({ title, value, color }: { title: string; value: number; color?: string }) {
    return (
        <div style={{ border: "1px solid #ccc", borderRadius: "12px", padding: "1rem", background: "#1a1a1a", color: "#fbf0df", textAlign: "center" }}>
            <h3>{title}</h3>
            {/* color || "#fbf0df" = use color if provided, else default. */}
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: color || "#fbf0df" }}>{value}</p>
        </div>
    );
}