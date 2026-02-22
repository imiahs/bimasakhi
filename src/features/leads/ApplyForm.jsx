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
                    msg: 'We are currently active in Delhi NCR. You can still apply — we will keep you informed as we expand to your area.',
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
                title: "Start Your Bima Sakhi Journey",
                desc: "If you are serious about building a career with LIC, this is your first step."
            },
            hi: {
                title: "अपनी बीमा सखी यात्रा शुरू करें",
                desc: "अगर आप एलआईसी के साथ करियर बनाना चाहती हैं, तो यह आपका पहला कदम है।"
            }
        };

        const t = texts[language] || texts.en;

        return (
            <div className="form-step">
                <div className="step-header">
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                    <p style={{ fontSize: "0.85em", color: "#666" }}>
                        Your details remain confidential and are reviewed personally.
                    </p>
                    <p style={{ fontSize: "0.8em", color: "#888" }}>
                        Step 1 of 4 – Basic Details
                    </p>
                </div>

                <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                />

                <Input
                    label="WhatsApp Number (For Application Updates)"
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
                <h3>Where are you based?</h3>
                <p>
                    We are currently guiding applicants from Delhi NCR.
                    If you are from another city, you can still apply — we will inform you when expansion begins in your area.
                </p>
                <p style={{ fontSize: "0.85em", color: "#666" }}>
                    Enter your pincode to check availability.
                </p>
                <p style={{ fontSize: "0.8em", color: "#4CAF50", marginTop: "5px" }}>
                    ✔ Every application is reviewed individually.
                </p>
                <p style={{ fontSize: "0.8em", color: "#888" }}>
                    Step 2 of 4 – Location Details
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

            {locationStatus.type === "info" && (
                <div style={{
                    background: "#fff8e1",
                    padding: "10px",
                    borderRadius: "6px",
                    marginTop: "10px",
                    fontSize: "0.85em"
                }}>
                    🌍 You will be added to our expansion priority list.
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
                    placeholder={locationStatus.isManual ? "Type your city name" : "Auto-detected"}
                />
                <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    readOnly={!locationStatus.isManual}
                    disabled={!locationStatus.isManual && !formData.state}
                    placeholder={locationStatus.isManual ? "Type your state name" : "Auto-detected"}
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
                                    ? 'Select your area'
                                    : 'Enter your pincode to load areas'
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
                <h3>Tell us a little about yourself</h3>
                <p>
                    This helps us understand how we can guide you in building your LIC agency journey.
                </p>
                <p style={{ fontSize: "0.85em", color: "#666" }}>
                    Every profile is reviewed personally before onboarding.
                </p>
                <p style={{ fontSize: "0.8em", color: "#888" }}>
                    Step 3 of 4 – Personal Details
                </p>
            </div>

            <Input
                label="Email Address (For Official Communication)"
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
                    { value: 'Graduate', label: 'Graduate / Degree Holder' },
                    { value: 'Post Graduate', label: 'Post Graduate' }
                ]}
            />

            <Select
                label="Your Current Situation"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                error={errors.occupation}
                options={[
                    { value: 'Housewife', label: 'Housewife / Homemaker' },
                    { value: 'Working Professional', label: 'Working Professional' },
                    { value: 'Student', label: 'Student' },
                    { value: 'Job Seeker', label: 'Job Seeker' },
                    { value: 'Retired', label: 'Retired' }
                ]}
            />
            <p style={{ fontSize: "0.8em", color: "#4CAF50", marginTop: "10px" }}>
                ✔ Many successful LIC agents started without prior experience.
            </p>
        </div>
    );

    const renderStep4 = () => (
        <div className="form-step">
            <div className="step-header">
                <h3>Final Step – Confirm Your Application</h3>
                <p>
                    Please review your details carefully before we process your application.
                </p>
                <p style={{ fontSize: "0.85em", color: "#666" }}>
                    After submission, our team will review your profile and contact you personally.
                </p>
                <p style={{ fontSize: "0.8em", color: "#888" }}>
                    Step 4 of 4 – Review & Submit
                </p>
            </div>

            <div className="review-summary">
                <div className="review-row">
                    <span className="review-label">Full Name</span>
                    <span className="review-value">{formData.name}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">WhatsApp Number</span>
                    <span className="review-value">{formData.mobile}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Location (City & Pincode)</span>
                    <span className="review-value">
                        {formData.city}, {formData.pincode}
                    </span>
                </div>
                <div className="review-row">
                    <span className="review-label">Email Address</span>
                    <span className="review-value">{formData.email}</span>
                </div>
                <div className="review-row">
                    <span className="review-label">Education & Current Status</span>
                    <span className="review-value">
                        {formData.education}, {formData.occupation}
                    </span>
                </div>
            </div>

            <div style={{
                marginTop: "15px",
                padding: "12px",
                background: "#f8f9fa",
                borderRadius: "6px",
                fontSize: "0.9em",
                color: "#444"
            }}>
                ✔ This is a professional LIC agency opportunity.
                ✔ No registration fee is charged at this stage.
                ✔ Selection is based on eligibility and discussion.
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
                career opportunity. This is not a salaried job. Stipend, training, support,
                and any performance-linked benefits are subject to LIC norms.
            </div>
        </div>
    );

    // 3. Duplicate View (Welcome Back)

    if (status.duplicate) {
        const existingDate = status.duplicateData?.created_at
            ? new Date(status.duplicateData.created_at).toLocaleDateString()
            : null;

        return (
            <div className="apply-success-card">
                <div className="success-icon">📌</div>

                <h2>Application Already Received</h2>

                <p style={{ marginTop: "8px" }}>
                    Our records show that your application has already been submitted.
                </p>

                {existingDate && (
                    <p style={{ marginTop: "5px", fontSize: "0.9em", color: "#666" }}>
                        Submitted on: <strong>{existingDate}</strong>
                    </p>
                )}

                {status.leadId && (
                    <p style={{ marginTop: "5px", fontSize: "0.9em" }}>
                        Reference ID: <strong>{status.leadId}</strong>
                    </p>
                )}

                <div style={{
                    margin: '20px 0',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '8px',
                    fontSize: '0.9em',
                    color: '#444'
                }}>
                    ✔ Your profile is currently under review.
                    ✔ There is no need to submit the form again.
                    ✔ Our team connects personally after evaluation.
                </div>

                <p style={{ fontSize: "0.85em", color: "#888", marginBottom: "10px" }}>
                    If you would like an update or wish to clarify anything, you may reach out below.
                </p>

                <button
                    onClick={handleWhatsAppClick}
                    className="btn btn-whatsapp btn-block"
                >
                    Continue Conversation on WhatsApp
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
                    {isWaitlist ? "🌍" : "✅"}
                </div>

                <h2>
                    {isWaitlist
                        ? "You’re on Our Expansion Priority List"
                        : "Your Application Has Been Received"}
                </h2>

                <p style={{ marginTop: "6px" }}>
                    Reference ID: <strong>{status.leadId}</strong>
                </p>
                <p style={{ fontSize: "0.8em", color: "#888" }}>
                    Please keep this reference ID for future communication.
                </p>

                <div
                    style={{
                        margin: '20px 0',
                        padding: '15px',
                        background: '#f8f9fa',
                        borderRadius: '8px',
                        fontSize: '0.95em',
                        color: '#444'
                    }}
                >
                    {isWaitlist ? (
                        <>
                            ✔ We are currently onboarding candidates from Delhi NCR. <br />
                            ✔ Your profile has been added to our expansion list. <br />
                            ✔ You will be informed as soon as onboarding begins in your city.
                        </>
                    ) : (
                        <>
                            ✔ Your profile is now under review. <br />
                            ✔ Our team will connect with you personally on WhatsApp. <br />
                            ✔ Training and onboarding details will be explained step-by-step.
                        </>
                    )}
                </div>

                <p style={{ fontSize: "0.85em", color: "#666", marginBottom: "15px" }}>
                    {isWaitlist
                        ? "You may also connect with us on WhatsApp if you would like early updates."
                        : "If you prefer immediate communication, you may connect with us on WhatsApp below."}
                </p>

                <button
                    onClick={handleWhatsAppClick}
                    className="btn btn-whatsapp btn-block"
                >
                    {isWaitlist
                        ? "Get Updates on WhatsApp"
                        : "Continue on WhatsApp"}
                </button>
            </div>
        );
    }

    // 5. Wizard View
    return (
        <div className="lead-form-wizard">
            <div className="wizard-progress"
                style={{
                    '--progress-width': `${(step - 1) * 33.33}%`
                }}
            >
                {[1, 2, 3, 4].map(num => (
                    <div
                        key={num}
                        className={`step-indicator 
                            ${step === num ? 'active' : ''} 
                            ${step > num ? 'completed' : ''}`}
                    >
                        <div className="step-circle">
                            {step > num ? '✓' : num}
                        </div>
                        <div className="step-label">
                            {["Basic Details", "Location", "Background", "Confirmation"][num - 1]}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}

                <div className="form-actions">
                    <p style={{ fontSize: "0.8em", color: "#888", marginBottom: "10px" }}>
                        Step {step} of 4
                    </p>
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
                            {step === 1 && "Continue to Location"}
                            {step === 2 && "Continue to Background"}
                            {step === 3 && "Review Your Details"}
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
                                : 'Submit for Review'}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ApplyForm;
