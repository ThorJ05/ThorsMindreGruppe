import { useEffect, useState } from "react";
import { api } from "../api-instance";
import type { CategoryDto, ListingDto, ShopStatsDto } from "../Api";

export default function AdminDashboard() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [stats, setStats] = useState<ShopStatsDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    function load() {
        Promise.all([
            api.api.listingGetAll(),
            api.api.categoryGetAll(),
            api.api.orderGetStats(),
        ])
            .then(([lRes, cRes, sRes]) => {
                setListings(Array.isArray(lRes?.data) ? lRes.data : []);
                setCategories(Array.isArray(cRes?.data) ? cRes.data : []);
                setStats(sRes.data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, []);

    async function deleteSeized() {
        if (!confirm("Delete all seized listings? This cannot be undone.")) return;
        setBusy(true);
        try {
            const res = await api.api.listingDeleteSeized();
            alert(`Deleted ${res.data} seized listing(s).`);
            load();
        } catch (err) {
            console.error(err);
            alert("Failed to delete seized listings.");
        } finally {
            setBusy(false);
        }
    }

    if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

    const lowStock   = listings.filter(l => l.stock != null && l.lowStockThreshold != null && l.stock <= l.lowStockThreshold && !l.isOutOfStock);
    const outOfStock = listings.filter(l => l.isOutOfStock);
    const seized     = listings.filter(l => !l.isActive);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Admin Dashboard</h1>

            {seized.length > 0 && (
                <div style={{
                    border: "2px solid #8b1a1a",
                    background: "rgba(139,26,26,.1)",
                    padding: "1rem 1.25rem",
                    marginTop: "1rem",
                    marginBottom: "1rem",
                }}>
                    <div style={{ color: "#c62b2b", fontWeight: "bold", letterSpacing: ".1em" }}>
                        {seized.length} SEIZED LISTING(S)
                    </div>
                    <div style={{ color: "#8a7a52", fontSize: ".85rem", marginTop: ".35rem" }}>
                        These were deactivated by the raid and are hidden from the storefront.
                    </div>
                    <button
                        onClick={deleteSeized}
                        disabled={busy}
                        style={{
                            marginTop: ".75rem",
                            padding: ".5rem 1rem",
                            background: "#8b1a1a",
                            color: "#e8d9b0",
                            border: "none",
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            cursor: busy ? "wait" : "pointer",
                        }}
                    >
                        {busy ? "Deleting..." : `Delete All Seized (${seized.length})`}
                    </button>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
                <DashboardCard title="Total Listings"  value={listings.length} />
                <DashboardCard title="Categories"      value={categories.length} />
                <DashboardCard title="Low Stock"       value={lowStock.length} color="#ff9800" />
                <DashboardCard title="Out of Stock"    value={outOfStock.length} color="#b00020" />
                <DashboardCard title="Seized"          value={seized.length}   color="#c62b2b" />
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