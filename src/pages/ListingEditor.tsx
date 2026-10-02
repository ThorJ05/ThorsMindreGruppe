import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Api, CategoryDto, ListingDto } from "../Api";

const api = new Api();

export default function ListingEditor() {
    const { id } = useParams();
    const listingId = id ? Number(id) : undefined;

    const [listing, setListing] = useState<ListingDto>({
        title: "",
        description: "",
        price: 0,
        stock: 0,
        lowStockThreshold: 0,
        isActive: true,
        isOutOfStock: false,
        categoryId: 0,
    });

    const [categories, setCategories] = useState<CategoryDto[]>([]);

    useEffect(() => {
        api.api.categoryGetAll().then(res => setCategories(res.data));
        if (listingId) {
            api.api.listingGetById(listingId).then(res => setListing(res.data));
        }
    }, [listingId]);

    async function save() {
        if (!listing.title?.trim()) return alert("Title required");
        if (!listing.categoryId) return alert("Category required");

        if (listingId) {
            await api.api.listingUpdate(listingId, listing);
            alert("Listing updated");
        } else {
            await api.api.listingCreate(listing);
            alert("Listing created");
        }
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
            <h1>{listingId ? "Edit Listing" : "Create Listing"}</h1>

            <label>Title</label>
            <input
                className="bt-input"
                style={{ width: "100%", marginBottom: "1rem" }}
                value={listing.title ?? ""}
                onChange={e => setListing({ ...listing, title: e.target.value })}
            />

            <label>Description</label>
            <textarea
                className="bt-input"
                style={{ width: "100%", marginBottom: "1rem", minHeight: "80px" }}
                value={listing.description ?? ""}
                onChange={e => setListing({ ...listing, description: e.target.value })}
            />

            <label>Price</label>
            <input
                className="bt-input"
                style={{ width: "100%", marginBottom: "1rem" }}
                type="text"
                inputMode="numeric"
                value={listing.price ?? 0}
                onFocus={e => e.target.select()}
                onChange={e => {
                    if (!/^\d*$/.test(e.target.value)) return;
                    setListing({ ...listing, price: e.target.value ? Number(e.target.value) : 0 });
                }}
            />

            <label>Stock</label>
            <input
                className="bt-input"
                style={{ width: "100%", marginBottom: "1rem" }}
                type="text"
                inputMode="numeric"
                value={listing.stock ?? 0}
                onFocus={e => e.target.select()}
                onChange={e => {
                    if (!/^\d*$/.test(e.target.value)) return;
                    const newStock = e.target.value ? Number(e.target.value) : 0;
                    setListing({ ...listing, stock: newStock, isOutOfStock: newStock === 0 });
                }}
            />

            <label>Low Stock Threshold</label>
            <input
                className="bt-input"
                style={{ width: "100%", marginBottom: "1rem" }}
                type="text"
                inputMode="numeric"
                value={listing.lowStockThreshold ?? 0}
                onFocus={e => e.target.select()}
                onChange={e => {
                    if (!/^\d*$/.test(e.target.value)) return;
                    setListing({
                        ...listing,
                        lowStockThreshold: e.target.value ? Number(e.target.value) : 0,
                    });
                }}
            />

            <label>Category</label>
            <select
                className="bt-select"
                style={{ width: "100%", marginBottom: "1rem" }}
                value={listing.categoryId ?? ""}
                onChange={e => setListing({ ...listing, categoryId: Number(e.target.value) })}
            >
                <option value="">Select a category</option>
                {categories.map(c => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>

            <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ marginRight: "1.5rem" }}>
                    <input
                        type="checkbox"
                        checked={listing.isActive ?? true}
                        onChange={e => setListing({ ...listing, isActive: e.target.checked })}
                    />{" "}
                    Active
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={listing.isOutOfStock ?? false}
                        onChange={e => setListing({ ...listing, isOutOfStock: e.target.checked })}
                    />{" "}
                    Out of stock
                </label>
            </div>

            <button className="bt-btn" onClick={save}>
                Save
            </button>
        </div>
    );
}