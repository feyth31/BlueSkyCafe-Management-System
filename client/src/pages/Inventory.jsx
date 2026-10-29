
import { useEffect, useState } from "react";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load inventory.");
        return;
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setMessage("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="page">
      <h1>Inventory Management</h1>
      <p>Monitor product stock and availability.</p>

      <div className="product-list-container">
        <h2>Current Inventory</h2>

        {loading ? (
          <p>Loading inventory...</p>
        ) : message ? (
          <p>{message}</p>
        ) : products.length === 0 ? (
          <p>No products found in inventory.</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Stock Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    {product.stock <= 5 ? (
                      <span className="low-stock">Low Stock</span>
                    ) : (
                      <span className="in-stock">In Stock</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Inventory;
