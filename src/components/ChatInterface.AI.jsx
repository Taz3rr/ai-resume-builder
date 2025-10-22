import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../utils/translations';
import { speakTextGoogle, stopSpeaking as stopGoogleSpeaking } from '../utils/textToSpeech';
import { generateAIResponse } from '../utils/aiService';

const ChatInterface = ({ language, resumeData, setResumeData, onShowPreview }) => {
    const t = translations[language];
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [currentStep, setCurrentStep] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [speakingMessageId, setSpeakingMessageId] = useState(null);
    const [isAIMode, setIsAIMode] = useState(true); // Try AI first
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const steps = ['welcome', 'phone', 'email', 'address', 'trade', 'experience', 'skills', 'certifications', 'education', 'complete'];

    useEffect(() => {
        // Initialize with AI welcome message
        initializeChat();
    }, []);

    const initializeChat = async () => {
        if (isAIMode) {
            const result = await generateAIResponse([], language, resumeData);

            if (result.success) {
                setMessages([{ type: 'bot', text: result.message }]);
            } else {
                // Fallback to structured
                setIsAIMode(false);
                setMessages([{ type: 'bot', text: t.questions.welcome }]);
            }
        } else {
            setMessages([{ type: 'bot', text: t.questions.welcome }]);
        }
    };

    useEffect(() => {
        // Update messages when language changes (only in structured mode)
        if (!isAIMode) {
            const currentStepName = steps[currentStep];
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.type === 'bot') {
                const newMessages = [...messages];
                newMessages[newMessages.length - 1] = {
                    type: 'bot',
                    text: t.questions[currentStepName]
                };
                setMessages(newMessages);
            }
        }
    }, [language]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            const langCodes = {
                en: 'en-US',
                hi: 'hi-IN',
                or: 'or-IN',
                mr: 'mr-IN',
                ta: 'ta-IN',
                te: 'te-IN',
                bn: 'bn-IN',
                gu: 'gu-IN',
                kn: 'kn-IN',
                pa: 'pa-IN'
            };
            recognitionRef.current.lang = langCodes[language] || 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => {
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, [language]);

    const startVoiceInput = () => {
        if (recognitionRef.current) {
            setIsListening(true);
            recognitionRef.current.start();
        } else {
            alert('Voice input is not supported in your browser. Please use Chrome or Edge.');
        }
    };

    const speakText = (text, messageId) => {
        setSpeakingMessageId(messageId);

        speakTextGoogle(
            text,
            language,
            () => { },
            () => {
                setSpeakingMessageId(null);
            },
            (error) => {
                console.error('TTS Error:', error);
                setSpeakingMessageId(null);
            }
        );
    };

    const stopSpeaking = () => {
        stopGoogleSpeaking();
        setSpeakingMessageId(null);
    };

    const handleSend = async () => {
        if (!input.trim() || isProcessing) return;

        const userMessage = { type: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsProcessing(true);

        if (isAIMode) {
            // AI Mode
            await processWithAI(userMessage);
        } else {
            // Structured Mode
            processStructured(input);
        }

        setIsProcessing(false);
    };

    const processWithAI = async (userMessage) => {
        const currentMessages = [...messages, userMessage];

        // Generate AI response
        const result = await generateAIResponse(currentMessages, language, resumeData);

        if (result.useFallback) {
            // AI failed, switch to structured
            console.log('AI failed, switching to structured mode');
            setIsAIMode(false);
            processStructured(userMessage.text);
            return;
        }

        if (result.success) {
            // Add AI response
            setMessages(prev => [...prev, { type: 'bot', text: result.message }]);

            // Try to extract and update resume data intelligently
            updateResumeDataFromAI(userMessage.text, currentMessages);

            // Check if complete
            if (result.isComplete) {
                onShowPreview();
            }
        }
    };

    const updateResumeDataFromAI = (userText, conversationHistory) => {
        // Simple pattern matching to update resume data
        const text = userText.toLowerCase();

        // Detect what information is being provided
        if (conversationHistory.length <= 2 && !resumeData.personalInfo?.name) {
            // First response is likely the name
            setResumeData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, name: userText }
            }));
        } else if (/@/.test(text)) {
            // Contains @ symbol, likely email
            const emailMatch = userText.match(/[\w.-]+@[\w.-]+\.\w+/);
            if (emailMatch) {
                setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: emailMatch[0] }
                }));
            }
        } else if (/\d{10}|\+\d{2}\s?\d{10}|\d{5}\s?\d{5}/.test(text)) {
            // Contains phone pattern
            const phoneMatch = userText.match(/[\d\s+-]+/);
            if (phoneMatch) {
                setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: phoneMatch[0].trim() }
                }));
            }
        } else if (/electrician|plumber|carpenter|mechanic|welder|mason|painter|driver/.test(text)) {
            // Contains trade keywords
            setResumeData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, trade: userText }
            }));
        } else if (/\d+\s*(years?|yrs?|yr)/.test(text)) {
            // Contains experience duration
            setResumeData(prev => ({
                ...prev,
                experience: prev.experience.length > 0
                    ? [{ description: prev.experience[0].description + ' ' + userText }]
                    : [{ description: userText }]
            }));
        } else if (text.includes(',') || text.includes('and')) {
            // List format, could be skills or certifications
            const items = userText.split(/,|and/).map(s => s.trim()).filter(s => s);
            if (!resumeData.skills || resumeData.skills.length === 0) {
                setResumeData(prev => ({ ...prev, skills: items }));
            } else if (!resumeData.certifications || resumeData.certifications.length === 0) {
                setResumeData(prev => ({ ...prev, certifications: items }));
            }
        }
    };

    const processStructured = (text) => {
        const stepName = steps[currentStep];

        // Update resume data based on current step
        switch (stepName) {
            case 'welcome':
                setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, name: text }
                }));
                break;
            case 'phone':
                setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: text }
                }));
                break;
            case 'email':
                setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: text }
                }));
                break;
            case 'address':
                setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, address: text }
                }));
                break;
            case 'trade':
                setResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, trade: text }
                }));
                break;
            case 'experience':
                setResumeData(prev => ({
                    ...prev,
                    experience: [{ description: text }]
                }));
                break;
            case 'skills':
                setResumeData(prev => ({
                    ...prev,
                    skills: text.split(',').map(s => s.trim()).filter(s => s)
                }));
                break;
            case 'certifications':
                setResumeData(prev => ({
                    ...prev,
                    certifications: text.split(',').map(s => s.trim()).filter(s => s)
                }));
                break;
            case 'education':
                setResumeData(prev => ({
                    ...prev,
                    education: [{ description: text }]
                }));
                break;
        }

        // Move to next step
        if (currentStep < steps.length - 1) {
            setTimeout(() => {
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                const nextStepName = steps[nextStep];
                setMessages(prev => [...prev, { type: 'bot', text: t.questions[nextStepName] }]);

                if (nextStepName === 'complete') {
                    onShowPreview();
                }
            }, 500);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const fillSampleData = () => {
        const sampleData = {
            personalInfo: {
                name: 'Rajesh Kumar',
                phone: '+91 98765 43210',
                email: 'rajesh.kumar@email.com',
                address: 'Mumbai, Maharashtra, India',
                trade: 'Certified Electrician'
            },
            skills: ['Electrical Installation', 'Circuit Testing', 'Blueprint Reading', 'Safety Compliance', 'Troubleshooting', 'Maintenance'],
            experience: [{ description: '5 years at Maharashtra State Electricity Board - Installed and maintained electrical systems, performed routine inspections, troubleshot electrical issues, ensured safety compliance on all projects' }],
            certifications: ['ITI Certificate in Electrician', 'NCVT Certificate', 'High Voltage License', 'Safety Training Certificate'],
            education: [{ description: 'ITI Diploma in Electrical Engineering, Government ITI Mumbai, 2018' }]
        };
        setResumeData(sampleData);
        setCurrentStep(steps.length - 1);
        setMessages([
            { type: 'bot', text: t.questions.welcome },
            { type: 'user', text: sampleData.personalInfo.name },
            { type: 'bot', text: t.questions.complete }
        ]);
        onShowPreview();
    };

    const resetResume = () => {
        if (window.confirm('Are you sure you want to start over? All current data will be lost.')) {
            setResumeData({
                personalInfo: {},
                skills: [],
                experience: [],
                certifications: [],
                education: []
            });
            setCurrentStep(0);
            setMessages([]);
            setInput('');
            localStorage.removeItem('resumeData');
            initializeChat();
        }
    };

    return (
        <div className="flex flex-col h-[600px]">
            <div className="flex gap-2 mb-3">
                <button
                    onClick={fillSampleData}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    {t.fillSample}
                </button>
                <button
                    onClick={resetResume}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    {language === 'hi' && 'रीसेट'}
                    {language === 'or' && 'ରିସେଟ୍'}
                    {language === 'mr' && 'रीसेट'}
                    {language === 'ta' && 'மீட்டமை'}
                    {language === 'te' && 'రీసెట్'}
                    {language === 'bn' && 'রিসেট'}
                    {language === 'gu' && 'રીસેટ'}
                    {language === 'kn' && 'ಮರುಹೊಂದಿಸು'}
                    {language === 'pa' && 'ਰੀਸੈੱਟ'}
                    {language === 'en' && 'Reset'}
                </button>
            </div>

            {/* Mode Indicator */}
            <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                <span>
                    {isAIMode ? '🤖 AI Mode' : '📋 Structured Mode'}
                </span>
                {!isAIMode && (
                    <span className="text-indigo-600 font-medium">
                        {Math.round((currentStep / (steps.length - 1)) * 100)}%
                    </span>
                )}
            </div>

            {/* Progress Indicator (only in structured mode) */}
            {!isAIMode && (
                <div className="mb-3 bg-white rounded-lg p-3 shadow-sm">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-slideUp`}
                    >
                        <div className="flex items-start gap-2 max-w-[80%]">
                            <div
                                className={`px-4 py-3 rounded-lg ${msg.type === 'user'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-gray-800 shadow-md'
                                    }`}
                            >
                                {msg.text}
                            </div>
                            {msg.type === 'bot' && (
                                <button
                                    onClick={() => speakingMessageId === idx ? stopSpeaking() : speakText(msg.text, idx)}
                                    className={`p-2 rounded-full transition-all ${speakingMessageId === idx
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                                        }`}
                                    title={speakingMessageId === idx ? 'Stop' : 'Listen'}
                                >
                                    {speakingMessageId === idx ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {isProcessing && (
                    <div className="flex justify-start">
                        <div className="px-4 py-3 rounded-lg bg-white text-gray-800 shadow-md">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                <span>Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={startVoiceInput}
                    disabled={isListening || isProcessing}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isListening
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`}
                    title={t.voiceInput}
                >
                    {isListening ? '🔴 Listening...' : '🎤'}
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isProcessing ? 'Please wait...' : t.typeHere}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                />
                <button
                    onClick={handleSend}
                    disabled={isProcessing}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                >
                    {t.send}
                </button>
            </div>
        </div>
    );
};

export default ChatInterface;
