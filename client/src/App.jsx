
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import OrderHistory from "./pages/OrderHistory";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Login from "./pages/Login";

import "./App.css";

function ProtectedLayout({ user, onLogout, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar onLogout={onLogout} user={user} />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem("loggedInUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <Dashboard user={user} />
            </ProtectedLayout>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <Products />
            </ProtectedLayout>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <Inventory />
            </ProtectedLayout>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <Orders />
            </ProtectedLayout>
          }
        />

        <Route
          path="/order-history"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <OrderHistory />
            </ProtectedLayout>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <Sales />
            </ProtectedLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <Reports />
            </ProtectedLayout>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedLayout user={user} onLogout={handleLogout}>
              <Users />
            </ProtectedLayout>
          }
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
