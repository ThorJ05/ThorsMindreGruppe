import { useEffect, useState } from "react";
import { api } from "../api-instance";
import type { CategoryDto, ListingDto } from "../Api";
export default function AdminDashboard() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.api.listingGetAll(), api.api.categoryGetAll()])
            .then(([lRes, cRes]) => {
                setListings(lRes.data);
                setCategories(cRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;

    const lowStock   = listings.filter(l => l.stock != null && l.lowStockThreshold != null && l.stock <= l.lowStockThreshold && !l.isOutOfStock);
    const outOfStock = listings.filter(l => l.isOutOfStock);
    const hidden     = listings.filter(l => !l.isActive);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Admin Dashboard</h1>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                <DashboardCard title="Total Listings"  value={listings.length} />
                <DashboardCard title="Categories"      value={categories.length} />
                <DashboardCard title="Low Stock"       value={lowStock.length} color="#ff9800" />
                <DashboardCard title="Out of Stock"    value={outOfStock.length} color="#b00020" />
                <DashboardCard title="Hidden Listings" value={hidden.length} color="#555" />
            </div>
        </div>
    );
}

function DashboardCard({ title, value, color }: { title: string; value: number; color?: string }) {
    return (
        <div style={{ border: "1px solid #ccc", borderRadius: "12px", padding: "1rem", background: "#1a1a1a", color: "#fbf0df", textAlign: "center" }}>
            <h3>{title}</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: color || "#fbf0df" }}>{value}</p>
        </div>
    );
}