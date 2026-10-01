import { useEffect, useState } from "react";
import { Api } from "../Api";

const api = new Api();

export default function ListingPage() {
    // listings = data from the server; loading = show "Loading..." while true.
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Runs once when the page appears.
    useEffect(() => {
        api.listingGetAll()
            .then(setListings)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Listings</h1>

            {/* Responsive grid of cards. */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                {/* One card per listing; key helps React track them. */}
                {listings.map(listing => (
                    <div key={listing.id} style={{ border: "1px solid #ccc", borderRadius: "12px", padding: "1rem", background: "#1a1a1a", color: "#fbf0df" }}>

                        {/* Show first image if any. */}
                        {listing.images?.length > 0 && (
                            <img src={listing.images[0].url} alt="Listing"
                                 style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px" }} />
                        )}

                        <h2>{listing.title}</h2>
                        {/* ?. = safely access if it exists. */}
                        <p><strong>Category:</strong> {listing.category?.name}</p>

                        {/* Tag chips. */}
                        <div style={{ marginBottom: "0.5rem" }}>
                            {listing.tags?.map((tag: any) => (
                                <span key={tag.id} style={{ background: "#fbf0df", color: "#1a1a1a", padding: "0.2rem 0.5rem", borderRadius: "6px", marginRight: "0.3rem", fontSize: "0.8rem" }}>
                  {tag.name}
                </span>
                            ))}
                        </div>

                        {/* Price: crossed-out original if discounted. */}
                        {listing.discount ? (
                            <div>
                                <p style={{ textDecoration: "line-through", opacity: 0.6 }}>{listing.price} kr</p>
                                <p style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#f3d5a3" }}>
                                    {listing.price - listing.discount.amount} kr
                                </p>
                                <p style={{ fontSize: "0.8rem" }}>Sale ends: {new Date(listing.discount.expiresAt).toLocaleString()}</p>
                            </div>
                        ) : (
                            <p style={{ fontSize: "1.3rem", fontWeight: "bold" }}>{listing.price} kr</p>
                        )}

                        {/* Status labels shown only when true. */}
                        {listing.isOutOfStock && (
                            <p style={{ background: "#b00020", padding: "0.3rem", borderRadius: "6px", textAlign: "center", fontWeight: "bold" }}>OUT OF STOCK</p>
                        )}
                        {listing.stock <= listing.lowStockThreshold && !listing.isOutOfStock && (
                            <p style={{ background: "#ff9800", padding: "0.3rem", borderRadius: "6px", textAlign: "center", fontWeight: "bold" }}>LOW STOCK</p>
                        )}
                        {!listing.isActive && (
                            <p style={{ background: "#555", padding: "0.3rem", borderRadius: "6px", textAlign: "center", fontWeight: "bold" }}>HIDDEN</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}