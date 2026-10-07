import { useEffect, useState } from "react";
import { api } from "../api-instance";
import type { ListingDto } from "../Api";

export default function BulkEditPage() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [stock, setStock] = useState<number | undefined>(undefined);

    function load() {
        api.api.listingGetAll()
            .then(r => setListings(r.data))
            .catch(err => console.error(err));
    }

    useEffect(() => { load(); }, []);

    function toggleSelect(id: number) {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(x => x !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    async function applyBulkUpdate() {
        if (selectedIds.length === 0) return alert("Select at least one listing");
        try {
            await api.api.listingBulkUpdate({ ids: selectedIds, price, stock });
            alert("Bulk update applied!");
            load();
        } catch (err) {
            console.error(err);
            alert("Bulk update failed");
        }
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Bulk Edit Listings</h1>
            <div style={{ marginBottom: "1rem" }}>
                <label>New Price (optional)</label>
                <input type="number" value={price ?? ""}
                       onChange={e => setPrice(e.target.value ? Number(e.target.value) : undefined)} />
                <label style={{ marginLeft: "1rem" }}>New Stock (optional)</label>
                <input type="number" value={stock ?? ""}
                       onChange={e => setStock(e.target.value ? Number(e.target.value) : undefined)} />
                <button onClick={applyBulkUpdate} style={{ marginLeft: "1rem" }}>
                    Apply Bulk Update
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {listings.map(listing => (
                    <div key={listing.id} style={{ border: "1px solid #ccc", borderRadius: "12px", padding: "1rem", background: "#1a1a1a", color: "#fbf0df" }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input type="checkbox"
                                   checked={selectedIds.includes(listing.id!)}
                                   onChange={() => listing.id != null && toggleSelect(listing.id)} />
                            <strong>{listing.title}</strong>
                        </label>
                        <p>Price: {listing.price} kr</p>
                        <p>Stock: {listing.stock}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}