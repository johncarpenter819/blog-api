import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <nav className="navbar">
      <div className="logo">Level UP</div>
      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/posts">Posts</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
      <div className="nav-cta">
        {!user ? (
          <>
            <Link to="/login" className="login-button">
              <span>Login</span>
            </Link>
            <Link to="/signup" className="sign-up-button">
              <span>Sign Up</span>
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="logout-button">
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
