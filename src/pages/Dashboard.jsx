import ProductList from "../components/ProductList";

export default function Dashboard({ user }) {
  return (
    <div>
      <h1>Welcome, {user?.name} ({user?.role})</h1>
      <ProductList user={user} />
    </div>
  );
}
