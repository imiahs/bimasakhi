import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { ConfigContext } from '../../context/ConfigContext';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const ApplyForm = () => {
    const { userState, markSubmitted } = useContext(UserContext);
    const { config } = useContext(ConfigContext);

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        city: '',
        occupation: '',
        reason: ''
    });

    const [status, setStatus] = useState({
        isSubmitting: false,
        success: false,
        error: null,
        leadId: null
    });

    const [errors, setErrors] = useState({});

    // 1. Pause Logic
    if (config.isAppPaused) {
        return <div className="alert-box">Applications are currently paused. Please check back later.</div>;
    }

    // 2. Already Submitted (Persisted State)
    if (userState.hasSubmitted && !status.success) {
        // If they refresh, show simple message. 
        // Strategy: If local storage says submitted, we trust it to avoid double leads.
        return <div className="alert-box success">
            You have already submitted your application.
            If you missed the chat, <a href={getWhatsAppUrl({ ...userState.lastLeadData })} target="_blank" rel="noreferrer">click here</a>.
        </div>;
    }

    const validate = () => {
        let tempErrors = {};
        if (!formData.name) tempErrors.name = "Name is required";
        if (!formData.mobile || !/^\d{10}$/.test(formData.mobile)) tempErrors.mobile = "Valid 10-digit mobile number required";
        if (!formData.city) tempErrors.city = "City selection is required";
        if (!formData.occupation) tempErrors.occupation = "Occupation is required";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when typing
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ isSubmitting: false, success: false, error: null, leadId: null });

        if (!validate()) return;

        setStatus(prev => ({ ...prev, isSubmitting: true }));

        const payload = {
            ...formData,
            source: userState.source || 'Website',
            medium: userState.medium || 'Direct', // Ensure context provides this or defaults
            campaign: userState.campaign || 'Bima Sakhi',
            visitedPages: userState.visitedPages
        };

        try {
            // 3. SAFE ARCHITECTURE: Create Lead in Backend FIRST
            // We use the new API endpoint
            const response = await axios.post('/api/create-lead', payload);

            if (response.data.success) {
                // 4. Success Handling
                const leadId = response.data.lead_id;

                // Update Context
                markSubmitted(formData.city, payload); // Ensure markSubmitted stores payload for recovery

                // Data Layer for Ads (Conversion)
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: 'form_submit',
                    lead_id: leadId,
                    city: formData.city,
                    source: payload.source
                });

                setStatus({
                    isSubmitting: false,
                    success: true,
                    error: null,
                    leadId: leadId
                });

            } else {
                throw new Error("Server refused lead creation.");
            }

        } catch (error) {
            console.error("Lead Creation Failed", error);
            setStatus({
                isSubmitting: false,
                success: false,
                error: "There was an issue submitting your application. Please check your internet or try again.",
                leadId: null
            });
        }
    };

    const handleWhatsAppClick = () => {
        // Safe user-initiated click
        const waUrl = getWhatsAppUrl({
            ...formData,
            source: userState.source
        });

        // Track Click
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'whatsapp_click',
            lead_id: status.leadId
        });

        window.open(waUrl, '_blank');
    };

    const cities = [
        { value: 'Delhi', label: 'Delhi' },
        { value: 'Noida', label: 'Noida' },
        { value: 'Gurugram', label: 'Gurugram' },
        { value: 'Ghaziabad', label: 'Ghaziabad' },
        { value: 'Faridabad', label: 'Faridabad' }
    ];

    // 5. Success UI
    if (status.success) {
        return (
            <div className="apply-success-card">
                <div className="success-icon">✅</div>
                <h2>Application Received!</h2>
                <p>Your Reference ID: {status.leadId}</p>
                <p>Please click the button below to start your interview chat on WhatsApp.</p>

                <button
                    onClick={handleWhatsAppClick}
                    className="btn btn-whatsapp btn-block animate-pulse"
                >
                    Chat on WhatsApp (Start Interview)
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="apply-form" id="application-form">
            {status.error && <div className="error-banner">{status.error}</div>}

            <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
            />

            <Input
                label="Mobile Number"
                name="mobile"
                type="tel"
                maxLength="10"
                value={formData.mobile}
                onChange={handleChange}
                error={errors.mobile}
                placeholder="10 digit number"
            />

            <Select
                label="City (Delhi NCR Only)"
                name="city"
                value={formData.city}
                onChange={handleChange}
                options={cities}
                error={errors.city}
            />
            {config.delhiOnlyMessage && <p className="form-note">{config.delhiOnlyMessage}</p>}

            <Select
                label="Current Occupation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                options={[
                    { value: 'Housewife', label: 'Housewife / Homemaker' },
                    { value: 'Student', label: 'Student' },
                    { value: 'Working Professional', label: 'Working Professional' },
                    { value: 'Business Owner', label: 'Business Owner' },
                    { value: 'Teacher', label: 'Teacher' },
                    { value: 'Other', label: 'Other' }
                ]}
                error={errors.occupation}
            />

            <Input
                label="Why do you want to join? (Optional)"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
            />

            <Button
                type="submit"
                variant="primary"
                className="btn-block"
                disabled={status.isSubmitting}
            >
                {status.isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
        </form>
    );
};

export default ApplyForm;
