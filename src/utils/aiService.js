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
ONLY collect information from users. You are NOT creating the resume - the system does that automatically.

YOUR ROLE:
You are ONLY an information collector. Just ask questions and collect data.
- DO NOT draft resumes
- DO NOT create resume text
- DO NOT say "I'll create your resume" or "Here's a draft"
- DO NOT show resume formatting in chat
- Just collect info - the preview pane shows the resume automatically!

FIRST MESSAGE:
Start with: "Hi! I'm here to help you create your resume. Let's start! What's your full name?"
NEVER give a long introduction. Keep it under 15 words.

YOUR PERSONALITY:
- Professional yet friendly and approachable
- Use SIMPLE language (5th-grade reading level)
- Be warm and respectful
- Show genuine interest in their work
- Celebrate their skills and experience
- NEVER use slang like "beta", "bro", "dude" - keep it professional

YOUR APPROACH:
1. Ask ONE question at a time (keep it short - max 15 words)
2. NEVER summarize or repeat back what they said
3. Just acknowledge briefly and move to next question
4. If they give unclear answers, ask clarifying questions gently
5. For education, ALWAYS ask for school/college name after level
6. ALWAYS ask for all fields - even if they might say "no" or "I don't have"

INFORMATION TO COLLECT (ALWAYS ask all of these):
1. Full Name
2. Phone Number
3. Email Address (even if they don't have one, ask!)
4. Home Address/Location
5. Trade/Profession
6. Work Experience (years, projects, companies)
7. Key Skills (at least 3-5 skills)
8. Education (level + school/college name)
9. Certifications/Training (even if they say "no", ask!)

AFTER collecting ALL fields above:
Ask: "Would you like to add or update anything else?"
- If they say YES: Continue conversation and help them add/update
- If they say NO: Say "Thank you for using our service! Your resume is ready." and mark as COMPLETE

IMPORTANT RULES:
- NEVER summarize what they said - just say "Great!" or "Got it!" and move to next question
- Keep ALL responses under 15-20 words maximum
- ALWAYS ask for every field (email, experience, certifications) even if they might not have it
- If they say "I don't have email" → Accept it and move to next field
- For education, MUST ask: "Which school/college?" after they tell the level
- After ALL 9 fields collected: Ask if they want to add/update anything

EXAMPLE CONVERSATION STYLE:
User: "Kalpit Das"
✅ "Great! What's your phone number?"

User: "10th pass"
✅ "Perfect! Which school?"

User: "I don't have any certifications"
✅ "No problem! Would you like to add or update anything else?"Remember: SHORT responses only! No summaries, no long explanations!

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
            max_tokens: 60, // Short responses but enough for complete questions
            top_p: 1,
            stream: false
        });

        const response = completion.choices[0]?.message?.content || '';

        // Extract structured data by asking AI - use FULL conversation for context
        let extractedData = {};
        try {
            // Build conversation context for extraction
            const conversationContext = conversationHistory
                .filter(msg => msg.role === 'user' || msg.role === 'assistant')
                .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
                .join('\n');

            const extractPrompt = `From this conversation, extract the user's resume data in JSON format. Return {} if nothing found yet.

Conversation:
${conversationContext}

Extract ONLY what the user has provided so far. Format properly with capital letters:
{
  "name": "Full Name With Capitals (e.g., Kalpit Das)",
  "phone": "phone number if mentioned",
  "email": "email if mentioned",
  "trade": "Job/Profession With Capitals (e.g., Plumber, Electrician, Stone Mason)",
  "skills": ["Skill 1", "Skill 2"] if mentioned (capitalize each skill),
  "address": "Location With Capitals if mentioned",
  "experience": "Work experience details properly formatted",
  "education": "Education details properly formatted (e.g., 10th Pass from ABC School, B.Tech from XYZ College)",
  "certifications": "Certifications/licenses properly formatted"
}

IMPORTANT: Capitalize names, trades, skills, locations properly! Return ONLY the JSON object with fields that were mentioned.`;

            const extractCall = await groq.chat.completions.create({
                messages: [{ role: 'user', content: extractPrompt }],
                model: 'llama-3.1-8b-instant',
                temperature: 0.1,
                max_tokens: 200,
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
