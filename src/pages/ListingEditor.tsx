import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api-instance";
import type { CategoryDto, ListingDto } from "../Api";

type FormState = {
    title: string;
    description: string;
    imageUrl: string;
    price: number | "";
    stock: number | "";
    lowStockThreshold: number | "";
    isActive: boolean;
    categoryId: number;
};

const emptyForm: FormState = {
    title: "",
    description: "",
    imageUrl: "",
    price: "",
    stock: "",
    lowStockThreshold: "",
    isActive: true,
    categoryId: 0,
};

export default function ListingEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const listingId = id ? Number(id) : undefined;

    const [listing, setListing] = useState<FormState>(emptyForm);
    const [categories, setCategories] = useState<CategoryDto[]>([]);

    useEffect(() => {
        api.api.categoryGetAll()
            .then(r => setCategories(r.data))
            .catch(console.error);

        if (listingId) {
            api.api.listingGetById(listingId)
                .then(r => {
                    const l = r.data;
                    setListing({
                        title: l.title ?? "",
                        description: l.description ?? "",
                        imageUrl: l.imageUrl ?? "",
                        price: l.price ?? "",
                        stock: l.stock ?? "",
                        lowStockThreshold: l.lowStockThreshold ?? "",
                        isActive: l.isActive ?? true,
                        categoryId: l.categoryId ?? 0,
                    });
                })
                .catch(console.error);
        }
    }, [listingId]);

    function numOrEmpty(raw: string): number | "" {
        if (raw === "") return "";
        const n = Number(raw);
        return Number.isNaN(n) ? "" : n;
    }

    async function save() {
        if (!listing.categoryId) {
            alert("Please pick a category");
            return;
        }

        const dto: ListingDto = {
            title: listing.title,
            description: listing.description,
            imageUrl: listing.imageUrl,
            price: listing.price === "" ? 0 : listing.price,
            stock: listing.stock === "" ? 0 : listing.stock,
            lowStockThreshold: listing.lowStockThreshold === "" ? 0 : listing.lowStockThreshold,
            isActive: listing.isActive,
            categoryId: listing.categoryId,
        };

        try {
            if (listingId) {
                await api.api.listingUpdate(listingId, dto);
                alert("Updated!");
            } else {
                await api.api.listingCreate(dto);
                alert("Created!");
            }
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Save failed");
        }
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
            <h1>{listingId ? "Edit Listing" : "Create Listing"}</h1>

            <label>Title</label>
            <input value={listing.title}
                   onChange={e => setListing({ ...listing, title: e.target.value })} />

            <label>Description</label>
            <input value={listing.description}
                   onChange={e => setListing({ ...listing, description: e.target.value })} />

            <label>Image URL</label>
            <input value={listing.imageUrl}
                   onChange={e => setListing({ ...listing, imageUrl: e.target.value })}
                   placeholder="https://picsum.photos/400" />

            <label>Price</label>
            <input type="number" value={listing.price}
                   onChange={e => setListing({ ...listing, price: numOrEmpty(e.target.value) })}
                   placeholder="0" />

            <label>Stock</label>
            <input type="number" value={listing.stock}
                   onChange={e => setListing({ ...listing, stock: numOrEmpty(e.target.value) })}
                   placeholder="0" />

            <label>Low Stock Threshold</label>
            <input type="number" value={listing.lowStockThreshold}
                   onChange={e => setListing({ ...listing, lowStockThreshold: numOrEmpty(e.target.value) })}
                   placeholder="0" />

            <label>Category</label>
            <select value={listing.categoryId}
                    onChange={e => setListing({ ...listing, categoryId: Number(e.target.value) })}>
                <option value={0}>Select category</option>
                {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <label>
                <input type="checkbox" checked={listing.isActive}
                       onChange={e => setListing({ ...listing, isActive: e.target.checked })} />
                Active
            </label>

            <button onClick={save} style={{ marginTop: "1rem" }}>Save</button>
        </div>
    );
}