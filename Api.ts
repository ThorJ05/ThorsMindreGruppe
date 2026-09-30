export class Api {
  private base = "http://localhost:5000/api";

  async categoryGetAll() {
    const res = await fetch(`${this.base}/category`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  }

  async categoryGetById(id: number) {
    const res = await fetch(`${this.base}/category/${id}`);
    if (!res.ok) throw new Error("Failed to fetch category");
    return res.json();
  }

  async categoryCreate(dto: any) {
    const res = await fetch(`${this.base}/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
  }

  async categoryUpdate(id: number, dto: any) {
    const res = await fetch(`${this.base}/category/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error("Failed to update category");
    return res.json();
  }

  async categorySetActive(id: number, isActive: boolean) {
    const res = await fetch(`${this.base}/category/${id}/active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(isActive),
    });
    if (!res.ok) throw new Error("Failed to set category active state");
  }

  async categoryDelete(id: number) {
    const res = await fetch(`${this.base}/category/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete category");
  }

  async listingGetAll() {
    const res = await fetch(`${this.base}/listing`);
    if (!res.ok) throw new Error("Failed to fetch listings");
    return res.json();
  }

  async listingGetById(id: number) {
    const res = await fetch(`${this.base}/listing/${id}`);
    if (!res.ok) throw new Error("Failed to fetch listing");
    return res.json();
  }

  async listingCreate(dto: any) {
    const res = await fetch(`${this.base}/listing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error("Failed to create listing");
    return res.json();
  }

  async listingUpdate(id: number, dto: any) {
    const res = await fetch(`${this.base}/listing/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error("Failed to update listing");
    return res.json();
  }

  async listingSetActive(id: number, active: boolean) {
    const res = await fetch(`${this.base}/listing/${id}/active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(active),
    });
    if (!res.ok) throw new Error("Failed to set listing active state");
  }

  async listingBulkUpdate(ids: number[], price?: number, stock?: number) {
    const res = await fetch(`${this.base}/listing/bulk`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, price, stock }),
    });
    if (!res.ok) throw new Error("Failed to bulk update listings");
  }
}
