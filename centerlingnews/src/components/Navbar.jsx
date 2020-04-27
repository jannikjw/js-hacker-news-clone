import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./Navbar.scss";


export default class Navbar extends Component {

  render() {
    return (
      <nav className="navbar">
        <div className="collpase navbar-collapse">
          <ul className="navbar-nav">
            <li className="navbar-item">
              <Link to="/" className="nav-link">Centerling News</Link>
            </li>
            <li className="navbar-item">
              <Link to="/posts" className="nav-link">Posts</Link>
            </li>
            <li className="navbar-item">
              <Link to="/submit" className="nav-link">Create Post</Link>
            </li>
            <li className="navbar-item">
              <Link to="/profile" className="nav-link">Profile</Link>
            </li>
            <li className="navbar-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
            <li className="navbar-item">
              <Link to="/register" className="nav-link">Sign Up</Link>
            </li>
            <li className="navbar-item">
              <Link to="/logout" className="nav-link">Logout</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}