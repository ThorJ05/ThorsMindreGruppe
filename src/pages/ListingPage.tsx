import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api-instance";
import type { CategoryDto, ListingDto } from "../Api";
import { useCart } from "../CartContext";

export default function ListingPage() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter/search/sort state.
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc">("newest");
    const { addToCart } = useCart();

    useEffect(() => {
        Promise.all([api.api.listingGetAll(), api.api.categoryGetAll()])
            .then(([lRes, cRes]) => {
                console.log("listing response:", lRes);
                console.log("category response:", cRes);

                const listingsData = Array.isArray(lRes?.data) ? lRes.data : lRes;
                const categoriesData = Array.isArray(cRes?.data) ? cRes.data : cRes;

                setListings(Array.isArray(listingsData) ? listingsData : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            })
            .catch(err => console.error("Failed to load:", err))
            .finally(() => setLoading(false));
    }, []);

    // Derive the visible list: filter by category, filter by search text,
    // then sort. useMemo avoids recomputing on every unrelated re-render.
    const visibleListings = useMemo(() => {
        let result = listings;

        if (categoryId !== "") {
            result = result.filter(l => l.categoryId === categoryId);
        }

        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter(l => l.title?.toLowerCase().includes(q));
        }

        result = [...result];
        if (sortBy === "price-asc") {
            result.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        } else if (sortBy === "price-desc") {
            result.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        } else {
            // "newest" — higher id assumed more recent, since there's no createdAt field.
            result.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        }

        return result;
    }, [listings, categoryId, search, sortBy]);

    if (loading) return <p style={{ padding: "2rem" }}>Loading listings...</p>;

    return (
        <div className="templar-main" style={{ padding: "2rem" }}>
            <h2>Listings</h2>

            <div
                style={{
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                    marginBottom: "1.5rem",
                    alignItems: "center",
                }}
            >
                <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </div>

            <div className="templar-products">
                {visibleListings.map(listing => {
                    const category = categories.find(c => c.id === listing.categoryId);
                    return (
                        <div key={listing.id} className="templar-card">
                            {listing.imageUrl ? (
                                <img
                                    src={listing.imageUrl}
                                    alt={listing.title}
                                    onError={e => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                    style={{
                                        aspectRatio: "1 / 1",
                                        width: "100%",
                                        objectFit: "cover",
                                        border: "1px solid #2a2f38",
                                        marginBottom: ".75rem",
                                        display: "block",
                                    }}
                                />
                            ) : (
                                <div className="thumb">NO PICTORIAL RECORD</div>
                            )}

                            <h3>{listing.title}</h3>

                            {listing.description && (
                                <p style={{
                                    color: "#8a7a52",
                                    fontSize: ".8rem",
                                    margin: "0 0 .5rem",
                                    lineHeight: 1.4,
                                }}>
                                    {listing.description}
                                </p>
                            )}

                            <div className="vendor">
                                {category?.name ?? "Unclassified"}
                            </div>
                            <div className="price">{listing.price} THRONES</div>
                            <div className="vendor" style={{ marginTop: ".35rem" }}>
                                Stock: {listing.stock}
                            </div>

                            {listing.isOutOfStock && (
                                <p style={{
                                    background: "#8b1a1a",
                                    color: "#e8d9b0",
                                    padding: ".25rem",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: ".7rem",
                                    letterSpacing: ".12em",
                                    marginTop: ".5rem",
                                }}>
                                    DEPLETED
                                </p>
                            )}

                            <Link
                                to={`/editor/${listing.id}`}
                                style={{
                                    display: "inline-block",
                                    marginTop: ".75rem",
                                    padding: ".35rem .75rem",
                                    border: "1px solid #8b1a1a",
                                    color: "#e8d9b0",
                                    fontSize: ".7rem",
                                    letterSpacing: ".14em",
                                    textTransform: "uppercase",
                                    textDecoration: "none",
                                }}
                            >
                                Amend Record
                            </Link>
                            <button
                                onClick={() => addToCart(listing)}
                                disabled={listing.isOutOfStock}
                                style={{
                                    display: "block",
                                    marginTop: ".5rem",
                                    padding: ".35rem .75rem",
                                    background: listing.isOutOfStock ? "#333" : "#8b1a1a",
                                    color: "#e8d9b0",
                                    border: "none",
                                    fontSize: ".7rem",
                                    letterSpacing: ".14em",
                                    textTransform: "uppercase",
                                    cursor: listing.isOutOfStock ? "not-allowed" : "pointer",
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>
                    );
                })}
                {visibleListings.length === 0 && (
                    <p style={{ color: "#5a6270" }}>The armoury is empty, brother.</p>
                )}
            </div>
        </div>
    );
}