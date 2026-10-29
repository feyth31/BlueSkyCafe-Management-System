
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({ onLogout, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to log out?"
    );

    if (confirmLogout) {
      onLogout();
      navigate("/login");
    }
  };

  // Define which modules each role can access
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      roles: ["Staff", "Manager", "Administrator"],
    },
    {
      name: "Products",
      path: "/products",
      roles: ["Staff", "Manager", "Administrator"],
    },
    {
      name: "Inventory",
      path: "/inventory",
      roles: ["Staff", "Manager", "Administrator"],
    },
    {
      name: "Orders",
      path: "/orders",
      roles: ["Staff", "Manager", "Administrator"],
    },
    {
      name: "Order History",
      path: "/order-history",
      roles: ["Staff", "Manager", "Administrator"],
    },
    {
      name: "Sales",
      path: "/sales",
      roles: ["Manager", "Administrator"],
    },
    {
      name: "Reports",
      path: "/reports",
      roles: ["Manager", "Administrator"],
    },
    {
      name: "User Management",
      path: "/users",
      roles: ["Administrator"],
    },
  ];

  // Show only modules allowed for the current user
  const allowedMenuItems = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-user">
        <p>Logged in as:</p>
        <strong>{user?.fullName}</strong>
        <span>{user?.role}</span>
      </div>

      <nav>
        {allowedMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
