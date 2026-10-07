import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api-instance";
import { useCart, type CartLine } from "../CartContext";

function QuantityInput({ line }: { line: CartLine }) {
    const { setQuantity, removeFromCart } = useCart();
    // Local text so the field can be freely cleared while typing,
    // without the cart removing the line on every keystroke.
    const [text, setText] = useState(String(line.quantity));

    function commit() {
        const n = Number(text);
        if (text.trim() === "" || Number.isNaN(n) || n <= 0) {
            removeFromCart(line.listing.id!);
            return;
        }
        const max = line.listing.stock ?? n;
        const clamped = Math.min(n, max);
        setQuantity(line.listing.id!, clamped);
        setText(String(clamped));
    }

    return (
        <input
            type="number"
            min={0}
            max={line.listing.stock}
            value={text}
            onChange={e => setText(e.target.value)}
            onBlur={commit}
            onKeyDown={e => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
            style={{
                width: "4rem",
                background: "#0d0f12",
                border: "1px solid #2a2f38",
                color: "#e8d9b0",
                padding: ".3rem .5rem",
                textAlign: "center",
            }}
        />
    );
}

export default function CartPage() {
    const { lines, removeFromCart, clearCart, total } = useCart();
    const [error, setError] = useState<string | null>(null);
    const [checkingOut, setCheckingOut] = useState(false);
    const navigate = useNavigate();

    async function checkout() {
        setError(null);
        setCheckingOut(true);
        try {
            await api.api.orderCheckout({
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

                        <QuantityInput line={line} />

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