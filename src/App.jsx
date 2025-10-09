import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);

  return user ? <Dashboard /> : <Login setUser={setUser} />;
}

export default App;
