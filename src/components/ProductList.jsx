import { useEffect, useState } from "react";
import API from "../services/api";

export default function ProductList({ user }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  // Admin form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");

  // Orders state for admin
  const [orders, setOrders] = useState([]);
  const [filterUser, setFilterUser] = useState("");

  // Staff: Bill modal states
  const [showBill, setShowBill] = useState(false);
  const [cashReceived, setCashReceived] = useState("");

  // --- Fetch products ---
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
      const uniqueCategories = [
        ...new Set(res.data.map((p) => p.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
    if (user?.role === "admin") fetchOrders();
  }, []);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  // --- Admin Add Product ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    let finalCategory = category;
    if (category === "add_new") {
      if (!newCategory.trim()) return alert("Please enter a new category");
      try {
        const res = await API.post("/categories", { name: newCategory.trim() });
        finalCategory = res.data.name;
        setCategories([...categories, res.data.name]);
      } catch (err) {
        alert(err.response?.data?.message || "Failed to add category");
        return;
      }
    }

    try {
      await API.post("/products", {
        name,
        price: Number(price),
        stock: Number(stock),
        category: finalCategory,
      });
      alert("✅ Product added successfully!");
      setName("");
      setPrice("");
      setStock("");
      setCategory("");
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to add product");
    }
  };

  // --- Admin Edit/Update/Delete ---
  const handleEditProduct = (product) => setEditingProduct(product);

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/${editingProduct._id}`, editingProduct);
      alert("✅ Product updated successfully!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      alert("🗑️ Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to delete product");
    }
  };

  // --- Staff: Cart ---
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i._id !== id));

  const clearCart = () => {
    if (window.confirm("Clear all items from cart?")) setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // --- Staff: Handle Confirm Order ---
  const handleConfirmOrder = async () => {
    const cash = Number(cashReceived);
    if (cash < total) return alert("Received cash is less than total!");
    try {
      const res = await API.post("/orders", {
        items: cart.map((item) => ({
          name: item.name,
          price: item.price,
          qty: item.qty,
        })),
        total,
        user: user?.name || "staff",
        cashReceived: cash,
      });
      alert(`✅ Order placed! Change to return: ₹${res.data.change}`);
      setCart([]);
      setCashReceived("");
      setShowBill(false);
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to place order");
    }
  };

  // --- Admin: Fetch Orders ---
  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders", {
        params: filterUser ? { user: filterUser } : {},
      });
      setOrders(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch orders");
    }
  };

  const filteredOrders = orders;

  return (
    <div
      style={{
        maxWidth: "950px",
        margin: "20px auto",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center" }}>🛍️ Product Management</h2>

      {/* Category Filter */}
      <div style={{ marginBottom: "16px" }}>
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

      {/* Admin Add Product Form */}
      {user?.role === "admin" && !editingProduct && (
        <form
          onSubmit={handleAddProduct}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <input
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
              background: "black",
              color: "white",
              padding: "8px",
              borderRadius: "5px",
            }}
          >
            Add Product
          </button>
        </form>
      )}

      {/* Edit Form */}
      {editingProduct && (
        <form
          onSubmit={handleUpdateProduct}
          style={{
            background: "#f3f3f3",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          <h3>✏️ Edit Product</h3>
          <input
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            placeholder="Name"
            required
          />
          <input
            type="number"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                price: Number(e.target.value),
              })
            }
            placeholder="Price"
            required
          />
          <input
            type="number"
            value={editingProduct.stock}
            onChange={(e) =>
              setEditingProduct({
                ...editingProduct,
                stock: Number(e.target.value),
              })
            }
            placeholder="Stock"
            required
          />
          <select
            value={editingProduct.category}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, category: e.target.value })
            }
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div style={{ marginTop: "10px" }}>
            <button
              type="submit"
              style={{
                background: "green",
                color: "white",
                padding: "6px 12px",
                borderRadius: "4px",
                marginRight: "8px",
              }}
            >
              💾 Save
            </button>
            <button
              type="button"
              onClick={() => handleDeleteProduct(editingProduct._id)}
              style={{
                background: "red",
                color: "white",
                padding: "6px 12px",
                borderRadius: "4px",
              }}
            >
              🗑️ Delete
            </button>
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Product Table */}
      <table
        border="1"
        cellPadding="10"
        width="100%"
        style={{ borderCollapse: "collapse" }}
      >
        <thead style={{ background: "#eee" }}>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price (₹)</th>
            <th>Stock</th>
            {user?.role === "admin" && <th>Actions</th>}
            {user?.role === "staff" && <th>Add to Cart</th>}
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              {user?.role === "admin" && (
                <td>
                  <button
                    onClick={() => handleEditProduct(p)}
                    style={{
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                    }}
                  >
                    ✏️ Edit
                  </button>
                </td>
              )}
              {user?.role === "staff" && (
                <td>
                  <button
                    onClick={() => addToCart(p)}
                    style={{
                      background: "#28a745",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "5px 10px",
                    }}
                  >
                    🛒 Add
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🧾 Cart Section for Staff */}
      {user?.role === "staff" && (
        <div
          style={{
            marginTop: "25px",
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        >
          <h3>🛒 Cart Summary</h3>
          {cart.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <div>
              <table width="100%" cellPadding="8">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.price}</td>
                      <td>₹{item.price * item.qty}</td>
                      <td>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          style={{
                            background: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            padding: "3px 6px",
                          }}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <h4 style={{ textAlign: "right", marginTop: "10px" }}>
                Total: ₹{total}
              </h4>
              <div style={{ textAlign: "right", marginTop: "10px" }}>
                <button
                  onClick={clearCart}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    marginRight: "10px",
                  }}
                >
                  🧹 Clear
                </button>
                <button
                  onClick={() => setShowBill(true)}
                  style={{
                    background: "#007bff",
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "4px",
                  }}
                >
                  ✅ Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🧾 Bill Modal */}
      {showBill && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h3>🧾 Bill Summary</h3>
            <table width="100%" cellPadding="6">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.qty}</td>
                    <td>₹{item.price}</td>
                    <td>₹{item.price * item.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h4>Total: ₹{total}</h4>
            <div>
              <label>Cash Received: </label>
              <input
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                style={{ width: "100%", padding: "6px", marginTop: "5px" }}
              />
            </div>
            {cashReceived && Number(cashReceived) >= total && (
              <p>Change to return: ₹{Number(cashReceived) - total}</p>
            )}
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button
                onClick={handleConfirmOrder}
                style={{
                  background: "green",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              >
                ✅ Confirm
              </button>
              <button
                onClick={() => setShowBill(false)}
                style={{ padding: "6px 12px", borderRadius: "4px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Admin Orders Section --- */}
      {user?.role === "admin" && (
        <div style={{ marginTop: "40px" }}>
          <h3>📦 Orders</h3>
          <div style={{ marginBottom: "10px" }}>
            <label>Filter by Staff: </label>
            <input
              type="text"
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              placeholder="Enter staff name"
            />
            <button onClick={fetchOrders} style={{ marginLeft: "8px" }}>
              Filter
            </button>
          </div>
          <table
            width="100%"
            cellPadding="6"
            border="1"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Staff</th>
                <th>Items</th>
                <th>Total</th>
                <th>Cash Received</th>
                <th>Change</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o._id}>
                  <td>{o.user}</td>
                  <td>{o.items.map((i) => `${i.name} x${i.qty}`).join(", ")}</td>
                  <td>₹{o.total}</td>
                  <td>₹{o.cashReceived}</td>
                  <td>₹{o.change}</td>
                  <td>{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
