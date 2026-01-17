import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';
import { ConfigContext } from '../../context/ConfigContext';
import { LanguageContext } from '../../context/LanguageContext';
import { analytics } from '../../services/analytics';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
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

    // 1. Pause Logic
    // Used when applications are temporarily stopped (operational / compliance reasons)
    if (config.isAppPaused) {
        return (
            <div className="alert-box">
                Applications are currently paused. Please check back later.
            </div>
        );
    }

    // 2. Already Submitted Guard
    // Prevents duplicate submissions from same user/session
    if (userState.hasSubmitted && !status.success) {
        return (
            <div className="alert-box success">
                You have already submitted your application.
                If you missed the WhatsApp conversation,{' '}
                <a
                    href={getWhatsAppUrl({ ...userState.lastLeadData })}
                    target="_blank"
                    rel="noreferrer"
                >
                    click here
                </a>.
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
            if (!formData.locality)
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
                    state: data.state
                }));

                setLocationStatus({
                    loading: false,
                    msg: '⚠️ Currently open only for Delhi NCR. You may be added to a waitlist.',
                    type: 'warning'
                });

                setAvailableLocalities([]);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep(3)) return;

        setStatus(prev => ({ ...prev, isSubmitting: true }));

        // Prepare Payload
        // NOTE: This represents an application for a commission-based LIC agency career
        const payload = {
            ...formData,
            source: userState.source || 'Website',
            medium: userState.medium || 'Direct',
            campaign: userState.campaign || 'Bima Sakhi',
            visitedPages: userState.visitedPages
        };

        // Mock API Call (Micro-sprint V1)
        setTimeout(() => {
            const mockLeadId = 'LEAD-' + Date.now().toString().slice(-6);

            markSubmitted(formData.city, payload);

            analytics.track('form_submit', {
                leadId: mockLeadId,
                city: formData.city,
                source: userState.source
            });

            setStatus({
                isSubmitting: false,
                success: true,
                error: null,
                leadId: mockLeadId
            });
        }, 1000);
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
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            fontSize: '0.85em',
                            color: '#555',
                            cursor: 'pointer'
                        }}
                    >
                        <input
                            type="checkbox"
                            name="dndConsent"
                            checked={formData.dndConsent}
                            onChange={handleChange}
                            style={{ marginTop: '3px' }}
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
                    At present, this career opportunity is open only for women based in Delhi NCR.
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

    // 3. Success View
    if (status.success) {
        return (
            <div className="apply-success-card animate-pulse">
                <div className="success-icon">✅</div>
                <h2>Application Submitted Successfully</h2>
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
                    <p style={{ color: '#555', fontSize: '0.95em' }}>
                        Our team will connect with you on WhatsApp to guide you about the
                        next steps.
                    </p>
                </div>

                <button
                    onClick={handleWhatsAppClick}
                    className="btn btn-whatsapp btn-block"
                >
                    Continue on WhatsApp
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
