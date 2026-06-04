import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="page-shell home-page">
      <section className="home-content">
        <p className="eyebrow">Dashboard placeholder</p>
        <h1>Home</h1>
        <p>
          This page is ready for your main product content, navigation, and user
          dashboard modules.
        </p>
        <div className="home-actions">
          <Link className="primary-button" to="/login">
            Login
          </Link>
          <Link className="secondary-button" to="/register">
            Register
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
