import React, { useEffect, useState } from "react";
import SEOHead from "../components/core/SEOHead";
import { getWhatsAppUrl } from "../utils/whatsapp";
import "../styles/Contact.css";

const Contact = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: Connect to backend later
        alert("Thank you. We will get back to you shortly.");
    };

    const whatsappUrl = getWhatsAppUrl({
        intent: "General Interest",
        category: "Contact Page Inquiry",
        source: "Contact Page"
    });

    return (
        <div className="contact-container">

            <SEOHead
                title="Contact Bima Sakhi | Raj Kumar Development Officer"
                description="Get in touch with Bima Sakhi for LIC agency guidance, office visits, or structured onboarding support."
                path="/contact"
            />

            {/* HERO */}
            <section className="contact-hero">
                <h1>Contact & Office Information</h1>
                <p>
                    Whether you need career guidance, exam support, or onboarding clarity —
                    we are here to assist you.
                </p>
            </section>

            {/* CONTACT OPTIONS */}
            <section className="contact-options">

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-card"
                >
                    💬 Connect on WhatsApp
                </a>

                <div className="contact-card">
                    📍 Visit Office (Working Hours: 10 AM – 5:30 PM)
                </div>

                <div className="contact-card">
                    🌐 Digital Support – 24/7
                </div>

            </section>

            {/* CONTACT FORM */}
            <section className="contact-form-section">
                <h2>Send a Message</h2>

                <form onSubmit={handleSubmit} className="contact-form">

                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <textarea
                        name="message"
                        placeholder="Your Message"
                        required
                        rows="5"
                        value={formData.message}
                        onChange={handleChange}
                    />

                    <button type="submit">
                        Submit Message
                    </button>

                </form>
            </section>

            {/* OFFICES */}
            <section className="office-section">
                <h2>Our Locations</h2>

                <div className="office-grid">

                    <div className="office-card">
                        <h3>Bima Sakhi Office</h3>
                        <p>Delhi NCR</p>
                        <a
                            href="https://maps.app.goo.gl/T5Sb4a6962Xkiya8A"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on Google Maps
                        </a>
                    </div>

                    <div className="office-card">
                        <h3>Branch Office</h3>
                        <p>Delhi NCR</p>
                        <a
                            href="https://maps.app.goo.gl/NtTeB6VSMcUFFH3G9"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View on Google Maps
                        </a>
                    </div>

                </div>

            </section>

        </div>
    );
};

export default Contact;