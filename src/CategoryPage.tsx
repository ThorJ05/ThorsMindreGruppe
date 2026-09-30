import { useEffect, useState } from "react";
import { Api } from "../Api";

const api = new Api();

export default function CategoryPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => {
        load();
    }, []);

    function load() {
        api.categoryGetAll().then(setCategories);
    }

    async function save() {
        if (!name.trim()) return alert("Name required");

        if (editId) {
            await api.categoryUpdate(editId, { name });
            alert("Category updated");
        } else {
            await api.categoryCreate({ name });
            alert("Category created");
        }

        setName("");
        setEditId(null);
        load();
    }

    async function remove(id: number) {
        if (!confirm("Delete category?")) return;
        await api.categoryDelete(id);
        load();
    }

    async function toggleActive(cat: any) {
        await api.categorySetActive(cat.id, !cat.isActive);
        load();
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
            <h1>Categories</h1>

            <div style={{ marginBottom: "1rem" }}>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Category name"
                />
                <button
                    onClick={save}
                    style={{
                        marginLeft: "0.5rem",
                        padding: "0.4rem 1rem",
                        background: "#fbf0df",
                        color: "#1a1a1a",
                        borderRadius: "6px",
                        fontWeight: "bold"
                    }}
                >
                    {editId ? "Update" : "Create"}
                </button>
            </div>

            <div>
                {categories.map(cat => (
                    <div key={cat.id} style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "1rem",
                        marginBottom: "0.8rem",
                        background: "#1a1a1a",
                        color: "#fbf0df"
                    }}>
                        <h3>{cat.name}</h3>

                        <p>Status: {cat.isActive ? "Active" : "Hidden"}</p>

                        <button
                            onClick={() => {
                                setEditId(cat.id);
                                setName(cat.name);
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
                            onClick={() => remove(cat.id)}
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
