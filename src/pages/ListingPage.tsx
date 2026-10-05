import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type CategoryDto, type ListingDto } from "../Api";

export default function ListingPage() {
    const [listings, setListings] = useState<ListingDto[]>([]);
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([api.api.listingGetAll(), api.api.categoryGetAll()])
            .then(([lRes, cRes]) => {
                // Log so we can see the exact shape in the browser console
                console.log("listing response:", lRes);
                console.log("category response:", cRes);

                // Unwrap the response. The generated client returns
                // HttpResponse<T>, so `.data` holds the body. But if the
                // response is already an array (unlikely), fall back to it.
                const listingsData = Array.isArray(lRes?.data) ? lRes.data : lRes;
                const categoriesData = Array.isArray(cRes?.data) ? cRes.data : cRes;

                setListings(Array.isArray(listingsData) ? listingsData : []);
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            })
            .catch(err => console.error("Failed to load:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ padding: "2rem" }}>Loading listings...</p>;

    return (
        <div className="templar-main" style={{ padding: "2rem" }}>
            <h2>Listings</h2>

            <div className="templar-products">
                {listings.map(listing => {
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
                        </div>
                    );
                })}
                {listings.length === 0 && (
                    <p style={{ color: "#5a6270" }}>The armoury is empty, brother.</p>
                )}
            </div>
        </div>
    );
}