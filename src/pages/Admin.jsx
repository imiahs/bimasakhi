import React, { useState, useContext, useEffect } from 'react';
import { ConfigContext } from '../context/ConfigContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import axios from 'axios';
import { SECTION_SCHEMAS, AVAILABLE_SECTIONS } from '../config/sectionSchemas';

const Admin = () => {
    const { config, refreshConfig } = useContext(ConfigContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ loading: false, msg: '' });
    const [activeTab, setActiveTab] = useState('global'); // 'global' | 'home'

    // Config State
    const [formData, setFormData] = useState(config);

    // Sync form with config when config loads
    useEffect(() => {
        setFormData(config);
    }, [config]);

    // Check Auth on Mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('/api/admin-check');
                if (res.data.authenticated) {
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error("Auth Check Failed", err);
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogin = async () => {
        if (!password) return;
        setStatus({ loading: true, msg: 'Logging in...' });
        try {
            await axios.post('/api/admin-login', { password });
            setIsAuthenticated(true);
            setStatus({ loading: false, msg: '' });
        } catch (error) {
            console.error(error);
            setStatus({ loading: false, msg: 'Login Failed: Invalid Password' });
            alert("Invalid Password");
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/admin-logout');
            setIsAuthenticated(false);
            setPassword('');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleConfigSave = async () => {
        setStatus({ loading: true, msg: 'Saving...' });
        try {
            // No custom headers needed, credentials (cookies) sent automatically by browser 
            // BUT for axios we might need withCredentials: true if cross-origin, 
            // but here it is same-origin so it should be fine.
            // However, just to be safe with axios defaults:
            await axios.post('/api/config-save', formData);

            setStatus({ loading: false, msg: 'Saved Successfully!' });
            refreshConfig();
        } catch (error) {
            console.error(error);
            setStatus({ loading: false, msg: 'Error: Unauthorized or Network Fail' });
            if (error.response && error.response.status === 401) {
                setIsAuthenticated(false);
                alert("Session Expired");
            }
        }
    };

    // --- Page Editor Logic ---

    const getSections = () => formData.pages?.home?.sections || [];

    const updateSections = (newSections) => {
        setFormData(prev => ({
            ...prev,
            pages: {
                ...prev.pages,
                home: {
                    ...prev.pages?.home,
                    sections: newSections
                }
            }
        }));
    };

    const handleMoveSection = (index, direction) => {
        const sections = [...getSections()];
        if (direction === 'up' && index > 0) {
            [sections[index], sections[index - 1]] = [sections[index - 1], sections[index]];
        } else if (direction === 'down' && index < sections.length - 1) {
            [sections[index], sections[index + 1]] = [sections[index + 1], sections[index]];
        }
        updateSections(sections);
    };

    const handleDeleteSection = (index) => {
        if (!window.confirm("Are you sure you want to delete this section?")) return;
        const sections = [...getSections()];
        sections.splice(index, 1);
        updateSections(sections);
    };

    const handleAddSection = (type) => {
        const schema = SECTION_SCHEMAS[type];
        const newSection = {
            id: `${type.toLowerCase()}_${Date.now()}`,
            type: type,
            props: {} // Initialize with defaults ideally, but schema handles defaults in UI for now
        };
        // Pre-fill defaults
        if (schema && schema.fields) {
            schema.fields.forEach(f => {
                newSection.props[f.name] = f.default;
            });
        }
        updateSections([...getSections(), newSection]);
    };

    const handlePropChange = (sectionIndex, fieldName, value) => {
        const sections = [...getSections()];
        sections[sectionIndex] = {
            ...sections[sectionIndex],
            props: {
                ...sections[sectionIndex].props,
                [fieldName]: value
            }
        };
        updateSections(sections);
    };

    // --- Renderers ---

    if (!isAuthenticated) {
        return (
            <div className="container py-8 text-center" style={{ maxWidth: '400px' }}>
                <h1>Admin Access</h1>
                <Input
                    type="password"
                    placeholder="Enter Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleLogin}>Login</Button>
            </div>
        );
    }

    return (
        <div className="page-admin container">
            <div className="flex justify-between items-center mb-6">
                <h1>Admin Dashboard</h1>
                <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </div>
            <p className="text-sm mb-4">Status: Node 24.x | Vercel KV Active</p>
            {status.msg && <div className="alert-box mb-4">{status.msg}</div>}

            <div className="admin-tabs" style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <button
                    style={{ padding: '10px 20px', fontWeight: activeTab === 'global' ? 'bold' : 'normal' }}
                    onClick={() => setActiveTab('global')}
                >Global Settings</button>
                <button
                    style={{ padding: '10px 20px', fontWeight: activeTab === 'home' ? 'bold' : 'normal' }}
                    onClick={() => setActiveTab('home')}
                >Home Page Editor</button>
            </div>

            {activeTab === 'global' && (
                <div className="grid-2-col">
                    <Card>
                        <h2>Kill Switches</h2>
                        <div className="toggle-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={!!formData.isAppPaused}
                                    onChange={(e) => setFormData(prev => ({ ...prev, isAppPaused: e.target.checked }))}
                                /> Pause All Applications
                            </label>
                        </div>
                    </Card>
                    <Card>
                        <h2>Global Texts</h2>
                        <Input
                            label="Delhi Only Message"
                            value={formData.delhiOnlyMessage || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, delhiOnlyMessage: e.target.value }))}
                        />
                    </Card>
                </div>
            )}

            {activeTab === 'home' && (
                <div className="page-editor">
                    <Card>
                        <h2>Home Page Sections</h2>
                        <div className="sections-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {getSections().map((section, index) => {
                                const schema = SECTION_SCHEMAS[section.type];
                                return (
                                    <div key={section.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                            <strong>{index + 1}. {schema ? schema.name : section.type}</strong>
                                            <div className="actions">
                                                <button onClick={() => handleMoveSection(index, 'up')} disabled={index === 0}>⬆</button>
                                                <button onClick={() => handleMoveSection(index, 'down')} disabled={index === getSections().length - 1}>⬇</button>
                                                <button onClick={() => handleDeleteSection(index)} style={{ color: 'red', marginLeft: '10px' }}>Delete</button>
                                            </div>
                                        </div>

                                        {/* Auto-Generated Form */}
                                        <div className="props-form" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            {schema && schema.fields.map(field => (
                                                <div key={field.name}>
                                                    <label style={{ fontSize: '12px', color: '#666' }}>{field.label}</label>
                                                    <Input
                                                        type={field.type}
                                                        value={section.props[field.name] || ''}
                                                        onChange={(e) => handlePropChange(index, field.name, e.target.value)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="add-section" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                            <h3>Add Section</h3>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select id="newSectionSelect" style={{ padding: '8px' }}>
                                    {AVAILABLE_SECTIONS.map(s => <option key={s.type} value={s.type}>{s.label}</option>)}
                                </select>
                                <Button onClick={() => {
                                    const select = document.getElementById('newSectionSelect');
                                    handleAddSection(select.value);
                                }}>Add +</Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <div className="floating-save" style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
                <Button onClick={handleConfigSave} disabled={status.loading} variant="primary">
                    {status.loading ? 'Saving...' : 'Save Configuration'}
                </Button>
            </div>
        </div>
    );
};

export default Admin;

