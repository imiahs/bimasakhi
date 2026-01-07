import React, { useState, useContext } from 'react';
import { ConfigContext } from '../context/ConfigContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Admin = () => {
    const { config, updateConfig } = useContext(ConfigContext);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const [formData, setFormData] = useState({
        delhiOnlyMessage: config.delhiOnlyMessage,
        ctaText: config.ctaText
    });

    const handleLogin = () => {
        if (password === 'admin123') setIsAuthenticated(true);
        else alert('Invalid Password');
    };

    const handleConfigSave = () => {
        updateConfig(formData);
        alert('Configuration Saved');
    };

    if (!isAuthenticated) {
        return (
            <div className="container py-8 text-center">
                <h1>Admin Access</h1>
                <div style={{ maxWidth: '300px', margin: 'auto' }}>
                    <Input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleLogin}>Login</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-admin container">
            <h1>Admin Dashboard</h1>

            <div className="grid-2-col">
                <Card>
                    <h2>Kill Switches</h2>
                    <div className="toggle-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={config.isAppPaused}
                                onChange={(e) => updateConfig({ isAppPaused: e.target.checked })}
                            /> Pause All Applications
                        </label>
                    </div>
                    <div className="toggle-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={config.isRedirectPaused}
                                onChange={(e) => updateConfig({ isRedirectPaused: e.target.checked })}
                            /> Pause WhatsApp Redirect
                        </label>
                    </div>
                </Card>

                <Card>
                    <h2>Text Configuration</h2>
                    <Input
                        label="Delhi Only Message"
                        value={formData.delhiOnlyMessage}
                        onChange={(e) => setFormData({ ...formData, delhiOnlyMessage: e.target.value })}
                    />
                    <Input
                        label="CTA Button Text"
                        value={formData.ctaText}
                        onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    />
                    <Button onClick={handleConfigSave}>Save Texts</Button>
                </Card>
            </div>
        </div>
    );
};

export default Admin;
