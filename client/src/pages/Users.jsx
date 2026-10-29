
import { useEffect, useState } from "react";

function Users() {
  // Get the currently logged-in user
  const currentUser = JSON.parse(
  sessionStorage.getItem("loggedInUser") || "{}"
 );

  const isAdministrator = currentUser.role === "Administrator";

  const [users, setUsers] = useState([]);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Staff");

  const [editingId, setEditingId] = useState(null);
  const [editPassword, setEditPassword] = useState("");

  const API_URL = "http://localhost:5000/api/users";

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  });

  // Load users from MongoDB
  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data);
      } else {
        alert(data.message || "Failed to load users.");
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    // Only Administrators should load user accounts
    if (isAdministrator) {
      fetchUsers();
    }
  }, [isAdministrator]);

  // Add a new account
  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          fullName,
          username,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${role} account added successfully!`);

        setFullName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("Staff");

        fetchUsers();
      } else {
        alert(data.message || "Failed to add account.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Unable to connect to the server.");
    }
  };

  // Start editing an account
  const handleEdit = (user) => {
    setEditingId(user._id);
    setFullName(user.fullName);
    setUsername(user.username || "");
    setEmail(user.email || "");
    setRole(user.role);
    setEditPassword("");
  };

  // Save edited account
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = {
        fullName,
        username,
        email,
        role,
      };

      if (editPassword.trim() !== "") {
        updatedUser.password = editPassword;
      }

      const response = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`${role} account updated successfully!`);

        handleCancelEdit();
        fetchUsers();
      } else {
        alert(data.message || "Failed to update account.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Unable to connect to the server.");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setFullName("");
    setUsername("");
    setEmail("");
    setPassword("");
    setEditPassword("");
    setRole("Staff");
  };

  // Delete an account
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this account?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account deleted successfully!");
        fetchUsers();
      } else {
        alert(data.message || "Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Unable to connect to the server.");
    }
  };

  // Restrict the page to Administrators
      if (!isAdministrator) {
        return (
      <div className="page">
      <h1>Access Denied</h1>
      <p>You do not have permission to access User Management.</p>
    </div>
     );
  } 

  return (
    <div className="page-container">
      <h1>User Management</h1>
      <p>Manage staff accounts and their roles.</p>

      <div className="form-container">
        <h2>{editingId ? "Edit Account" : "Add Account"}</h2>

        <form onSubmit={editingId ? handleUpdateUser : handleAddUser}>
          <label>Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter full name"
            required
          />

          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            required
          />

          {!editingId && (
            <>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </>
          )}

          {editingId && (
            <>
              <label>New Password (Optional)</label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
              />
            </>
          )}

          <label>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Staff">Staff</option>
            <option value="Manager">Manager</option>
            <option value="Administrator">Administrator</option>
          </select>

          <button type="submit">
            {editingId ? "Save Changes" : `Add ${role}`}
          </button>

          {editingId && (
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="table-container">
        <h2>User Accounts</h2>

        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Username</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td>{user.fullName}</td>
                  <td>{user.username}</td>
                  <td>{user.email || "Not provided"}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>
                      Edit
                    </button>

                    <button onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No user accounts found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
