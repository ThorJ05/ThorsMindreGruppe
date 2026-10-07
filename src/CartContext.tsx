import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { ListingDto } from "./Api";

export interface CartLine {
    listing: ListingDto;
    quantity: number;
}

interface CartContextValue {
    lines: CartLine[];
    addToCart: (listing: ListingDto, quantity?: number) => void;
    removeFromCart: (listingId: number) => void;
    setQuantity: (listingId: number, quantity: number) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "satinroad-cart";

export function CartProvider({ children }: { children: ReactNode }) {
    const [lines, setLines] = useState<CartLine[]>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
        } catch {
            // Ignore storage errors (e.g. private browsing).
        }
    }, [lines]);

    function addToCart(listing: ListingDto, quantity = 1) {
        setLines(prev => {
            const existing = prev.find(l => l.listing.id === listing.id);
            if (existing) {
                return prev.map(l =>
                    l.listing.id === listing.id
                        ? { ...l, quantity: l.quantity + quantity }
                        : l
                );
            }
            return [...prev, { listing, quantity }];
        });
    }

    function removeFromCart(listingId: number) {
        setLines(prev => prev.filter(l => l.listing.id !== listingId));
    }

    function setQuantity(listingId: number, quantity: number) {
        if (quantity <= 0) {
            removeFromCart(listingId);
            return;
        }
        setLines(prev =>
            prev.map(l => (l.listing.id === listingId ? { ...l, quantity } : l))
        );
    }

    function clearCart() {
        setLines([]);
    }

    const total = lines.reduce(
        (sum, l) => sum + (l.listing.price ?? 0) * l.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{ lines, addToCart, removeFromCart, setQuantity, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside a CartProvider");
    return ctx;
}