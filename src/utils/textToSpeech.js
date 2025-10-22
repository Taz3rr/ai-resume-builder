// Enhanced Browser Text-to-Speech with Best Voice Selection
// Works offline, no API key needed, completely free!

let currentUtterance = null;
let voicesLoaded = false;
let availableVoices = [];

// Load voices when available
if ('speechSynthesis' in window) {
    const loadVoices = () => {
        availableVoices = window.speechSynthesis.getVoices();
        voicesLoaded = true;
        console.log('Loaded voices:', availableVoices.length);
    };

    // Load voices immediately if available
    loadVoices();

    // Also listen for voiceschanged event (Chrome)
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

// Best voice selection for each language
const getVoiceForLanguage = (language) => {
    const langMap = {
        en: ['en-IN', 'en-US', 'en-GB', 'en'],
        hi: ['hi-IN', 'hi'],
        or: ['hi-IN', 'hi'], // Fallback to Hindi
        mr: ['mr-IN', 'mr'],
        ta: ['ta-IN', 'ta'],
        te: ['te-IN', 'te'],
        bn: ['bn-IN', 'bn'],
        gu: ['gu-IN', 'gu'],
        kn: ['kn-IN', 'kn'],
        pa: ['pa-IN', 'pa']
    };

    const preferredLangs = langMap[language] || ['en-US'];

    // Priority: Google > Microsoft > Apple > Others
    const voicePriority = ['Google', 'Microsoft', 'Apple'];

    for (const provider of voicePriority) {
        for (const lang of preferredLangs) {
            const voice = availableVoices.find(v =>
                v.name.includes(provider) && v.lang.startsWith(lang)
            );
            if (voice) return voice;
        }
    }

    // Fallback: any voice matching the language
    for (const lang of preferredLangs) {
        const voice = availableVoices.find(v => v.lang.startsWith(lang));
        if (voice) return voice;
    }

    return null;
};

// Enhanced browser TTS with intelligent voice selection
const speakWithBrowserTTS = (text, language, onStart, onEnd, onError) => {
    if (!('speechSynthesis' in window)) {
        if (onError) onError(new Error('Speech synthesis not supported'));
        return;
    }

    const synth = window.speechSynthesis;
    synth.cancel(); // Stop any ongoing speech

    // Wait for voices to load if needed
    const speakWhenReady = () => {
        if (!voicesLoaded) {
            availableVoices = synth.getVoices();
            voicesLoaded = true;
        }

        const utterance = new SpeechSynthesisUtterance(text);

        // Get best available voice for the language
        const voice = getVoiceForLanguage(language);
        if (voice) {
            utterance.voice = voice;
            console.log(`Using voice: ${voice.name} (${voice.lang})`);
        }

        // Set language code
        const langMap = {
            en: 'en-US',
            hi: 'hi-IN',
            or: 'hi-IN', // Odia fallback to Hindi
            mr: 'mr-IN',
            ta: 'ta-IN',
            te: 'te-IN',
            bn: 'bn-IN',
            gu: 'gu-IN',
            kn: 'kn-IN',
            pa: 'pa-IN'
        };

        utterance.lang = langMap[language] || 'en-US';
        utterance.rate = 0.85; // Slower = clearer for less literate users
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
            currentUtterance = utterance;
            if (onStart) onStart();
        };

        utterance.onend = () => {
            currentUtterance = null;
            if (onEnd) onEnd();
        };

        utterance.onerror = (event) => {
            currentUtterance = null;
            console.error('Speech synthesis error:', event);
            if (onError) onError(event);
        };

        synth.speak(utterance);
    };

    // Speak immediately or wait for voices
    if (voicesLoaded || availableVoices.length > 0) {
        speakWhenReady();
    } else {
        setTimeout(speakWhenReady, 100);
    }
};

export const speakTextGoogle = async (text, language, onStart, onEnd, onError) => {
    // Use enhanced browser TTS (no API needed!)
    speakWithBrowserTTS(text, language, onStart, onEnd, onError);
};

export const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        currentUtterance = null;
    }
};
