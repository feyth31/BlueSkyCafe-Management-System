
import { useEffect, useState } from "react";

function Orders() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Get JWT token saved during login
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  });

  // Load products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load products.");
        setProducts([]);
        return;
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Unable to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product to the order
  const addItem = () => {
    const product = products.find(
      (item) => item._id === selectedProduct
    );

    if (!product) {
      setMessage("Please select a product.");
      return;
    }

    if (quantity < 1 || quantity > product.stock) {
      setMessage("Invalid quantity or insufficient stock.");
      return;
    }

    const existingItem = orderItems.find(
      (item) => item._id === product._id
    );

    const totalQuantity = existingItem
      ? existingItem.quantity + Number(quantity)
      : Number(quantity);

    if (totalQuantity > product.stock) {
      setMessage("Not enough stock available.");
      return;
    }

    if (existingItem) {
      setOrderItems(
        orderItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: totalQuantity }
            : item
        )
      );
    } else {
      setOrderItems([
        ...orderItems,
        {
          _id: product._id,
          productName: product.productName,
          price: product.price,
          quantity: Number(quantity),
        },
      ]);
    }

    setSelectedProduct("");
    setQuantity(1);
    setMessage("Product added to order.");
  };

  // Remove item from the order
  const removeItem = (id) => {
    setOrderItems(orderItems.filter((item) => item._id !== id));
    setMessage("Item removed.");
  };

  // Calculate total
  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Save order to MongoDB
  const placeOrder = async () => {
    if (orderItems.length === 0) {
      setMessage("Please add products to the order.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          items: orderItems.map((item) => ({
            product: item._id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to place order.");
        return;
      }

      setMessage("Order placed successfully!");
      setOrderItems([]);
      setSelectedProduct("");
      setQuantity(1);

      // Refresh products to show updated stock
      await fetchProducts();
    } catch (error) {
      console.error("Error placing order:", error);
      setMessage("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Order Management</h1>
      <p>Create and manage café orders.</p>

      <div className="product-list-container">
        <h2>New Order</h2>

        <div className="form-group">
          <label>Select Product</label>

          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Choose a product</option>

            {products
              .filter((product) => product.stock > 0)
              .map((product) => (
                <option key={product._id} value={product._id}>
                  {product.productName} - ₱{product.price}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        <button className="add-button" onClick={addItem}>
          Add to Order
        </button>

        {message && <p>{message}</p>}
      </div>

      <div className="product-list-container">
        <h2>Order Items</h2>

        {orderItems.length === 0 ? (
          <p>No items added yet.</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orderItems.map((item) => (
                <tr key={item._id}>
                  <td>{item.productName}</td>
                  <td>₱{Number(item.price).toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => removeItem(item._id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2>Total: ₱{total.toFixed(2)}</h2>

        <button
          className="add-button"
          onClick={placeOrder}
          disabled={loading || orderItems.length === 0}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}

export default Orders;
