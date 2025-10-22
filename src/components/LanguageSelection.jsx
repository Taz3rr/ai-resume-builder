import React from 'react';
import { translations } from '../utils/translations';

const LanguageSelection = ({ onLanguageSelect }) => {
    const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
        { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
        { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
        { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
        { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
        { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
        { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
        { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
        { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">
                        Choose Your Language
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-2">
                        अपनी भाषा चुनें
                    </p>
                    <p className="text-lg text-white/80">
                        Select the language you're comfortable with
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 animate-slideUp">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onLanguageSelect(lang.code)}
                            className="bg-white/95 backdrop-blur-sm hover:bg-white hover:scale-105 active:scale-95 
                                     transition-all duration-300 rounded-2xl p-6 shadow-xl hover:shadow-2xl
                                     border-2 border-transparent hover:border-white
                                     flex flex-col items-center justify-center gap-3 group"
                        >
                            <div className="text-4xl font-bold text-indigo-600 group-hover:text-purple-600 transition-colors">
                                {lang.nativeName}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                                {lang.name}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-center text-white/70 text-sm">
                    <p>✨ All languages supported with voice input & text-to-speech</p>
                </div>
            </div>
        </div>
    );
};

export default LanguageSelection;
