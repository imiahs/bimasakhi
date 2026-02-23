import React from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import { Outlet } from 'react-router-dom';
// Global Floating UI
import FloatingActions from '../ui/FloatingActions';
import LanguageToggle from '../ui/LanguageToggle';

const Layout = () => {
    return (
        <div className="app-container">

            {/* Top Navigation */}
            <Navbar />

            {/* Page Content */}
            <main className="main-content">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />

            {/* Global Floating UI Layer */}
            <FloatingActions />
            <LanguageToggle />

        </div>
    );
};

export default Layout;
