import { useEffect, useState } from "react";
import { api, type CategoryDto } from "../Api";

const empty: CategoryDto = {
    name: "",
    parentCategoryId: null,
    isActive: true,
    sortOrder: 0,
    isRestricted: false,
    minSoldOrders: null,
};

export default function CategoryPage() {
    const [categories, setCategories] = useState<CategoryDto[]>([]);
    const [form, setForm] = useState<CategoryDto>(empty);
    const [editId, setEditId] = useState<number | null>(null);

    function load() {
        api.api.categoryGetAll()
            .then(r => setCategories(r.data))
            .catch(err => console.error("Failed to load categories:", err));
    }

    useEffect(() => { load(); }, []);

    async function save() {
        if (!form.name?.trim()) return alert("Name required");

        console.log("Saving category with payload:", form);

        try {
            if (editId) {
                const res = await api.api.categoryUpdate(editId, form);
                console.log("Update response:", res);
            } else {
                const res = await api.api.categoryCreate(form);
                console.log("Create response:", res);
            }
            setForm(empty);
            setEditId(null);
            load();
        } catch (err: any) {
            // The generated client throws the parsed response body (not an Error object)
            // on non-2xx. Log everything so we can see what happened.
            console.error("CATEGORY SAVE FAILED");
            console.error("err:", err);
            console.error("err.status:", err?.status);
            console.error("err.data:", err?.data);
            console.error("err.message:", err?.message);

            const detail = err?.data
                ? JSON.stringify(err.data)
                : err?.status
                    ? `HTTP ${err.status}`
                    : String(err);
            alert("Save failed — " + detail);
        }
    }

    async function remove(id: number) {
        if (!confirm("Delete category?")) return;
        try {
            await api.api.categoryDelete(id);
            load();
        } catch (err: any) {
            console.error(err);
            alert(err.message || "Delete failed");
        }
    }

    async function toggleActive(cat: CategoryDto) {
        if (cat.id == null) return;
        try {
            await api.api.categorySetActive(cat.id, !cat.isActive);
            load();
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
            <h1>Categories</h1>

            <div style={{ marginBottom: "1rem" }}>
                <input
                    value={form.name ?? ""}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Category name"
                />
                <button onClick={save} style={{ marginLeft: "0.5rem" }}>
                    {editId ? "Update" : "Create"}
                </button>
            </div>

            <div>
                {categories.map(cat => (
                    <div
                        key={cat.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "1rem",
                            marginBottom: "0.8rem",
                            background: "#1a1a1a",
                            color: "#fbf0df",
                        }}
                    >
                        <h3>{cat.name}</h3>
                        <p>Status: {cat.isActive ? "Active" : "Hidden"}</p>
                        <button
                            onClick={() => {
                                setEditId(cat.id ?? null);
                                setForm({ ...empty, ...cat });
                            }}
                            style={{ marginRight: "0.5rem" }}
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => toggleActive(cat)}
                            style={{ marginRight: "0.5rem" }}
                        >
                            {cat.isActive ? "Hide" : "Activate"}
                        </button>
                        <button
                            onClick={() => cat.id != null && remove(cat.id)}
                            style={{ background: "#b00020", color: "white" }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}