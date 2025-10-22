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

    useEffect(() => {
        console.log('👁️ showPreview changed to:', showPreview);
    }, [showPreview]);

    // Auto-reset: Clear localStorage on fresh session start
    useEffect(() => {
        localStorage.removeItem('resumeData');
        console.log('Session started: localStorage cleared for fresh resume');
    }, []);

    useEffect(() => {
        localStorage.setItem('resumeData', JSON.stringify(resumeData));
        console.log('📝 ResumeData updated:', resumeData);
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
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
            {/* Header */}
            <header className="bg-white/10 backdrop-blur-md shadow-lg border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {t.title}
                            </h1>
                            <p className="text-sm text-white/80 mt-1">{t.subtitle}</p>
                        </div>
                        <div className="relative">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="px-4 py-2 pr-8 bg-white/90 backdrop-blur-sm border-2 border-white text-gray-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-white cursor-pointer appearance-none shadow-lg"
                            >
                                <option value="en">English</option>
                                <option value="hi">हिंदी (Hindi)</option>
                                <option value="or">ଓଡ଼ିଆ (Odia)</option>
                            </select>
                            <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome Banner */}
                <div className="bg-white/15 backdrop-blur-md rounded-xl p-4 mb-6 border border-white/20 shadow-lg">
                    <p className="text-white text-center text-sm sm:text-base font-medium">
                        💬 <strong>Chat with AI</strong> to create your professional resume in minutes!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chat Interface */}
                    <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/20 hover:shadow-3xl transition-shadow duration-300">
                        <ChatInterface
                            language={language}
                            resumeData={resumeData}
                            setResumeData={setResumeData}
                            onShowPreview={() => setShowPreview(true)}
                        />
                    </div>

                    {/* Resume Preview */}
                    <div className="bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/20 hover:shadow-3xl transition-shadow duration-300">
                        <ResumePreview
                            language={language}
                            resumeData={resumeData}
                            showPreview={showPreview}
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white/10 backdrop-blur-md mt-12 border-t border-white/20">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <p className="text-center text-white/90 text-sm">
                        {t.footer} | 100% Free & Open Source
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
