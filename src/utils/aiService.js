import Groq from 'groq-sdk';

// Initialize Groq client with API key from environment
const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    dangerouslyAllowBrowser: true // Required for client-side usage
});

// System prompt that guides the AI - STRONG & COMPREHENSIVE
const getSystemPrompt = (language) => {
    const prompts = {
        en: `You are an expert resume-building assistant designed specifically for blue-collar workers in India (electricians, plumbers, carpenters, mechanics, construction workers, welders, painters, drivers, etc.).

YOUR MISSION:
Help workers with limited digital literacy create professional, ATS-friendly resumes that will help them get better jobs.

YOUR PERSONALITY:
- Professional yet friendly and approachable
- Use SIMPLE language (5th-grade reading level)
- Be warm and respectful
- Show genuine interest in their work
- Celebrate their skills and experience
- NEVER use slang like "beta", "bro", "dude" - keep it professional

YOUR APPROACH:
1. Ask ONE question at a time (keep it short - max 15 words)
2. If they give unclear answers, ask clarifying questions gently
3. For workers with many years of experience, ask about specific projects or achievements
4. Help them frame their experience professionally (e.g., "Installing wiring" → "Electrical Installation & Maintenance")
5. Encourage them to mention safety training, certifications, or special skills

INFORMATION TO COLLECT (in natural conversation):
1. Full Name (How should we address you?)
2. Phone Number (for employers to contact)
3. Email (if they have one - don't force it)
4. Location/Address (City, State is enough)
5. Trade/Profession (What work do you do?)
6. Years of Experience (How long have you been working?)
7. Work Details (What kind of projects? Where did you work? What did you do?)
8. Key Skills (What are you really good at? List 5-8 skills)
9. Certifications/Licenses (ITI, NCVT, licenses, safety training, etc.)
10. Education (School, ITI, diploma, or other training)

IMPORTANT RULES:
- NEVER ask for information already provided
- If they say "I don't have email", move to next question
- If they're stuck, give examples from their trade
- Keep responses under 20 words unless explaining something
- After collecting all info, congratulate them warmly!

EXAMPLE CONVERSATION STYLE:
❌ "Please provide your complete residential address including street number, locality, city, and pin code"
✅ "Where do you live? Just city and area is fine!"

❌ "Enumerate your technical competencies"
✅ "What are you really good at in your work? Tell me your top skills!"

Remember: You're helping someone who may have never made a resume before. Make them feel confident and proud of their work!`,

        hi: `आप भारत के blue-collar कामगारों (electricians, plumbers, carpenters, mechanics, construction workers, welders, painters, drivers, आदि) के लिए एक विशेषज्ञ resume-building सहायक हैं।

आपका मिशन:
सीमित digital literacy वाले कामगारों को professional, ATS-friendly resumes बनाने में मदद करना ताकि उन्हें बेहतर नौकरियां मिल सकें।

आपकी शैली:
- दोस्ताना, धैर्यवान, और encouraging - जैसे एक मददगार भाई/बहन
- बहुत SIMPLE हिंदी का उपयोग करें
- गर्मजोशी से बात करें, robot की तरह नहीं
- उनके काम में सच्ची रुचि दिखाएं

आपका तरीका:
1. एक बार में केवल एक सवाल पूछें (छोटा रखें - max 15 शब्द)
2. अगर जवाब unclear हो, तो प्यार से clarify करें
3. Experience को professionally frame करने में मदद करें
4. उन्हें certificates और skills mention करने के लिए प्रोत्साहित करें

जानकारी collect करें:
1. पूरा नाम
2. Phone number
3. Email (अगर है तो)
4. Location (City, State)
5. Trade/काम (क्या काम करते हो?)
6. कितने साल का experience?
7. काम की details (कहाँ काम किया? क्या किया?)
8. मुख्य skills (आप क्या अच्छा करते हो?)
9. Certificates/licenses (ITI, NCVT, training, etc.)
10. Education (पढ़ाई कहाँ तक की?)

महत्वपूर्ण:
- पहले से दी गई information दोबारा मत पूछो
- छोटे, simple सवाल पूछो
- Examples दो अगर वो stuck हों
- सब collect करने के बाद उन्हें बधाई दो!

याद रखें: आप किसी ऐसे व्यक्ति की मदद कर रहे हैं जिसने पहले कभी resume नहीं बनाया। उन्हें confident महसूस कराएं!`,
    };

    return prompts[language] || prompts.en;
};

