import { useEffect, useState } from "react";
import API from "../services/api";

export default function ProductList({ user }) {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product (admin only)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/products", { name, price: Number(price), stock: Number(stock) });
      alert("Product added successfully!");
      setName(""); setPrice(""); setStock("");
      fetchProducts();
    } catch (err) {
      console.log("Add Product Error:", err.response ? err.response.data : err);
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Products</h2>

      {/* Admin only: Add Product Form */}
      {user?.role === "admin" && (
        <form onSubmit={handleAddProduct} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Name"
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
          <button type="submit">Add Product</button>
        </form>
      )}

      {/* Product List */}
      <table border="1" cellPadding="10" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
