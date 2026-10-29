
import { useEffect, useState } from "react";

function Dashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Get the login token
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  });

  // Fetch products and orders from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsResponse, ordersResponse] = await Promise.all([
          fetch("http://localhost:5000/api/products", {
            headers: getAuthHeaders(),
          }),
          fetch("http://localhost:5000/api/orders", {
            headers: getAuthHeaders(),
          }),
        ]);

        const productsData = await productsResponse.json();
        const ordersData = await ordersResponse.json();

        if (!productsResponse.ok || !ordersResponse.ok) {
          setMessage("Unable to load dashboard data.");
          return;
        }

        setProducts(productsData.products || []);
        setOrders(ordersData.orders || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setMessage("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get today's date
  const today = new Date().toLocaleDateString();

  // Include completed orders only
  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  );

  // Calculate today's sales
  const todaysSales = completedOrders
    .filter(
      (order) => new Date(order.createdAt).toLocaleDateString() === today
    )
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  // Count products with low stock
  const lowStockItems = products.filter(
    (product) => Number(product.stock) <= 5
  ).length;

  const dashboardStats = [
    {
      title: "Total Products",
      value: products.length,
    },
    {
      title: "Today's Sales",
      value: `₱${todaysSales.toFixed(2)}`,
    },
    {
      title: "Completed Orders",
      value: completedOrders.length,
    },
    {
      title: "Low Stock Items",
      value: lowStockItems,
    },
  ];

  return (
    <div className="page">
      <h1>Welcome back, {user?.fullName || "User"}!</h1>

      <p>
        You are logged in as {user?.role || "Staff"}.
      </p>

      <p>Welcome to BlueSky Café Management System.</p>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : message ? (
        <p>{message}</p>
      ) : (
        <div className="dashboard-cards">
          {dashboardStats.map((stat) => (
            <div className="dashboard-card" key={stat.title}>
              <h3>{stat.title}</h3>
              <h2>{stat.value}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
