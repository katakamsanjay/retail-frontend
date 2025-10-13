import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setUser={setUser} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
