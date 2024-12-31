import React from 'react';
import { Link } from 'react-router-dom';
import './AdminNav.css';

const AdminNav = () => {
  return (
    <nav className="admin-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/admin-login">
          <img
            src={require('../../assets/lccb-logo.png')}
            alt="LCCB Logo"
            className="admin-logo"
          />
          <span className="navbar-title">LCCB Sanction System for Senior High School</span>
        </Link>
      </div>
    </nav>
  );
};

export default AdminNav;
