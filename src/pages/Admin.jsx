import React, { useState, useContext, useEffect } from 'react';
import { ConfigContext } from '../context/ConfigContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import axios from 'axios';
import { SECTION_SCHEMAS, AVAILABLE_SECTIONS } from '../config/sectionSchemas';
import useIdleTimer from '../hooks/useIdleTimer';

const InsightsDashboard = () => {
    const [range, setRange] = useState('today');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, [range]);

    const fetchStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`/api/stats?range=${range}`);
            setStats(res.data);
        } catch (err) {
            console.error("Stats Error", err);
            setError("Could not load stats. Zoho might be busy.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="insights-dashboard">
            <div className="flex gap-4 mb-6">
                {['today', '7d', '30d'].map(r => (
                    <Button
                        key={r}
                        variant={range === r ? 'primary' : 'secondary'}
                        onClick={() => setRange(r)}
                        className="capitalize"
                    >
                        {r === 'today' ? 'Today' : `Last ${r.toUpperCase()}`}
                    </Button>
                ))}
                <Button variant="secondary" onClick={fetchStats}>↻ Refresh</Button>
            </div>

            {loading && <div className="p-8 text-center animate-pulse">Loading Insights...</div>}

            {error && <div className="alert-box error mb-4">{error}</div>}

            {stats && !loading && (
                <div className="stats-content">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="text-center p-4">
                            <h3 className="text-gray-500 text-sm">Applications</h3>
                            <p className="text-3xl font-bold text-pink-600">{stats.totalApplications}</p>
                        </Card>
                        {/* Placeholders for future metrics */}
                        <Card className="text-center p-4 opacity-75">
                            <h3 className="text-gray-500 text-sm">Eligible (Est)</h3>
                            <p className="text-3xl font-bold">N/A*</p>
                        </Card>
                    </div>

                    {/* Attribution Table */}
                    <Card>
                        <h3 className="mb-4 text-lg font-bold">Traffic Sources</h3>
                        {stats.attribution.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2">Source</th>
                                        <th className="p-2 text-right">Leads</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.attribution.map((row, i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
                                            <td className="p-2">{row.source || '(Direct/None)'}</td>
                                            <td className="p-2 text-right font-bold">{row.count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500 italic">No data for this period.</p>
                        )}
                    </Card>
                    <p className="text-xs text-gray-400 mt-2">* Some metrics require CRM schema updates (Phase 5.6)</p>
                </div>
            )}
        </div>
    );
};

const LeadListView = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLeads = async () => {
            setLoading(true);
            try {
                const res = await axios.get('/api/leads-list');
                setLeads(res.data.leads || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeads();
    }, []);

    if (loading) return <div className="p-4">Loading Leads...</div>;

    return (
        <Card>
            <h3 className="mb-4 text-lg font-bold">Recent 50 Leads (Syncs with Zoho)</h3>
            <div style={{ overflowX: 'auto' }}>
                <table className="w-full text-left border-collapse" style={{ fontSize: '0.9em' }}>
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Mobile</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Source</th>
                            <th className="p-2 border">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="p-2 border">{lead.Last_Name}</td>
                                <td className="p-2 border">******{String(lead.Mobile).slice(-4)}</td>
                                <td className="p-2 border">
                                    <span className={`px-2 py-1 rounded text-xs ${lead.Lead_Status === 'Converted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {lead.Lead_Status || 'New'}
                                    </span>
                                </td>
                                <td className="p-2 border">{lead.Lead_Source}</td>
                                <td className="p-2 border">{new Date(lead.Created_Time).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-gray-500 mt-4">* Mobile masked for privacy. View full details in Zoho CRM.</p>
        </Card>
    );
};

const Admin = () => {
    const { config, refreshConfig } = useContext(ConfigContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ loading: false, msg: '' });
    const [activeTab, setActiveTab] = useState('insights'); // 'insights' | 'global' | 'home'

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

    // --- Idle Timer Logic ---
    const { isIdle, isPrompted, remaining } = useIdleTimer({
        timeout: 900000,       // 15 Minutes
        promptTimeout: 840000, // 14 Minutes
        onIdle: () => {
            if (isAuthenticated) {
                console.log("Idle Timeout - Logging out");
                handleLogout();
            }
        }
    });

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
        <div className="page-admin container relative">
            {/* Idle Warning Modal */}
            {isPrompted && isAuthenticated && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Card style={{ maxWidth: '400px', textAlign: 'center' }}>
                        <h2 className="text-red-500">Session Expiring</h2>
                        <p>You have been inactive for a while.</p>
                        <p className="text-2xl font-bold my-4">{remaining}s</p>
                        <p>Move your mouse or click to stay logged in.</p>
                    </Card>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1>Admin Dashboard</h1>
                <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </div>
            <p className="text-sm mb-4">Status: Node 24.x | Vercel KV Active</p>
            {status.msg && <div className="alert-box mb-4">{status.msg}</div>}

            <div className="admin-tabs" style={{ marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                <button
                    style={{ padding: '10px 20px', fontWeight: activeTab === 'insights' ? 'bold' : 'normal' }}
                    onClick={() => setActiveTab('insights')}
                >Insights</button>
                <button
                    style={{ padding: '10px 20px', fontWeight: activeTab === 'insights' ? 'bold' : 'normal' }}
                    onClick={() => setActiveTab('insights')}
                >Insights</button>
                <button
                    style={{ padding: '10px 20px', fontWeight: activeTab === 'leads' ? 'bold' : 'normal' }}
                    onClick={() => setActiveTab('leads')}
                >Recent Leads</button>
                <button
                    style={{ padding: '10px 20px', fontWeight: activeTab === 'global' ? 'bold' : 'normal' }}
                    onClick={() => setActiveTab('global')}
                >Global Settings</button>
                <button
                    style={{ padding: '10px 20px', fontWeight: activeTab === 'home' ? 'bold' : 'normal' }}
                    onClick={() => setActiveTab('home')}
                >Home Page Editor</button>
                <button
                    style={{ padding: '10px 20px', fontWeight: activeTab === 'tracking' ? 'bold' : 'normal' }}
                    onClick={() => setActiveTab('tracking')}
                >Tracking</button>
            </div>

            {activeTab === 'insights' && (
                <InsightsDashboard />
            )}

            {activeTab === 'leads' && (
                <LeadListView />
            )}

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

