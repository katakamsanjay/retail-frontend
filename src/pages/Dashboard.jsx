import ProductList from "../components/ProductList";

export default function Dashboard({ user, setUser, handleLogout }) {
  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "20px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ color: "#222" }}>
          👋 Welcome, <span style={{ color: "#4A90E2" }}>{user?.name}</span>{" "}
          ({user?.role.toUpperCase()})
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
           Logout
        </button>
      </div>

      {/* Product Section */}
      <ProductList user={user} />

      {/* Optional Footer */}
      <footer
        style={{
          textAlign: "center",
          marginTop: "40px",
          color: "#777",
          fontSize: "14px",
        }}
      >
        © 2025 Retail Store Management System 🛒
      </footer>
    </div>
  );
}
