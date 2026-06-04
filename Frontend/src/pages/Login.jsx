import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const fd = new FormData(e.target);
    const email = (fd.get("email") || "").toString().trim();
    const password = (fd.get("password") || "").toString();

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const data = res.data;

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      setMessage("Signed in successfully.");
      setLoading(false);
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Network error";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <main className="login-design">
      <section className="login-shell">
        <div className="login-bot-mark" aria-hidden="true">
          <span />
        </div>

        <header className="login-heading">
          <h1>Welcome</h1>
          <p>Sign in to AI assistant</p>
        </header>

        <section className="login-panel">
          <form className="login-form" onSubmit={handleLoginSubmit}>
            <label className="login-field" htmlFor="login-email">
              <span>
                Email <i aria-hidden="true" />
              </span>
              <span className="login-input-wrap login-mail-icon">
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  autoComplete="email"
                />
              </span>
            </label>

            <label className="login-field" htmlFor="login-password">
              <span>
                Password <i aria-hidden="true" />
                <a href="#">Forgot?</a>
              </span>
              <span className="login-input-wrap login-lock-icon">
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  autoComplete="current-password"
                />
                <button className="login-eye" type="button" aria-label="Show password" />
              </span>
            </label>

            <button className="login-submit" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {error ? (
            <p className="form-note" style={{ color: "var(--color-accent)" }}>
              {error}
            </p>
          ) : message ? (
            <p className="form-note">{message}</p>
          ) : null}

          <div className="login-divider">
            <span />
            <strong>Or</strong>
            <span />
          </div>

          <div className="login-socials">
            <button className="login-social" type="button">
              <span className="login-google" aria-hidden="true">G</span>
              Google
            </button>
            <button className="login-social" type="button">
              <span className="login-apple" aria-hidden="true">●</span>
              Apple
            </button>
          </div>

          <p className="register-signin">
            New user? <Link to="/register">Create an account</Link>
          </p>
        </section>
      </section>
    </main>
  );
};

export default Login;
