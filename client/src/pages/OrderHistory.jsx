
import { useEffect, useState } from "react";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Get JWT token saved during login
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  });

  // Fetch saved orders from MongoDB
  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load orders.");
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="page">
      <h1>Order History</h1>
      <p>View previously placed café orders.</p>

      <div className="product-list-container">
        <h2>Previous Orders</h2>

        {loading ? (
          <p>Loading orders...</p>
        ) : message ? (
          <p>{message}</p>
        ) : orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div className="order-history-card" key={order._id}>
              <div className="order-history-header">
                <div>
                  <strong>Order ID:</strong>{" "}
                  {order._id.slice(-6).toUpperCase()}
                </div>

                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              <table className="product-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.productName}</td>
                      <td>₱{Number(item.price).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>₱{Number(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="order-history-footer">
                <span>
                  Status: <strong>{order.status}</strong>
                </span>

                <strong>
                  Total: ₱{Number(order.totalAmount).toFixed(2)}
                </strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
