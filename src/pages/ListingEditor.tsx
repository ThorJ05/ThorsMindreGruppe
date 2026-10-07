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

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: ".7rem",
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: "#8a7a52",
    marginBottom: ".35rem",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#0d0f12",
    border: "1px solid #2a2f38",
    color: "#e8d9b0",
    padding: ".55rem .7rem",
    fontSize: ".9rem",
};

const fieldStyle: React.CSSProperties = {
    marginBottom: "1rem",
};

const sectionStyle: React.CSSProperties = {
    border: "1px solid #2a2f38",
    padding: "1.25rem",
    marginBottom: "1.5rem",
    background: "#111318",
};

const sectionTitleStyle: React.CSSProperties = {
    fontSize: ".75rem",
    letterSpacing: ".14em",
    textTransform: "uppercase",
    color: "#8b1a1a",
    marginBottom: "1rem",
    borderBottom: "1px solid #2a2f38",
    paddingBottom: ".5rem",
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
        <div className="templar-main" style={{ padding: "2rem", maxWidth: "640px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "1.5rem" }}>
                {listingId ? "Amend Record" : "Create Listing"}
            </h2>

            {/* Basic info */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>Basic Information</div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Title</label>
                    <input
                        style={inputStyle}
                        value={listing.title}
                        onChange={e => setListing({ ...listing, title: e.target.value })}
                    />
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Description</label>
                    <input
                        style={inputStyle}
                        value={listing.description}
                        onChange={e => setListing({ ...listing, description: e.target.value })}
                    />
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Image URL</label>
                    <input
                        style={inputStyle}
                        value={listing.imageUrl}
                        onChange={e => setListing({ ...listing, imageUrl: e.target.value })}
                        placeholder="https://picsum.photos/400"
                    />
                </div>
            </div>

            {/* Pricing & stock */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>Pricing &amp; Stock</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div style={fieldStyle}>
                        <label style={labelStyle}>Price (Thrones)</label>
                        <input
                            type="number"
                            style={inputStyle}
                            value={listing.price}
                            onChange={e => setListing({ ...listing, price: numOrEmpty(e.target.value) })}
                            placeholder="0"
                        />
                    </div>

                    <div style={fieldStyle}>
                        <label style={labelStyle}>Stock</label>
                        <input
                            type="number"
                            style={inputStyle}
                            value={listing.stock}
                            onChange={e => setListing({ ...listing, stock: numOrEmpty(e.target.value) })}
                            placeholder="0"
                        />
                    </div>
                </div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Low Stock Threshold</label>
                    <input
                        type="number"
                        style={inputStyle}
                        value={listing.lowStockThreshold}
                        onChange={e => setListing({ ...listing, lowStockThreshold: numOrEmpty(e.target.value) })}
                        placeholder="0"
                    />
                </div>
            </div>

            {/* Category & status */}
            <div style={sectionStyle}>
                <div style={sectionTitleStyle}>Category &amp; Status</div>

                <div style={fieldStyle}>
                    <label style={labelStyle}>Category</label>
                    <select
                        style={inputStyle}
                        value={listing.categoryId}
                        onChange={e => setListing({ ...listing, categoryId: Number(e.target.value) })}
                    >
                        <option value={0}>Select category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <label style={{ display: "flex", alignItems: "center", gap: ".5rem", color: "#e8d9b0" }}>
                    <input
                        type="checkbox"
                        checked={listing.isActive}
                        onChange={e => setListing({ ...listing, isActive: e.target.checked })}
                    />
                    Active
                </label>
            </div>

            <button
                onClick={save}
                style={{
                    padding: ".7rem 1.75rem",
                    background: "#8b1a1a",
                    color: "#e8d9b0",
                    border: "none",
                    fontWeight: "bold",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                }}
            >
                Save
            </button>
        </div>
    );
}