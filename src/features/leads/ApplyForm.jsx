import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { ConfigContext } from '../../context/ConfigContext';
import { LanguageContext } from '../../context/LanguageContext';
import { analytics } from '../../services/analytics';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import '../../styles/LeadForm.css';

const ApplyForm = () => {
    const { userState, markSubmitted } = useContext(UserContext);
    const { config } = useContext(ConfigContext);

    // Steps: 
    // 1: Identity
    // 2: Location
    // 3: Profile
    // 4: Review / Submit
    // NOTE: This is a career onboarding flow, not a job application
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        pincode: '',
        city: '',
        state: '',
        locality: '',
        address: '', // Optional (future use)
        email: '',
        education: '',
        occupation: '', // Reused for 'Current Status'
        reason: '', // Reserved for future qualitative analysis
        phaseTag: "phase1_delhi",  // default
        dndConsent: false
    });

    const [status, setStatus] = useState({
        isSubmitting: false,
        success: false,
        error: null,
        leadId: null
    });

    const [availableLocalities, setAvailableLocalities] = useState([]);

    const [locationStatus, setLocationStatus] = useState({
        loading: false,
        msg: '',
        type: '', // 'success', 'warning', 'error'
        isManual: false
    });

    const [errors, setErrors] = useState({});

    // 🔥 WhatsApp handler for paused state (no form submission required)
    const handlePausedWhatsAppClick = () => {
        const message = encodeURIComponent(
            "Hello, I am interested in the Bima Sakhi opportunity, but applications are currently paused. Please inform me when it reopens in my area."
        );

        const waUrl = `https://wa.me/919311073365?text=${message}`;

        // 🔥 GTM tracking for paused-state interest
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "whatsapp_paused_interest_click",
            source: userState?.source || "website",
            medium: userState?.medium || "direct",
            campaign: userState?.campaign || "bima_sakhi"
        });

        window.open(waUrl, "_blank");
    };
    // 1. Pause Logic
    // Used when applications are temporarily stopped (operational / compliance reasons)
    if (config.isAppPaused) {
        return (
            <div className="alert-box">
                <p style={{ marginBottom: "10px", fontWeight: "600" }}>
                    🚧 Applications are temporarily paused.
                </p>

                <p style={{ marginBottom: "10px" }}>
                    We are currently onboarding candidates in selected locations.
                    Expansion to more cities is planned.
                </p>

                <p style={{ marginBottom: "15px" }}>
                    If you would like to stay informed when applications reopen in your area,
                    you may connect with us on WhatsApp.
                </p>

                <button
                    onClick={handlePausedWhatsAppClick}
                    className="btn btn-whatsapp btn-block"
                >
                    Stay Updated on WhatsApp
                </button>
            </div>
        );
    }

    // 2. Already Submitted Guard
    // Prevents duplicate submissions from same user/session
    // 2. Already Submitted Guard
    // Prevents duplicate submissions from same user/session
    if (userState.hasSubmitted && !status.success) {
        return (
            <div className="alert-box success">
                <p style={{ fontWeight: "600", marginBottom: "8px" }}>
                    ✅ Your application has already been received.
                </p>

                {/* Show Reference ID if available */}
                {userState?.lastLeadData?.leadId && (
                    <p style={{ marginBottom: "8px" }}>
                        Reference ID:{" "}
                        <strong>{userState.lastLeadData.leadId}</strong>
                    </p>
                )}

                <p style={{ marginBottom: "10px" }}>
                    Our system shows that your profile is currently under review.
                    There is no need to submit the form again.
                </p>

                <p style={{ marginBottom: "15px" }}>
                    Our team connects personally on WhatsApp after reviewing each profile.
                    If you would like to reconnect or continue the conversation,
                    you may reach us below.
                </p>

                <button
                    onClick={handleWhatsAppClick}
                    className="btn btn-whatsapp btn-block"
                >
                    Reconnect on WhatsApp
                </button>
            </div>
        );
    }

    // --- Validation Logic ---
    // Each step validates only its own required fields
    const validateStep = (currentStep) => {
        let tempErrors = {};
        let isValid = true;

        if (currentStep === 1) {
            if (!formData.name.trim()) tempErrors.name = "Name is required";
            if (!formData.mobile || !/^\d{10}$/.test(formData.mobile))
                tempErrors.mobile = "Valid 10-digit mobile number required";
            if (!formData.dndConsent)
                tempErrors.dndConsent = "Please provide consent to proceed.";
        }

        if (currentStep === 2) {
            if (!formData.pincode || !/^\d{6}$/.test(formData.pincode))
                tempErrors.pincode = "Valid 6-digit Pincode required";
            if (!formData.city)
                tempErrors.city = "City could not be detected";
            // Only require locality if not manual mode
            if (!formData.locality && !locationStatus.isManual)
                tempErrors.locality = "Locality / Area is required";

        }

        if (currentStep === 3) {
            if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
                tempErrors.email = "Valid Email is required";
            if (!formData.education)
                tempErrors.education = "Education level is required";
            if (!formData.occupation)
                tempErrors.occupation = "Current status is required";
        }

        if (Object.keys(tempErrors).length > 0) {
            setErrors(tempErrors);
            isValid = false;
        } else {
            setErrors({});
        }

        return isValid;
    };

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: val }));

        // Clear field-specific error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }

        // Pincode auto-lookup trigger
        if (name === 'pincode' && value.length === 6) {
            handlePincodeLookup(value);
        } else if (name === 'pincode' && value.length < 6) {
            // Reset dependent fields if pincode changes
            if (formData.city || locationStatus.isManual) {
                setFormData(prev => ({
                    ...prev,
                    city: '',
                    state: '',
                    locality: ''
                }));
                setLocationStatus({
                    loading: false,
                    msg: '',
                    type: '',
                    isManual: false
                });
                setAvailableLocalities([]);
            }
        }
    };

    // Real Backend Pincode Lookup
    // Controls Delhi NCR eligibility for Phase-1 rollout
    const handlePincodeLookup = async (pincode) => {
        setLocationStatus({
            loading: true,
            msg: 'Locating service availability...',
            type: 'loading'
        });

        try {
            const response = await axios.get(`/api/pincode-lookup?pincode=${pincode}`);
            const data = response.data;

            if (data.eligible) {
                const localityOptions = data.localities.map(loc => ({
                    value: loc,
                    label: loc
                }));
                localityOptions.unshift({
                    value: '',
                    label: 'Select Locality'
                });

                setFormData(prev => ({
                    ...prev,
                    city: data.city,
                    state: data.state
                }));

                setAvailableLocalities(localityOptions);

                setLocationStatus({
                    loading: false,
                    msg: '✅ Service available in your area',
                    type: 'success'
                });
            } else {
                // Outside Delhi NCR – waitlist scenario
                setFormData(prev => ({
                    ...prev,
                    city: data.city,
                    state: data.state,
                    phaseTag: "future_expansion"   // 🔥 TAG ADDED
                }));

                setLocationStatus({
                    loading: false,
                    msg: 'Currently onboarding candidates from Delhi NCR (Phase 1). You are eligible for our upcoming expansion waitlist.',
                    type: 'info',
                    isManual: true   // 🔥 IMPORTANT
                });

                // Allow manual locality entry
                setAvailableLocalities([
                    { value: '', label: 'Select Locality' },
                    { value: 'Other', label: 'Other / Manual Entry' }
                ]);
            }
        } catch (error) {
            console.error("Pincode API Error", error);

            // Manual fallback
            setLocationStatus({
                loading: false,
                msg: 'Could not auto-detect. Please enter details manually.',
                type: 'warning',
                isManual: true
            });

            setAvailableLocalities([
                { value: 'Manual Entry', label: 'Other / Manual Entry' }
            ]);
        }
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setStep(prev => prev - 1);
    };

    // SAFEGUARD: Track mounted state to prevent memory leaks
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // GUARD 1: Prevent submission if already submitting
        if (status.isSubmitting) return;

        // GUARD 2: Validation
        if (!validateStep(3)) return;

        // LOCK UI
        setStatus(prev => ({ ...prev, isSubmitting: true, error: null }));

        // Prepare Payload
        const payload = {
            ...formData,
            recruitment_phase: formData.phaseTag,   // 🔥 CRM TAG
            source: userState.source || 'Website',
            medium: userState.medium || 'Direct',
            campaign: userState.campaign || 'Bima Sakhi',
            visitedPages: userState.visitedPages
        };

        try {
            // TIMEOUT PROTECTION (15s)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Request timed out")), 15000)
            );

            const apiCall = axios.post('/api/create-lead', payload);

            const response = await Promise.race([apiCall, timeoutPromise]);
            const data = response.data;

            if (!isMounted.current) return;

            if (data.success) {
                if (data.duplicate) {
                    setStatus({
                        isSubmitting: false,
                        success: false,
                        error: null,
                        duplicate: true,
                        leadId: data.lead_id,
                        duplicateData: data.data
                    });
                } else {
                    const leadId = data.lead_id || 'PENDING';
                    markSubmitted(formData.city, payload);

                    analytics.track('form_submit', {
                        leadId: leadId,
                        city: formData.city,
                        source: userState.source
                    });

                    // 🔥 GTM FORM SUBMIT EVENT
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        event: "bimasakhi_form_submit",
                        lead_id: leadId,
                        city: formData.city,
                        source: userState.source || "website",
                        medium: userState.medium || "direct",
                        campaign: userState.campaign || "bima_sakhi"
                    });

                    setStatus({
                        isSubmitting: false,
                        success: true,
                        error: null,
                        leadId: leadId
                    });
                }
            } else {
                throw new Error(data.error || 'Submission Failed');
            }
        } catch (error) {
            console.error("Submission Error", error);

            if (isMounted.current) {
                setStatus({
                    isSubmitting: false,
                    success: false,
                    error: error.message || "Network/Server Error. Please retry.",
                    leadId: null
                });

                analytics.track('form_error', {
                    error: error.message
                });
            }
        }
    };

    const handleWhatsAppClick = () => {
        const waUrl = getWhatsAppUrl({
            ...formData,
            source: userState.source,
            leadId: status.leadId
        });

        analytics.track('whatsapp_click', {
            context: 'apply_success_cta',
            leadId: status.leadId
        });

        // 🔥 GTM WHATSAPP EVENT
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: "whatsapp_continue_click",
            lead_id: status?.leadId || "unknown",
            phone: "919311073365",
            source: userState?.source || "website",
            medium: userState?.medium || "direct",
            campaign: userState?.campaign || "bima_sakhi"
        });

        window.open(waUrl, '_blank');
    };

    // --- Steps Rendering ---

    const renderStep1 = () => {
        const { language } = useContext(LanguageContext);

        const texts = {
            en: {
                title: "Now the opportunity is in your hands",
                desc: "Apply today and start your future."
            },
            hi: {
                title: "अब मौका आपके हाथ में है",
                desc: "आज आवेदन करें और अपने भविष्य की शुरुआत करें।"
            }
        };

        const t = texts[language] || texts.en;

        return (
            <div className="form-step">
                <div className="step-header">
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                </div>

                <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                />

                <Input
                    label="Mobile Number (WhatsApp)"
                    name="mobile"
                    type="tel"
                    maxLength="10"
                    value={formData.mobile}
                    onChange={handleChange}
                    error={errors.mobile}
                    placeholder="10 digit number"
                />

                <div className="form-group" style={{ marginTop: '15px' }}>
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="dndConsent"
                            checked={formData.dndConsent}
                            onChange={handleChange}
                        />
                        <span>
                            I voluntarily authorize Bima Sakhi / IMIAH Services to contact me
                            via WhatsApp, SMS, or call regarding my application and next steps,
                            even if my number is registered on DND.
                        </span>
                    </label>

                    {errors.dndConsent && (
                        <div style={{ color: 'red', fontSize: '0.8em', marginTop: '5px' }}>
                            {errors.dndConsent}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderStep2 = () => (
        <div className="form-step">
            <div className="step-header">
                <h3>Your service location</h3>
                <p>
                    Currently onboarding candidates from Delhi NCR as part of Phase 1.
                    Applications from other cities are welcomed for upcoming expansion.
                </p>
            </div>

            <Input
                label="Pincode"
                name="pincode"
                type="tel"
                maxLength="6"
                value={formData.pincode}
                onChange={handleChange}
                error={errors.pincode}
                placeholder="e.g. 110001"
            />

            {locationStatus.msg && (
                <div className={`pincode-status status-${locationStatus.type}`}>
                    {locationStatus.loading && <span>⏳</span>}
                    {locationStatus.msg}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    readOnly={!locationStatus.isManual}
                    disabled={!locationStatus.isManual && !formData.city}
                    placeholder={locationStatus.isManual ? "Enter City" : "Auto-detected"}
                />
                <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    readOnly={!locationStatus.isManual}
                    disabled={!locationStatus.isManual && !formData.state}
                    placeholder={locationStatus.isManual ? "Enter State" : "Auto-detected"}
                />
            </div>

            <Select
                label="Locality / Area"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                error={errors.locality}
                options={
                    availableLocalities.length > 0
                        ? availableLocalities
                        : [
                            {
                                value: '',
                                label: locationStatus.isManual
                                    ? 'Select Option'
                                    : 'Enter Pincode first'
                            }
                        ]
                }
                disabled={!formData.city && !locationStatus.isManual}
            />
        </div>
    );

    const renderStep3 = () => (
        <div className="form-step">
            <div className="step-header">
                <h3>Your background</h3>
                <p>
                    This information helps us understand your profile for guidance and training.
                </p>
            </div>

            <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
            />

            <Select
                label="Education Level"
                name="education"
                value={formData.education}
                onChange={handleChange}
                error={errors.education}
                options={[
                    { value: '10th Pass', label: '10th Pass' },
                    { value: '12th Pass', label: '12th Pass' },
                    { value: 'Graduate', label: 'Graduate' },
                    { value: 'Post Graduate', label: 'Post Graduate' }
                ]}
            />

            <Select
                label="Current Status"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                error={errors.occupation}
                options={[
                    { value: 'Housewife', label: 'Housewife / Homemaker' },
                    { value: 'Student', label: 'Student' },
                    { value: 'Working Professional', label: 'Working Professional' },
                    { value: 'Retired', label: 'Retired' },
                    { value: 'Job Seeker', label: 'Job Seeker' }
                ]}
            />
        </div>
    );

    const renderStep4 = () => (
        <div className="form-step">
            <div className="step-header">
                <h3>Review & Submit</h3>
                <p>Please check your details before submitting.</p>
            </div>

            <div className="review-summary">
                <div className="review-row">
                    <span className="review-label">Name</span>
                    <span className="review-value">{formData.name}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Mobile</span>
                    <span className="review-value">{formData.mobile}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Location</span>
                    <span className="review-value">
                        {formData.city}, {formData.pincode}
                    </span>
                </div>
                <div className="review-row">
                    <span className="review-label">Email</span>
                    <span className="review-value">{formData.email}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Profile</span>
                    <span className="review-value">
                        {formData.education}, {formData.occupation}
                    </span>
                </div>
            </div>

            {/* MICRO DISCLAIMER – IMPORTANT FOR EXPECTATION SETTING */}
            <div
                className="micro-disclaimer"
                style={{
                    marginTop: '15px',
                    padding: '10px',
                    fontSize: '0.85em',
                    color: '#666',
                    borderTop: '1px dashed #ddd'
                }}
            >
                <strong>Important:</strong> Bima Sakhi is a commission-based LIC agency
                career opportunity. This is not a salaried job. Training, support,
                and any performance-linked benefits are subject to LIC norms.
            </div>
        </div>
    );

    // 3. Duplicate View (Welcome Back)
    if (status.duplicate) {
        const existingDate = status.duplicateData?.created_at
            ? new Date(status.duplicateData.created_at).toLocaleDateString()
            : 'a previous date';

        return (
            <div className="apply-success-card">
                <div className="success-icon">👋</div>
                <h2>Welcome Back, {formData.name}</h2>
                <p>
                    We already have your application from <strong>{existingDate}</strong>.
                </p>

                <div style={{
                    margin: '20px 0',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    fontSize: '0.9em',
                    color: '#666'
                }}>
                    Our team is reviewing your profile. There is no need to apply again.
                    <br />If you haven't heard from us, you can connect on WhatsApp.
                </div>

                <button
                    onClick={handleWhatsAppClick}
                    className="btn btn-whatsapp btn-block"
                >
                    Check Status on WhatsApp
                </button>
            </div>
        );
    }

    // 4. Success View
    if (status.success) {

        const isWaitlist = formData.phaseTag === "future_expansion";

        return (
            <div className="apply-success-card animate-pulse">
                <div className="success-icon">
                    {isWaitlist ? "📝" : "✅"}
                </div>

                <h2>
                    {isWaitlist
                        ? "You’re Added to Our Expansion Waitlist"
                        : "Application Submitted Successfully"}
                </h2>

                <p>
                    Reference ID: <strong>{status.leadId}</strong>
                </p>

                <div
                    style={{
                        margin: '20px 0',
                        borderTop: '1px solid #eee',
                        paddingTop: '15px'
                    }}
                >
                    {isWaitlist ? (
                        <p style={{ color: '#555', fontSize: '0.95em' }}>
                            We are currently onboarding candidates from Delhi NCR (Phase 1).
                            Your profile has been added to our priority list for upcoming expansion.
                            Our team will notify you when onboarding begins in your area.
                        </p>
                    ) : (
                        <p style={{ color: '#555', fontSize: '0.95em' }}>
                            Our team will connect with you on WhatsApp to guide you about
                            the training and onboarding process.
                        </p>
                    )}
                </div>

                <button
                    onClick={handleWhatsAppClick}
                    className="btn btn-whatsapp btn-block"
                >
                    {isWaitlist
                        ? "Connect for Updates on WhatsApp"
                        : "Continue on WhatsApp"}
                </button>
            </div>
        );
    }

    // 4. Wizard View
    return (
        <div className="lead-form-wizard">
            <div className="wizard-progress">
                {[1, 2, 3, 4].map(num => (
                    <div
                        key={num}
                        className={`step-indicator ${step === num ? 'active' : ''
                            } ${step > num ? 'completed' : ''}`}
                    >
                        {step > num ? '✓' : num}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}

                <div className="form-actions">
                    {step > 1 && (
                        <Button
                            onClick={handleBack}
                            variant="secondary"
                            className="btn-block"
                        >
                            Back
                        </Button>
                    )}

                    {step < 4 ? (
                        <Button
                            onClick={handleNext}
                            variant="primary"
                            className="btn-block"
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="primary"
                            className="btn-block"
                            disabled={status.isSubmitting}
                        >
                            {status.isSubmitting
                                ? 'Submitting...'
                                : 'Confirm & Submit'}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ApplyForm;
