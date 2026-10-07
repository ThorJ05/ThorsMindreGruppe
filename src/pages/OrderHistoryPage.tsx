import { useEffect, useState } from "react";
import { api } from "../api-instance";
import type { OrderDto } from "../Api";

export default function OrderHistoryPage() {
    const [orders, setOrders] = useState<OrderDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.api.orderGetAll()
            .then(res => setOrders(Array.isArray(res?.data) ? res.data : []))
            .catch(err => console.error("Failed to load orders:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p style={{ padding: "2rem" }}>Loading orders...</p>;

    return (
        <div className="templar-main" style={{ padding: "2rem" }}>
            <h2>Order History</h2>

            {orders.length === 0 && (
                <p style={{ color: "#5a6270" }}>No orders yet.</p>
            )}

            {orders.map(order => (
                <div
                    key={order.id}
                    style={{
                        border: "1px solid #2a2f38",
                        padding: "1rem",
                        marginBottom: "1rem",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <strong>Order #{order.id}</strong>
                        <span style={{ color: "#8a7a52" }}>
                            {order.createdAt && new Date(order.createdAt).toLocaleString()}
                        </span>
                    </div>

                    <div style={{ marginTop: ".5rem" }}>
                        Status:{" "}
                        <span
                            style={{
                                color: order.status === "Completed" ? "#4caf50" : "#e8d9b0",
                                fontWeight: "bold",
                            }}
                        >
                            {order.status}
                        </span>
                    </div>

                    <ul style={{ marginTop: ".5rem" }}>
                        {order.items?.map(item => (
                            <li key={item.id}>
                                {item.quantity} × {item.listingTitle} ({item.unitPrice} THRONES each)
                            </li>
                        ))}
                    </ul>

                    <div style={{ marginTop: ".5rem", fontWeight: "bold" }}>
                        Total: {order.total} THRONES
                    </div>
                </div>
            ))}
        </div>
    );
}