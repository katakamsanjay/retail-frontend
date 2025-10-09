import { useState, useEffect } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async () => {
    try {
      await API.post("/products", { name, price, sku: Date.now().toString(), quantity: 10 });
      fetchProducts();
      setName(""); setPrice("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add product");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto" }}>
      <h2>Dashboard</h2>

      <div>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <button onClick={addProduct}>Add Product</button>
      </div>

      <h3>Products:</h3>
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.name} - ${p.price} - Qty: {p.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
