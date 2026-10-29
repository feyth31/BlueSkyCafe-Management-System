
import { useEffect, useState } from "react";

function Reports() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Get the logged-in user's role
  const user = JSON.parse(
  sessionStorage.getItem("loggedInUser") || "{}"
 );
  const role = user.role;

  // Only Managers and Administrators can access Reports
  const canAccessReports =
    role === "Manager" || role === "Administrator";

  // Fetch reports only for authorized users
  useEffect(() => {
    if (!canAccessReports) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
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
          setMessage(data.message || "Unable to load reports.");
          return;
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setMessage("Could not connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [canAccessReports]);

  // Show Access Denied for Staff
  if (!canAccessReports) {
    return (
      <div className="page">
        <h1>Access Denied</h1>
        <p>You do not have permission to access Reports.</p>
      </div>
    );
  }

  // Include completed orders only
  const completedOrders = orders.filter(
    (order) => order.status === "Completed"
  );

  // Calculate total sales
  const totalSales = completedOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  // Calculate total items sold
  const totalItemsSold = completedOrders.reduce(
    (sum, order) =>
      sum +
      order.items.reduce(
        (itemSum, item) => itemSum + Number(item.quantity || 0),
        0
      ),
    0
  );

  // Summarize sales for each product
  const productSummary = {};

  completedOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSummary[item.productName]) {
        productSummary[item.productName] = {
          quantity: 0,
          revenue: 0,
        };
      }

      productSummary[item.productName].quantity += Number(item.quantity || 0);
      productSummary[item.productName].revenue += Number(item.subtotal || 0);
    });
  });

  const productReport = Object.entries(productSummary).sort(
    (a, b) => b[1].quantity - a[1].quantity
  );

  // Summarize sales by date
  const dailySummary = {};

  completedOrders.forEach((order) => {
    const date = new Date(order.createdAt).toLocaleDateString();

    if (!dailySummary[date]) {
      dailySummary[date] = {
        orders: 0,
        sales: 0,
      };
    }

    dailySummary[date].orders += 1;
    dailySummary[date].sales += Number(order.totalAmount || 0);
  });

  const dailyReport = Object.entries(dailySummary).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  );

  return (
    <div className="page">
      <h1>Reports</h1>
      <p>View café sales and product performance.</p>

      {loading ? (
        <p>Loading reports...</p>
      ) : message ? (
        <p>{message}</p>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h3>Total Sales</h3>
              <h2>₱{totalSales.toFixed(2)}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Completed Orders</h3>
              <h2>{completedOrders.length}</h2>
            </div>

            <div className="dashboard-card">
              <h3>Items Sold</h3>
              <h2>{totalItemsSold}</h2>
            </div>
          </div>

          <div className="product-list-container">
            <h2>Daily Sales Summary</h2>

            {dailyReport.length === 0 ? (
              <p>No sales data available.</p>
            ) : (
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Orders</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>

                <tbody>
                  {dailyReport.map(([date, data]) => (
                    <tr key={date}>
                      <td>{date}</td>
                      <td>{data.orders}</td>
                      <td>₱{data.sales.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="product-list-container">
            <h2>Sales by Product</h2>

            {productReport.length === 0 ? (
              <p>No product sales data available.</p>
            ) : (
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  {productReport.map(([name, data]) => (
                    <tr key={name}>
                      <td>{name}</td>
                      <td>{data.quantity}</td>
                      <td>₱{data.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;
