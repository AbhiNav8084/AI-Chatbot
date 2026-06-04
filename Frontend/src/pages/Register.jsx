import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const fd = new FormData(e.target);
    const firstname = (fd.get("firstname") || "").toString().trim();
    const lastname = (fd.get("lastname") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const password = (fd.get("password") || "").toString();
    const terms = !!fd.get("terms");

    if (!firstname || !email || !password) {
      setError("Please fill the required fields.");
      setLoading(false);
      return;
    }

    if (!terms) {
      setError("Please accept the Terms & Conditions.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          fullName: { firstName: firstname, lastName: lastname },
          email,
          password,
        },
        { withCredentials: true }
      );

      const data = res.data;

      setMessage(data?.message || "Account created. Redirecting...");
      setLoading(false);
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Network error";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <main className="register-design">
      <section className="register-panel">
        <div className="register-mobile-brand" aria-hidden="true">
          <span className="register-red-dot" />
          <span className="register-bot-mark">
            <span />
          </span>
        </div>

        <header className="register-heading">
          <h1>
            Create Account
            <span className="register-title-dot" aria-hidden="true" />
          </h1>
          <p>Join to start conversing with AI.</p>
        </header>

        <form className="register-form" onSubmit={handleRegisterSubmit}>
          <div className="register-row">
            <label className="register-field" htmlFor="register-firstname">
              <span>First Name</span>
              <span className="register-input-wrap register-user-icon">
                <input
                  id="register-firstname"
                  name="firstname"
                  type="text"
                  placeholder="First"
                  autoComplete="given-name"
                />
              </span>
            </label>

            <label className="register-field" htmlFor="register-lastname">
              <span>Last Name</span>
              <span className="register-input-wrap register-user-icon">
                <input
                  id="register-lastname"
                  name="lastname"
                  type="text"
                  placeholder="name"
                  autoComplete="family-name"
                />
              </span>
            </label>
          </div>

          <label className="register-field" htmlFor="register-email">
            <span>Email Address</span>
            <span className="register-input-wrap register-mail-icon">
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="name@domain.com"
                autoComplete="email"
              />
            </span>
          </label>

          <label className="register-field" htmlFor="register-password">
            <span>Create Password</span>
            <span className="register-input-wrap register-lock-icon">
              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="........"
                autoComplete="new-password"
              />
            </span>
          </label>

          <label className="register-terms" htmlFor="register-terms">
            <input id="register-terms" name="terms" type="checkbox" />
            <span>
              I agree to the <a href="#">Terms & Conditions</a>
            </span>
          </label>

          <button className="register-submit" type="submit" disabled={loading}>
            {loading ? "Creating..." : (
              <>
                Create Account <span aria-hidden="true">-&gt;</span>
              </>
            )}
          </button>
        </form>

        {error ? (
          <p className="form-note" style={{ color: "var(--color-accent)" }}>{error}</p>
        ) : message ? (
          <p className="form-note">{message}</p>
        ) : null}

        <div className="register-divider">
          <span />
          <strong>Or</strong>
          <span />
        </div>

        <div className="register-socials">
          <button className="register-social" type="button">
            <span className="register-google" aria-hidden="true">G</span>
            Continue with Google
          </button>
          <button className="register-social" type="button">
            <span className="register-apple" aria-hidden="true" />
            Continue with Apple
          </button>
        </div>

        <p className="register-signin">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </section>
    </main>
  );
};

export default Register;
