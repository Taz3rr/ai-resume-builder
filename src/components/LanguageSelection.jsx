import React from 'react';
import { translations } from '../utils/translations';

const LanguageSelection = ({ onLanguageSelect }) => {
    const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
        { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-lg">
                        Choose Your Language
                    </h1>
                    <div className="space-y-3 mb-8">
                        <p className="text-2xl text-white font-semibold">
                            ଆପଣଙ୍କର ଭାଷା ଚୟନ କରନ୍ତୁ
                        </p>
                        <p className="text-2xl text-white font-semibold">
                            अपनी भाषा चुनें
                        </p>
                        <p className="text-xl text-white/90">
                            Select the language you're comfortable with
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideUp max-w-3xl mx-auto">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => onLanguageSelect(lang.code)}
                            className="bg-white/90 backdrop-blur-md hover:bg-white hover:scale-105 active:scale-95 
                                     transition-all duration-300 rounded-2xl p-8 shadow-2xl hover:shadow-3xl
                                     border-2 border-white/20 hover:border-white
                                     flex flex-col items-center justify-center gap-3 group"
                        >
                            <div className="text-5xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">
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
