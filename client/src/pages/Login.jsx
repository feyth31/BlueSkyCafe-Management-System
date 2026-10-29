
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        sessionStorage.setItem("token", data.token);
        onLogin(data.user);
        navigate("/");
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Cannot connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Left Side - Login Form */}
        <section className="login-form-section">
          <div className="login-brand">
            <div className="brand-icon">☕</div>
            <h1>BlueSky Café</h1>
            <p>Café Management System</p>
          </div>

          <div className="login-heading">
            <h2>Welcome Back</h2>
            <p>Your coffee is almost ready!</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            <div className="login-input-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <div className="login-input-group">
              <label htmlFor="password">Password</label>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="forgot-password">
                <span>Forgot your password?</span>
              </div>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="login-divider">
            <span></span>
            <p>Welcome to BlueSky</p>
            <span></span>
          </div>

          <p className="login-footer">
            Fresh coffee. Fresh start.
          </p>
        </section>

        {/* Right Side - Café Logo */}
        <section className="login-art-section">
          <div className="cafe-art">

            <div className="art-top-label">
              <span>BLUESKY CAFÉ</span>
              <span>EST. 2026</span>
            </div>

            <div className="cafe-logo-display">
              <img
                src="/bluesky-logo.png"
                alt="BlueSky Café Logo"
                className="cafe-logo-image"
              />
            </div>

            <div className="art-caption">
              <p className="art-small-text">
                A little moment of comfort
              </p>

              <h2>
                Make yourself
                <br />
                at home.
              </h2>

              <p>
                Good coffee. Good moments.
                <br />
                Welcome to BlueSky Café.
              </p>
            </div>

            <div className="art-decoration decoration-one"></div>
            <div className="art-decoration decoration-two"></div>

          </div>
        </section>

      </div>
    </div>
  );
}

export default Login;
