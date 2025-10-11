import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import API from "../services/api";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // <-- initialize navigate

  // Helper to get token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.get("/products", { headers: getAuthHeaders() });
      setProducts(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add new product
  const addProduct = async () => {
    if (!name || !price) return alert("Please enter name and price");

    setLoading(true);
    setError("");
    try {
      await API.post(
        "/products",
        { name, price, sku: Date.now().toString(), quantity: 10 },
        { headers: getAuthHeaders() }
      );
      setName("");
      setPrice("");
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove token
    navigate("/"); // redirect to login
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", textAlign: "center" }}>
      <h2>Dashboard</h2>

      {/* Logout button */}
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Add Product */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={addProduct} disabled={loading}>
          {loading ? "Processing..." : "Add Product"}
        </button>
      </div>

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Products list */}
      <h3>Products:</h3>
      {loading && <p>Loading products...</p>}
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {products.map((p) => (
          <li key={p._id} style={{ marginBottom: "10px" }}>
            {p.name} - ${p.price} - Qty: {p.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}
