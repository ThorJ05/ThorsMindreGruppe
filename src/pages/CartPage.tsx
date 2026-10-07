import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api-instance";
import { useCart } from "../CartContext";

export default function CartPage() {
    const { lines, removeFromCart, setQuantity, clearCart, total } = useCart();
    const [error, setError] = useState<string | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);
    const navigate = useNavigate();

    async function checkout() {
        setError(null);
        setCheckingOut(true);
        try {
            const res = await api.api.orderCheckout({
                items: lines.map(l => ({
                    listingId: l.listing.id!,
                    quantity: l.quantity,
                })),
            });
            clearCart();
            navigate(`/orders`);
        } catch (err: any) {
            const message = err?.error ?? "Checkout failed.";
            setError(typeof message === "string" ? message : "Checkout failed.");
        } finally {
            setCheckingOut(false);
        }
    }

    if (lines.length === 0) {
        return (
            <div className="templar-main" style={{ padding: "2rem" }}>
                <h2>Cart</h2>
                <p style={{ color: "#5a6270" }}>Your cart is empty.</p>
            </div>
        );
    }

    return (
        <div className="templar-main" style={{ padding: "2rem" }}>
            <h2>Cart</h2>

            <div style={{ marginTop: "1.5rem" }}>
                {lines.map(line => (
                    <div
                        key={line.listing.id}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem",
                            padding: "0.75rem 0",
                            borderBottom: "1px solid #2a2f38",
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <strong>{line.listing.title}</strong>
                            <div style={{ color: "#8a7a52", fontSize: ".8rem" }}>
                                {line.listing.price} THRONES each
                            </div>
                        </div>

                        <input
                            type="number"
                            min={1}
                            max={line.listing.stock}
                            value={line.quantity}
                            onChange={e =>
                                setQuantity(line.listing.id!, Number(e.target.value))
                            }
                            style={{ width: "4rem" }}
                        />

                        <div style={{ width: "6rem", textAlign: "right" }}>
                            {(line.listing.price ?? 0) * line.quantity} THRONES
                        </div>

                        <button onClick={() => removeFromCart(line.listing.id!)}>
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div
                style={{
                    marginTop: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                    Total: {total} THRONES
                </div>

                <button
                    onClick={checkout}
                    disabled={checkingOut}
                    style={{
                        padding: ".6rem 1.5rem",
                        background: "#8b1a1a",
                        color: "#e8d9b0",
                        border: "none",
                        fontWeight: "bold",
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                    }}
                >
                    {checkingOut ? "Processing..." : "Checkout"}
                </button>
            </div>

            {error && (
                <p style={{ color: "#e8544a", marginTop: "1rem" }}>{error}</p>
            )}
        </div>
    );
}