import { useEffect, useState } from "react";
import API from "../services/api";

export default function ProductList({ user }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Admin form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);

      // Collect categories dynamically
      const uniqueCategories = [...new Set(res.data.map((p) => p.category))].filter(Boolean);
      setCategories(uniqueCategories);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtered products for staff/admin
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // Admin: Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    let finalCategory = category;

    if (category === "add_new") {
      if (!newCategory.trim()) return alert("Please enter a new category");
      try {
        const res = await API.post("/categories", { name: newCategory.trim() });
        finalCategory = res.data.name;
        setCategories([...categories, res.data.name]);
        setNewCategory("");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to add category");
        return;
      }
    }

    if (!name || !price || !stock || !finalCategory) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/products", {
        name,
        price: Number(price),
        stock: Number(stock),
        category: finalCategory,
      });
      alert("✅ Product added successfully!");
      setName(""); setPrice(""); setStock(""); setCategory("");
      fetchProducts();
    } catch (err) {
      console.log("Add Product Error:", err.response?.data);
      alert(err.response?.data?.message || "❌ Failed to add product");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "20px auto" }}>
      <h2>🛍️ Products</h2>

      {/* Category Filter (both roles) */}
      <div style={{ marginBottom: "20px" }}>
        <label>Filter by Category: </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Admin only: Add Product Form */}
      {user?.role === "admin" && (
        <form
          onSubmit={handleAddProduct}
          style={{
            marginBottom: "20px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="add_new">➕ Add New Category</option>
          </select>

          {category === "add_new" && (
            <input
              type="text"
              placeholder="Enter new category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
          )}

          <button
            type="submit"
            style={{
              gridColumn: "span 2",
              padding: "8px",
              backgroundColor: "black",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Product
          </button>
        </form>
      )}

      {/* Product List */}
      <table
        border="1"
        cellPadding="10"
        cellSpacing="0"
        width="100%"
        style={{ borderCollapse: "collapse" }}
      >
        <thead style={{ background: "#f3f3f3" }}>
          <tr>
            {/* SKU visible only to admin */}
            {user?.role === "admin"}
            <th>Name</th>
            <th>Category</th>
            <th>Price (₹)</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p._id}>
              {user?.role === "admin"}
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
