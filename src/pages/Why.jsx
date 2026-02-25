// ============================================
// Why.jsx
// Purpose: Explain Why Bima Sakhi LIC Career is Worth It
// Hybrid SEO: 60% English + 40% Hindi Emotional Hooks
// ============================================

import React, { useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import SEOHead from "../components/core/SEOHead";

const Why = () => {
    const { markPageVisited } = useContext(UserContext);

    useEffect(() => {
        markPageVisited("why");
    }, [markPageVisited]);

    return (
        <div className="page-why container">

            {/* ===== SEO HEAD ===== */}
            <SEOHead
                title="Why Become Bima Sakhi? – LIC Career Benefits & Mahilaon Ke Liye Income Opportunity"
                description="Discover why becoming a Bima Sakhi LIC agent is a smart career move for women in Delhi NCR. Flexible income, ghar se kaam, social respect aur long-term financial growth."
                path="/why"
                ogImage="/images/bima_sakhi_ai.png"
            />

            {/* ===== PAGE HEADING ===== */}
            <h1>Why Become Bima Sakhi? – LIC Career with Freedom & Respect</h1>

            {/* ===== INTRO BLOCK ===== */}
            <Card className="content-block">
                <h3>More Than Just a Job – Yeh Aapka Apna Career Hai</h3>
                <p>
                    This is not a fixed 9-to-5 job. As a Bima Sakhi LIC Agent, you build
                    your own business. Aap apne hours decide karte hain, apne clients choose
                    karte hain, aur apni income growth control karte hain.
                </p>
            </Card>

            {/* ===== SOCIAL RESPECT BLOCK ===== */}
            <Card className="content-block">
                <h3>Social Respect & Trusted Identity</h3>
                <p>
                    LIC agent banna sirf earning ka source nahi hai — yeh ek zimmedari hai.
                    You help families secure their future. Aap apne samaj me ek trusted advisor
                    ban jaate hain, jisse izzat aur pehchaan dono milti hai.
                </p>
            </Card>

            {/* ===== FLEXIBILITY BLOCK ===== */}
            <Card className="content-block">
                <h3>Flexible Work – Perfect for Women in Delhi NCR</h3>
                <p>
                    Manage your household responsibilities while building a strong income.
                    School meetings, family functions aur personal time sab balance ho sakta hai.
                    Yeh career aapko work-life balance deta hai without sacrificing growth.
                </p>
            </Card>

            {/* ===== FINANCIAL GROWTH BLOCK ===== */}
            <Card className="content-block">
                <h3>Unlimited Commission-Based Income Potential</h3>
                <p>
                    LIC agency is commission-based. Jitna performance, utni income.
                    3 saal tak stipend support, structured training aur long-term renewal income
                    se aap sustainable financial independence build kar sakte hain.
                </p>
            </Card>

            {/* ===== SECURITY BLOCK ===== */}
            <Card className="content-block">
                <h3>Government-Backed Trust with LIC</h3>
                <p>
                    LIC ek trusted government-backed institution hai. Bima Sakhi program
                    ke through aapko structured onboarding, guidance aur growth support milta hai.
                </p>
            </Card>

            {/* ===== CTA SECTION ===== */}
            <div className="action-area">
                <Link to="/income">
                    <Button variant="primary">
                        Next: Understand Income Structure →
                    </Button>
                </Link>
            </div>

        </div>
    );
};

export default Why;