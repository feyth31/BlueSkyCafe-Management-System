
import { useEffect, useState } from "react";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [message, setMessage] = useState("");

  // Get the JWT token saved during login
  const getAuthHeaders = () => ({
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  });

  // GET: Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products", {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load products.");
        setProducts([]);
        return;
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // POST: Add a product
  const handleAddProduct = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          productName,
          category,
          price: Number(price),
          stock: Number(stock),
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to add product.");
        return;
      }

      setMessage("Product added successfully!");

      setProductName("");
      setCategory("");
      setPrice("");
      setStock("");
      setDescription("");

      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("Unable to connect to the server.");
    }
  };

  // DELETE: Remove a product
  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete product.");
        return;
      }

      setMessage("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setMessage("Unable to connect to the server.");
    }
  };

  return (
    <div className="page">
      <h1>Product Management</h1>
      <p>Manage café products, categories, and prices.</p>

      <div className="product-form-container">
        <h2>Add New Product</h2>

        <form onSubmit={handleAddProduct} className="product-form">
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(event) => setProductName(event.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            >
              <option value="">Select category</option>
              <option value="Coffee">Coffee</option>
              <option value="Non-Coffee">Non-Coffee</option>
              <option value="Pastry">Pastry</option>
              <option value="Food">Food</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price (₱)</label>
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Enter price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              placeholder="Enter stock quantity"
              min="0"
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Enter product description"
              rows="3"
            />
          </div>

          <button type="submit" className="add-product-btn">
            Add Product
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>

      <div className="product-list-container">
        <h2>Product List</h2>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.productName}</td>
                  <td>{product.category}</td>
                  <td>₱{Number(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      Delete
                    </button>
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

export default Products;
