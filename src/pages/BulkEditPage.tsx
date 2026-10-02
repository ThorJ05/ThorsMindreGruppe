import { useEffect, useState } from "react";
import { Api, ListingDto } from "../Api";

const api = new Api();

export default function BulkEditPage() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [stock, setStock] = useState<number | undefined>(undefined);

    useEffect(() => {
        load();
    }, []);

    function load() {
        api.api.listingGetAll().then(res => setListings(res.data));
    }

    function toggleSelect(id: number) {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    }

    async function applyBulkUpdate() {
        if (selectedIds.length === 0) {
            alert("Select at least one listing");
            return;
        }

        await api.api.listingBulkUpdate({
            ids: selectedIds,
            price: price,
            stock: stock,
        });

        alert("Bulk update applied");
        load();
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Bulk Edit</h1>

            <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <div>
                    <label>New price</label>
                    <br />
                    <input
                        className="bt-input"
                        type="text"
                        inputMode="numeric"
                        value={price ?? ""}
                        onFocus={e => e.target.select()}
                        onChange={e => {
                            if (!/^\d*$/.test(e.target.value)) return;
                            setPrice(e.target.value ? Number(e.target.value) : undefined);
                        }}
                    />
                </div>
                <div>
                    <label>New stock</label>
                    <br />
                    <input
                        className="bt-input"
                        type="text"
                        inputMode="numeric"
                        value={stock ?? ""}
                        onFocus={e => e.target.select()}
                        onChange={e => {
                            if (!/^\d*$/.test(e.target.value)) return;
                            setStock(e.target.value ? Number(e.target.value) : undefined);
                        }}
                    />
                </div>
                <button className="bt-btn" style={{ marginTop: "1.4rem" }} onClick={applyBulkUpdate}>
                    Apply to selected
                </button>
            </div>

            <div className="bt-grid">
                {listings.map(listing => (
                    <div key={listing.id} className="bt-relic">
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <input
                                type="checkbox"
                                checked={selectedIds.includes(listing.id!)}
                                onChange={() => toggleSelect(listing.id!)}
                            />
                            <span className="relic-name">{listing.title}</span>
                        </label>
                        <div className="relic-price">{listing.price} credits</div>
                        <div className="relic-meta">Stock: {listing.stock}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
