import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <header className="site-header">
            <div className="container">
                <Link to="/" className="brand-logo">
                    <img src="/images/home/logo.png" alt="Bima Sakhi Logo" />
                    Bima Sakhi
                </Link>
                {/* Future Navigation Links can go here */}
                {/* <nav>
                    <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>About</NavLink>
                </nav> */}
            </div>
        </header>
    );
};

export default Navbar;
