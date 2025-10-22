import React, { useState, useEffect } from 'react';
import LanguageSelection from './components/LanguageSelection';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface.AI';
import ResumePreview from './components/ResumePreview';
import { translations } from './utils/translations';

function App() {
    const [language, setLanguage] = useState('en');
    const [languageSelected, setLanguageSelected] = useState(false);
    const [showApp, setShowApp] = useState(false);
    const [resumeData, setResumeData] = useState({
        personalInfo: {},
        skills: [],
        experience: [],
        certifications: [],
        education: []
    });
    const [showPreview, setShowPreview] = useState(false);

    // Auto-reset: Clear localStorage on fresh session start
    useEffect(() => {
        localStorage.removeItem('resumeData');
        console.log('Session started: localStorage cleared for fresh resume');
    }, []);

    useEffect(() => {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
    }, [resumeData]);

    const t = translations[language];

    // Step 1: Language Selection
    if (!languageSelected) {
        return <LanguageSelection onLanguageSelect={(lang) => {
            setLanguage(lang);
            setLanguageSelected(true);
        }} />;
    }

    // Step 2: Landing Page
    if (!showApp) {
        return <LandingPage onGetStarted={() => setShowApp(true)} language={language} setLanguage={setLanguage} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-indigo-600">
                                {t.title}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
                        </div>
                        <div className="relative">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="px-4 py-2 pr-8 bg-white border-2 border-indigo-300 text-gray-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer appearance-none"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी (Hindi)</option>
                                <option value="or">ଓଡ଼ିଆ (Odia)</option>
                            </select>
                            <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-indigo-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chat Interface */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <ChatInterface
                            language={language}
                            resumeData={resumeData}
                            setResumeData={setResumeData}
                            onShowPreview={() => setShowPreview(true)}
                        />
                    </div>

                    {/* Resume Preview */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <ResumePreview
                            language={language}
                            resumeData={resumeData}
                            showPreview={showPreview}
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white mt-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        {t.footer} | 100% Free & Open Source
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
