import { useEffect, useState } from "react";
import { Api } from "../Api";

const api = new Api();

export default function BulkEditPage() {
    const [listings, setListings] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [stock, setStock] = useState<number | undefined>(undefined);

    useEffect(() => {
        api.listingGetAll().then(setListings);
    }, []);

    function toggleSelect(id: number) {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(x => x !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    }

    async function applyBulkUpdate() {
        if (selectedIds.length === 0) {
            alert("Select at least one listing");
            return;
        }

        await api.listingBulkUpdate(selectedIds, price, stock);
        alert("Bulk update applied!");

        // Reload listings
        api.listingGetAll().then(setListings);
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Bulk Edit Listings</h1>

            <div style={{ marginBottom: "1rem" }}>
                <label>New Price (optional)</label>
                <input
                    type="number"
                    value={price ?? ""}
                    onChange={e => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                />

                <label style={{ marginLeft: "1rem" }}>New Stock (optional)</label>
                <input
                    type="number"
                    value={stock ?? ""}
                    onChange={e => setStock(e.target.value ? Number(e.target.value) : undefined)}
                />

                <button
                    onClick={applyBulkUpdate}
                    style={{
                        marginLeft: "1rem",
                        padding: "0.5rem 1rem",
                        background: "#fbf0df",
                        color: "#1a1a1a",
                        borderRadius: "8px",
                        fontWeight: "bold"
                    }}
                >
                    Apply Bulk Update
                </button>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem"
            }}>
                {listings.map(listing => (
                    <div key={listing.id} style={{
                        border: "1px solid #ccc",
                        borderRadius: "12px",
                        padding: "1rem",
                        background: "#1a1a1a",
                        color: "#fbf0df"
                    }}>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(listing.id)}
                                onChange={() => toggleSelect(listing.id)}
                            />
                            <strong>{listing.title}</strong>
                        </label>

                        <p>Price: {listing.price} kr</p>
                        <p>Stock: {listing.stock}</p>

                        {listing.images?.length > 0 && (
                            <img
                                src={listing.images[0].url}
                                alt=""
                                style={{
                                    width: "100%",
                                    height: "140px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    marginTop: "0.5rem"
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
