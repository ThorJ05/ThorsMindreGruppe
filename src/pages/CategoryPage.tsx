import { useEffect, useState } from "react";
import { Api } from "../Api";

const api = new Api();

export default function CategoryPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState("");
    // editId = id being edited, or null when creating.
    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => { load(); }, []);

    // Ask server for the latest list.
    function load() {
        api.categoryGetAll().then(setCategories);
    }

    // Create or update depending on editId.
    async function save() {
        if (!name.trim()) return alert("Name required");

        if (editId) {
            await api.categoryUpdate(editId, { name });
            alert("Category updated");
        } else {
            await api.categoryCreate({ name });
            alert("Category created");
        }

        // Reset form and reload.
        setName("");
        setEditId(null);
        load();
    }

    // Confirm then delete.
    async function remove(id: number) {
        if (!confirm("Delete category?")) return;
        await api.categoryDelete(id);
        load();
    }

    // Flip the isActive flag.
    async function toggleActive(cat: any) {
        await api.categorySetActive(cat.id, !cat.isActive);
        load();
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
            <h1>Categories</h1>

            {/* Input + Create/Update button. */}
            <div style={{ marginBottom: "1rem" }}>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" />
                <button onClick={save} style={{ marginLeft: "0.5rem", padding: "0.4rem 1rem", background: "#fbf0df", color: "#1a1a1a", borderRadius: "6px", fontWeight: "bold" }}>
                    {editId ? "Update" : "Create"}
                </button>
            </div>

            {/* One card per category. */}
            <div>
                {categories.map(cat => (
                    <div key={cat.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", marginBottom: "0.8rem", background: "#1a1a1a", color: "#fbf0df" }}>
                        <h3>{cat.name}</h3>
                        <p>Status: {cat.isActive ? "Active" : "Hidden"}</p>

                        {/* Pre-fill the input and remember the id to edit. */}
                        <button onClick={() => { setEditId(cat.id); setName(cat.name); }} style={{ marginRight: "0.5rem" }}>
                            Edit
                        </button>

                        <button onClick={() => toggleActive(cat)} style={{ marginRight: "0.5rem" }}>
                            {cat.isActive ? "Hide" : "Activate"}
                        </button>

                        <button onClick={() => remove(cat.id)} style={{ background: "#b00020", color: "white" }}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}