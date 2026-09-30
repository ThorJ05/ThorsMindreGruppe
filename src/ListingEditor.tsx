import { useEffect, useState } from "react";
import { Api } from "../Api";

const api = new Api();

export default function ListingEditor({ listingId }: { listingId?: number }) {
    const [listing, setListing] = useState<any>({
        title: "",
        price: 0,
        stock: 0,
        lowStockThreshold: 0,
        isActive: true,
        isOutOfStock: false,
        categoryId: null,
        tags: [],
        images: [],
        discount: null
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    useEffect(() => {
        api.categoryGetAll().then(setCategories);

        if (listingId) {
            api.listingGetById(listingId).then(setListing);
        }
    }, [listingId]);

    function save() {
        const dto = {
            title: listing.title,
            price: listing.price,
            stock: listing.stock,
            lowStockThreshold: listing.lowStockThreshold,
            isActive: listing.isActive,
            isOutOfStock: listing.isOutOfStock,
            categoryId: listing.categoryId,
            tags: listing.tags,
            images: listing.images,
            discount: listing.discount
        };

        if (listingId) {
            api.listingUpdate(listingId, dto).then(() => alert("Updated!"));
        } else {
            api.listingCreate(dto).then(() => alert("Created!"));
        }
    }

    function addTag() {
        if (!tagInput.trim()) return;
        setListing({ ...listing, tags: [...listing.tags, { name: tagInput }] });
        setTagInput("");
    }

    function addImage() {
        if (!imageUrl.trim()) return;
        setListing({ ...listing, images: [...listing.images, { url: imageUrl }] });
        setImageUrl("");
    }

    function addDiscount() {
        const amount = Number(prompt("Discount amount:"));
        const expires = prompt("Expires at (YYYY-MM-DD):");

        if (!amount || !expires) return;

        setListing({
            ...listing,
            discount: {
                amount,
                expiresAt: expires
            }
        });
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
            <h1>{listingId ? "Edit Listing" : "Create Listing"}</h1>

            <label>Title</label>
            <input
                value={listing.title}
                onChange={e => setListing({ ...listing, title: e.target.value })}
            />

            <label>Price</label>
            <input
                type="number"
                value={listing.price}
                onChange={e => setListing({ ...listing, price: Number(e.target.value) })}
            />

            <label>Stock</label>
            <input
                type="number"
                value={listing.stock}
                onChange={e => setListing({ ...listing, stock: Number(e.target.value) })}
            />

            <label>Low Stock Threshold</label>
            <input
                type="number"
                value={listing.lowStockThreshold}
                onChange={e =>
                    setListing({ ...listing, lowStockThreshold: Number(e.target.value) })
                }
            />

            <label>Category</label>
            <select
                value={listing.categoryId || ""}
                onChange={e => setListing({ ...listing, categoryId: Number(e.target.value) })}
            >
                <option value="">Select category</option>
                {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <label>Tags</label>
            <div>
                <input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    placeholder="Add tag"
                />
                <button onClick={addTag}>Add</button>
            </div>
            <div>
                {listing.tags.map((t: any, i: number) => (
                    <span key={i} style={{
                        background: "#fbf0df",
                        color: "#1a1a1a",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "6px",
                        marginRight: "0.3rem"
                    }}>
            {t.name}
          </span>
                ))}
            </div>

            <label>Images</label>
            <div>
                <input
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    placeholder="Image URL"
                />
                <button onClick={addImage}>Add</button>
            </div>
            <div>
                {listing.images.map((img: any, i: number) => (
                    <img
                        key={i}
                        src={img.url}
                        alt=""
                        style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "0.5rem" }}
                    />
                ))}
            </div>

            <label>Status</label>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={listing.isActive}
                        onChange={e => setListing({ ...listing, isActive: e.target.checked })}
                    />
                    Active
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={listing.isOutOfStock}
                        onChange={e => setListing({ ...listing, isOutOfStock: e.target.checked })}
                    />
                    Out of Stock
                </label>
            </div>

            <label>Discount</label>
            <button onClick={addDiscount}>Add Discount</button>
            {listing.discount && (
                <p>
                    Discount: {listing.discount.amount} kr
                    <br />
                    Expires: {listing.discount.expiresAt}
                </p>
            )}

            <button
                onClick={save}
                style={{
                    marginTop: "1rem",
                    padding: "0.7rem 1.5rem",
                    background: "#fbf0df",
                    color: "#1a1a1a",
                    borderRadius: "8px",
                    fontWeight: "bold"
                }}
            >
                Save
            </button>
        </div>
    );
}
