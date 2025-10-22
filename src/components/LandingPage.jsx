import React from 'react';

const LandingPage = ({ onGetStarted, language, setLanguage }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center px-4">
            <div className="max-w-4xl mx-auto text-center">
                {/* Language Selector - Floating */}
                <div className="absolute top-3 right-3 sm:top-6 sm:right-6">
                    <div className="relative">
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="px-2 py-1.5 pr-7 sm:px-4 sm:py-2 sm:pr-10 bg-white/90 backdrop-blur-sm border-2 border-white text-gray-700 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-white cursor-pointer appearance-none shadow-lg text-sm sm:text-base"
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="or">ଓଡ଼ିଆ (Odia)</option>
                            <option value="mr">मराठी (Marathi)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="bn">বাংলা (Bengali)</option>
                            <option value="gu">ગુજરાતી (Gujarati)</option>
                            <option value="kn">ಕನ್ನಡ (Kannada)</option>
                            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                        </select>
                        <svg className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-blue-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="animate-fade-in">
                    {/* Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="bg-white rounded-full p-6 shadow-2xl">
                            <svg
                                className="w-20 h-20 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                        AI Resume Builder
                    </h1>
                    <p className="text-2xl md:text-3xl text-white/90 mb-4 font-medium">
                        {language === 'hi' && 'ब्लू-कॉलर पेशेवरों के लिए'}
                        {language === 'or' && 'ବ୍ଲୁ-କଲର ପେଶାଦାରଙ୍କ ପାଇଁ'}
                        {language === 'mr' && 'ब्लू-कॉलर व्यावसायिकांसाठी'}
                        {language === 'ta' && 'நீல காலர் வல்லுநர்களுக்காக'}
                        {language === 'te' && 'బ్లూ-కాలర్ నిపుణుల కోసం'}
                        {language === 'bn' && 'ব্লু-কলার পেশাদারদের জন্য'}
                        {language === 'gu' && 'બ્લુ-કોલર વ્યાવસાયિકો માટે'}
                        {language === 'kn' && 'ನೀಲಿ ಕಾಲರ್ ವೃತ್ತಿಪರರಿಗಾಗಿ'}
                        {language === 'pa' && 'ਬਲੂ-ਕਾਲਰ ਪੇਸ਼ੇਵਰਾਂ ਲਈ'}
                        {language === 'en' && 'For Blue-Collar Professionals'}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
                        <div className="bg-white/15 backdrop-blur-lg rounded-xl p-5 text-white hover:bg-white/25 transition-all duration-300 hover:scale-105 cursor-default border border-white/20 shadow-lg">
                            <div className="text-4xl mb-2">🎤</div>
                            <p className="text-sm font-semibold">Voice Input</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-lg rounded-xl p-5 text-white hover:bg-white/25 transition-all duration-300 hover:scale-105 cursor-default border border-white/20 shadow-lg">
                            <div className="text-4xl mb-2">🤖</div>
                            <p className="text-sm font-semibold">AI-Powered</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-lg rounded-xl p-5 text-white hover:bg-white/25 transition-all duration-300 hover:scale-105 cursor-default border border-white/20 shadow-lg">
                            <div className="text-4xl mb-2">📱</div>
                            <p className="text-sm font-semibold">Mobile First</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-lg rounded-xl p-5 text-white hover:bg-white/25 transition-all duration-300 hover:scale-105 cursor-default border border-white/20 shadow-lg">
                            <div className="text-4xl mb-2">🔒</div>
                            <p className="text-sm font-semibold">100% Private</p>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={onGetStarted}
                        className="group relative bg-white text-blue-600 px-12 py-5 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto animate-pulse hover:animate-none"
                    >
                        <span>
                            {language === 'hi' && 'शुरू करें'}
                            {language === 'or' && 'ଆରମ୍ଭ କରନ୍ତୁ'}
                            {language === 'mr' && 'सुरू करा'}
                            {language === 'ta' && 'தொடங்கு'}
                            {language === 'te' && 'ప్రారంభించు'}
                            {language === 'bn' && 'শুরু করুন'}
                            {language === 'gu' && 'શરૂ કરો'}
                            {language === 'kn' && 'ಪ್ರಾರಂಭಿಸಿ'}
                            {language === 'pa' && 'ਸ਼ੁਰੂ ਕਰੋ'}
                            {language === 'en' && 'Get Started'}
                        </span>
                        <svg
                            className="w-6 h-6 group-hover:translate-x-2 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </button>

                    {/* Sub Text */}
                    <p className="mt-8 text-white/90 text-lg font-medium">
                        {language === 'hi' && '✨ 100% मुफ्त • कोई लॉगिन नहीं • AI-संचालित'}
                        {language === 'or' && '✨ 100% ମାଗଣା • କୌଣସି ଲଗଇନ୍ ନାହିଁ • AI-ଚାଳିତ'}
                        {language === 'mr' && '✨ 100% मोफत • लॉगिन नाही • AI-संचालित'}
                        {language === 'ta' && '✨ 100% இலவசம் • உள்நுழைவு இல்லை • AI-இயக்கப்படுகிறது'}
                        {language === 'te' && '✨ 100% ఉచితం • లాగిన్ లేదు • AI-ఆధారితం'}
                        {language === 'bn' && '✨ 100% বিনামূল্যে • কোন লগইন নেই • AI-চালিত'}
                        {language === 'gu' && '✨ 100% મફત • કોઈ લોગિન નથી • AI-સંચાલિત'}
                        {language === 'kn' && '✨ 100% ಉಚಿತ • ಯಾವುದೇ ಲಾಗಿನ್ ಇಲ್ಲ • AI-ನಿರ್ವಹಣೆ'}
                        {language === 'pa' && '✨ 100% ਮੁਫਤ • ਕੋਈ ਲੌਗਇਨ ਨਹੀਂ • AI-ਸੰਚਾਲਿਤ'}
                        {language === 'en' && '✨ 100% Free • No Login Required • AI-Powered'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
