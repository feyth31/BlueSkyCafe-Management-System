
import { useEffect, useState } from "react";

function Sales() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Get the logged-in user's information
  const user = JSON.parse(
  sessionStorage.getItem("loggedInUser") || "{}"
);
  const role = user.role;

  // Only Managers and Administrators can access Sales
  const canAccessSales =
    role === "Manager" || role === "Administrator";

  useEffect(() => {
    // Do not fetch sales for Staff or other unauthorized roles
    if (!canAccessSales) {
      setLoading(false);
      return;
    }

    const fetchSales = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/orders/reports",
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Unable to load sales.");
          return;
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching sales:", error);
        setMessage("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [canAccessSales]);

  // Show Access Denied before rendering Sales Management
  if (!canAccessSales) {
    return (
      <div className="page">
        <h1>Access Denied</h1>
        <p>You do not have permission to access Sales Management.</p>
      </div>
    );
  }

  // Calculate total sales
  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  );

  const totalSales = completedOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  return (
    <div className="page">
      <h1>Sales Management</h1>
      <p>Monitor café sales and transactions.</p>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Sales</h3>
          <h2>₱{totalSales.toFixed(2)}</h2>
        </div>

        <div className="dashboard-card">
          <h3>Completed Orders</h3>
          <h2>{completedOrders.length}</h2>
        </div>
      </div>

      <div className="product-list-container">
        <h2>Sales Transactions</h2>

        {loading ? (
          <p>Loading sales...</p>
        ) : message ? (
          <p>{message}</p>
        ) : completedOrders.length === 0 ? (
          <p>No sales transactions found.</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date and Time</th>
                <th>Items</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {completedOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id.slice(-6).toUpperCase()}</td>

                  <td>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>

                  <td>
                    {order.items.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </td>

                  <td>₱{Number(order.totalAmount || 0).toFixed(2)}</td>

                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Sales;
