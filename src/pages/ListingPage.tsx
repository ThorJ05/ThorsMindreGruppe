import { useEffect, useState } from "react";
import { Api, CategoryDto, ListingDto } from "../Api";

const api = new Api();

export default function ListingPage() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.api.listingGetAll(), api.api.categoryGetAll()])
            .then(([l, c]) => {
                setListings(l.data);
                setCategories(c.data);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading listings...</p>;

    function categoryName(categoryId?: number) {
        return categories.find(c => c.id === categoryId)?.name ?? "Uncategorized";
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Listings</h1>

            {listings.length === 0 && <p>No listings yet.</p>}

            <div className="bt-grid">
                {listings.map(listing => (
                    <div key={listing.id} className="bt-relic">
                        <div className="relic-name">{listing.title}</div>
                        {listing.description && (
                            <p style={{ fontSize: "0.9rem", color: "var(--bone-dim)" }}>
                                {listing.description}
                            </p>
                        )}
                        <div className="relic-meta">Category: {categoryName(listing.categoryId)}</div>
                        <div className="relic-price">{listing.price} kr</div>
                        <div className="relic-meta">Stock: {listing.stock}</div>

                        {listing.isOutOfStock && <span className="bt-tag danger">Out of stock</span>}
                        {!listing.isOutOfStock &&
                            listing.lowStockThreshold != null &&
                            listing.stock! <= listing.lowStockThreshold && (
                                <span className="bt-tag brass">Low stock</span>
                            )}
                        {!listing.isActive && <span className="bt-tag">Hidden</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}