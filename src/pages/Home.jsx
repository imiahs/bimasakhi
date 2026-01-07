import React, { useContext, useEffect } from 'react';
import Hero from '../components/sections/Hero';
import Benefits from '../components/sections/Benefits';
import { ConfigContext } from '../context/ConfigContext';
import { UserContext } from '../context/UserContext';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Home = () => {
    const { config } = useContext(ConfigContext);
    const { markPageVisited, setSource } = useContext(UserContext);

    useEffect(() => {
        markPageVisited('home');
        setSource('website');
    }, []);

    return (
        <div className="page-home">
            <Hero
                title="Become a Bima Sakhi"
                subtitle="A dignified career for women in Delhi NCR with unlimited income potential."
                ctaText={config.ctaText} // "Apply on WhatsApp"
                ctaLink="/why" // Flow: Home -> Why
            />

            <Benefits />

            <section className="cta-section container text-center">
                <p>Ready to understand the profession?</p>
                <Link to="/why">
                    <Button variant="primary">Start Your Journey</Button>
                </Link>
            </section>
        </div>
    );
};

export default Home;
