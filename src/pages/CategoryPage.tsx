import { useEffect, useState } from "react";
import { Api, CategoryDto } from "../Api";

const api = new Api();

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

    // Category we're trying to delete that needs its listings moved first.
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const [pendingDeleteError, setPendingDeleteError] = useState<string | null>(null);
    const [moveToId, setMoveToId] = useState<number | "">("");

    useEffect(() => {
        load();
    }, []);

    function load() {
        api.api.categoryGetAll().then(res => setCategories(res.data));
    }

    async function save() {
        if (!form.name?.trim()) return alert("Name required");

        if (editId) {
            await api.api.categoryUpdate(editId, form);
        } else {
            await api.api.categoryCreate(form);
        }

        setForm(empty);
        setEditId(null);
        load();
    }

    function startEdit(c: CategoryDto) {
        setEditId(c.id!);
        setForm(c);
    }

    async function toggleActive(c: CategoryDto) {
        await api.api.categorySetActive(c.id!, !c.isActive);
        load();
    }

    async function toggleRestricted(c: CategoryDto) {
        await api.api.categorySetRestricted(c.id!, !c.isRestricted);
        load();
    }

    async function remove(id: number) {
        if (!confirm("Delete this category?")) return;
        try {
            await api.api.categoryDelete(id);
            load();
        } catch (err: any) {
            // Delete was blocked because it still has listings — ask which
            // category to move them into instead of a raw prompt().
            setPendingDeleteError(err?.error ?? "This category still has listings.");
            setPendingDeleteId(id);
            setMoveToId("");
        }
    }

    async function confirmMoveAndDelete() {
        if (!moveToId) return alert("Choose a category to move the listings into");
        await api.api.categoryDelete(pendingDeleteId!, { moveListingsToCategoryId: Number(moveToId) });
        setPendingDeleteId(null);
        setPendingDeleteError(null);
        load();
    }

    function cancelPendingDelete() {
        setPendingDeleteId(null);
        setPendingDeleteError(null);
    }

    const pendingDeleteCategory = categories.find(c => c.id === pendingDeleteId);
    const moveTargets = categories.filter(c => c.id !== pendingDeleteId);

    return (
        <div style={{ padding: "2rem", maxWidth: "650px", margin: "auto" }}>
            <h1>Categories</h1>

            <div className="bt-panel" style={{ marginBottom: "2rem" }}>
                <h3>{editId ? "Edit category" : "New category"}</h3>

                <label>Name</label>
                <input
                    className="bt-input"
                    style={{ width: "100%", marginBottom: "0.75rem" }}
                    value={form.name ?? ""}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                />

                <label>Sort order</label>
                <input
                    className="bt-input"
                    style={{ width: "100%", marginBottom: "0.75rem" }}
                    type="text"
                    inputMode="numeric"
                    value={form.sortOrder ?? 0}
                    onFocus={e => e.target.select()}
                    onChange={e => {
                        if (!/^\d*$/.test(e.target.value)) return;
                        setForm({ ...form, sortOrder: e.target.value ? Number(e.target.value) : 0 });
                    }}
                />

                <label>
                    <input
                        type="checkbox"
                        checked={form.isRestricted ?? false}
                        onChange={e => setForm({ ...form, isRestricted: e.target.checked })}
                    />{" "}
                    Restricted category
                </label>

                {form.isRestricted && (
                    <div style={{ marginTop: "0.5rem" }}>
                        <label>Minimum sold orders required</label>
                        <input
                            className="bt-input"
                            style={{ width: "100%" }}
                            type="text"
                            inputMode="numeric"
                            value={form.minSoldOrders ?? ""}
                            onFocus={e => e.target.select()}
                            onChange={e => {
                                if (!/^\d*$/.test(e.target.value)) return;
                                setForm({
                                    ...form,
                                    minSoldOrders: e.target.value ? Number(e.target.value) : null,
                                });
                            }}
                        />
                    </div>
                )}

                <div style={{ marginTop: "1rem" }}>
                    <button className="bt-btn" onClick={save}>
                        {editId ? "Save" : "Create"}
                    </button>
                    {editId && (
                        <button
                            className="bt-btn"
                            style={{ marginLeft: "0.5rem" }}
                            onClick={() => {
                                setForm(empty);
                                setEditId(null);
                            }}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>

            {/* Inline panel shown only while a blocked delete needs a target category */}
            {pendingDeleteId !== null && (
                <div className="bt-panel" style={{ marginBottom: "2rem", borderColor: "var(--blood)" }}>
                    <h3>Move listings before deleting</h3>
                    <p>
                        {pendingDeleteError} Choose a category to move
                        {pendingDeleteCategory ? ` "${pendingDeleteCategory.name}"'s` : ""} listings into.
                    </p>

                    <select
                        className="bt-select"
                        style={{ width: "100%", marginBottom: "1rem" }}
                        value={moveToId}
                        onChange={e => setMoveToId(e.target.value ? Number(e.target.value) : "")}
                    >
                        <option value="">Select a category</option>
                        {moveTargets.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <button className="bt-btn danger" onClick={confirmMoveAndDelete}>
                        Move listings and delete
                    </button>
                    <button className="bt-btn" style={{ marginLeft: "0.5rem" }} onClick={cancelPendingDelete}>
                        Cancel
                    </button>
                </div>
            )}

            {categories.map(cat => (
                <div key={cat.id} className="bt-relic" style={{ marginBottom: "0.8rem" }}>
                    <div className="relic-name">{cat.name}</div>
                    <div className="relic-meta">
                        {cat.isActive ? "Active" : "Hidden"}
                        {cat.isRestricted && " · Restricted"}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <button className="bt-btn" onClick={() => startEdit(cat)}>
                            Edit
                        </button>
                        <button className="bt-btn" onClick={() => toggleActive(cat)}>
                            {cat.isActive ? "Hide" : "Activate"}
                        </button>
                        <button className="bt-btn" onClick={() => toggleRestricted(cat)}>
                            {cat.isRestricted ? "Unrestrict" : "Restrict"}
                        </button>
                        <button className="bt-btn danger" onClick={() => remove(cat.id!)}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}