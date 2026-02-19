import React, { useContext } from 'react';
import { LanguageContext } from '../../../../context/LanguageContext';

const IncomeBlock = ({ condensed = false }) => {
    const { language } = useContext(LanguageContext);

    const content = {
        en: {
            title: "Truth about Income & Stipend (Understand First)",
            note: "⚠️ This is NOT a fixed salary job. This is an LIC Agency – Commission Based Profession.",
            points: [
                "Performance-based stipend support may be available initially (as per LIC norms).",
                "Real income comes from Commission, earned on every policy.",
                "Once a client is made → Lifetime Renewal Commission.",
                "The more you work → The more you earn (No Limit)."
            ],
            summary: "👉 If you are looking for a fixed salary job, this is not for you. 👉 If you want a long-term career — this is the right opportunity."
        },
        hi: {
            title: "कमाई और स्टाइपेंड की सच्चाई (पहले समझें)",
            note: "⚠️ यह कोई फिक्स सैलरी वाली नौकरी नहीं है। यह LIC एजेंसी – कमीशन आधारित प्रोफेशन है।",
            points: [
                "शुरुआत में LIC द्वारा परफॉरमेंस-आधारित स्टाइपेंड का प्रावधान हो सकता है (LIC नियमों अनुसार)",
                "असली कमाई कमीशन से होती है, जो हर पॉलिसी पर मिलती है",
                "एक बार ग्राहक बना → लाइफ टाइम रिन्यूअल कमीशन",
                "जितना ज़्यादा काम → उतनी ज़्यादा कमाई (कोई लिमिट नहीं)"
            ],
            summary: "👉 अगर आप फिक्स सैलरी की नौकरी ढूंढ रही हैं, तो यह आपके लिए नहीं है। 👉 अगर आप लंबे समय का करियर चाहती हैं — यह सही मौका है।"
        }
    };

    const t = content[language];

    return (
        <div className="income-block bg-yellow-50 p-6 md:p-8 rounded-2xl my-8 border border-yellow-200">
            {!condensed && <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t.title}</h2>}

            <div className="reality-check bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded-r">
                <p className="text-red-800 font-semibold">
                    {t.note}
                </p>
            </div>

            <ul className="income-points space-y-3 mb-6">
                {t.points.map((point, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                        <span className="text-green-500 font-bold">✓</span>
                        <span>{point}</span>
                    </li>
                ))}
            </ul>

            {!condensed && (
                <p className="income-summary text-center text-gray-600 italic bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    "{t.summary}"
                </p>
            )}
        </div>
    );
};

export default IncomeBlock;