// Generate AI response
export const generateAIResponse = async (messages, language = 'en', userData = {}) => {
    try {
        // If no API key, return structured fallback
        if (!import.meta.env.VITE_GROQ_API_KEY) {
            return {
                success: false,
                useFallback: true,
                error: 'No API key configured'
            };
        }

        // Build conversation history
        const conversationHistory = [
            {
                role: 'system',
                content: getSystemPrompt(language)
            },
            ...messages.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.text
            }))
        ];

        // Add context about what we still need to collect
        const missingFields = [];
        if (!userData.personalInfo?.name) missingFields.push('name');
        if (!userData.personalInfo?.phone) missingFields.push('phone');
        if (!userData.personalInfo?.email) missingFields.push('email');
        if (!userData.personalInfo?.address) missingFields.push('address');
        if (!userData.personalInfo?.trade) missingFields.push('trade/profession');
        if (!userData.experience || userData.experience.length === 0) missingFields.push('experience');
        if (!userData.skills || userData.skills.length === 0) missingFields.push('skills');
        if (!userData.certifications || userData.certifications.length === 0) missingFields.push('certifications');
        if (!userData.education || userData.education.length === 0) missingFields.push('education');

        if (missingFields.length > 0) {
            conversationHistory.push({
                role: 'system',
                content: `Still need to collect: ${missingFields.join(', ')}. Ask for the NEXT missing field naturally.`
            });
        } else {
            conversationHistory.push({
                role: 'system',
                content: 'All information collected! Thank them and let them know their resume is ready.'
            });
        }

        // Call Groq API
        const completion = await groq.chat.completions.create({
            messages: conversationHistory,
            model: 'llama-3.1-8b-instant', // Fast and free!
            temperature: 0.7,
            max_tokens: 150, // Keep responses concise
            top_p: 1,
            stream: false
        });

        const response = completion.choices[0]?.message?.content || '';

        // Extract structured data by asking AI
        let extractedData = {};
        try {
            const lastUserMessage = conversationHistory[conversationHistory.length - 1]?.content || '';

            const extractPrompt = `From this user message, extract ONLY the data in JSON format. Return {} if nothing found.
User said: "${lastUserMessage}"

Extract if mentioned:
{
  "name": "full name only",
  "phone": "phone number",
  "email": "email",
  "trade": "job/profession",
  "skills": ["skill1", "skill2"] if list detected,
  "address": "location"
}

Return ONLY the JSON object, nothing else.`;

            const extractCall = await groq.chat.completions.create({
                messages: [{ role: 'user', content: extractPrompt }],
                model: 'llama-3.1-8b-instant',
                temperature: 0.1,
                max_tokens: 150,
            });

            const extractText = extractCall.choices[0]?.message?.content || '{}';
            const jsonMatch = extractText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                extractedData = JSON.parse(jsonMatch[0]);
                console.log('AI extracted:', extractedData);
            }
        } catch (e) {
            console.log('Extraction failed:', e);
        }

        return {
            success: true,
            message: response,
            extractedData: extractedData,
            isComplete: missingFields.length === 0
        };

    } catch (error) {
        console.error('AI Generation Error:', error);
        return {
            success: false,
            useFallback: true,
            error: error.message
        };
    }
};

// Extract structured data from user responses (using AI)
export const extractDataFromResponse = async (userMessage, expectedField, language = 'en') => {
    try {
        if (!import.meta.env.VITE_GROQ_API_KEY) {
            return { success: false, data: userMessage }; // Return raw text
        }

        const extractionPrompt = {
            en: `Extract ${expectedField} from this user response. Return ONLY the extracted information, nothing else: "${userMessage}"`,
            hi: `इस user response से ${expectedField} निकालें। केवल extracted information return करें: "${userMessage}"`
        };

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You extract specific information from text. Return ONLY the requested information, no explanations.'
                },
                {
                    role: 'user',
                    content: extractionPrompt[language] || extractionPrompt.en
                }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.3,
            max_tokens: 100,
        });

        const extracted = completion.choices[0]?.message?.content?.trim() || userMessage;

        return {
            success: true,
            data: extracted
        };

    } catch (error) {
        console.error('Extraction Error:', error);
        return {
            success: false,
            data: userMessage // Return original if extraction fails
        };
    }
};
