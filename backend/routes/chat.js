import express from 'express';

const router = express.Router();

// Clean markdown formatting from AI responses for better frontend display
function cleanMarkdownFormatting(text) {
    if (!text) return text;

    return text
        // Replace markdown asterisks with bullet points
        .replace(/^\s*\*\s+/gm, '• ')
        // Remove bold/italic asterisks
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        // Clean up multiple spaces
        .replace(/\s+/g, ' ')
        // Ensure proper line breaks for lists
        .replace(/•\s*/g, '• ')
        // Clean up extra whitespace
        .trim();
}

// AI-powered response system using multiple AI providers
async function getAIResponse(message, conversationHistory = []) {
    console.log('🔍 DEBUG: Starting AI response generation...');
    console.log(`📝 DEBUG: Message: "${message}"`);
    console.log(`💬 DEBUG: Conversation history length: ${conversationHistory.length}`);

    // Check environment variables
    console.log('🔑 DEBUG: API Key Status:');
    console.log(`   - Gemini: ${process.env.GEMINI_API_KEY ? 'Present (' + process.env.GEMINI_API_KEY.substring(0, 10) + '...)' : 'Missing'}`);
    console.log(`   - Groq: ${process.env.GROQ_API_KEY ? 'Present (' + process.env.GROQ_API_KEY.substring(0, 10) + '...)' : 'Missing'}`);
    console.log(`   - HuggingFace: ${process.env.HUGGING_FACE_API_KEY ? 'Present (' + process.env.HUGGING_FACE_API_KEY.substring(0, 10) + '...)' : 'Missing'}`);

    // Try different AI providers in order of preference
    const providers = [
        () => callGeminiAPI(message, conversationHistory),
        () => callGroqAPI(message, conversationHistory),
        () => callHuggingFaceAPI(message, conversationHistory)
    ];

    for (let i = 0; i < providers.length; i++) {
        const providerNames = ['Gemini', 'Groq', 'HuggingFace'];
        try {
            console.log(`🔄 DEBUG: Trying ${providerNames[i]} API...`);
            const response = await providers[i]();
            if (response) {
                console.log(`✅ DEBUG: ${providerNames[i]} API successful!`);
                console.log(`📤 DEBUG: Response preview: "${response.substring(0, 100)}..."`);

                // Clean markdown formatting for better frontend display
                const cleanedResponse = cleanMarkdownFormatting(response);
                return cleanedResponse;
            }
            console.log(`⚠️ DEBUG: ${providerNames[i]} API returned empty response`);
        } catch (error) {
            console.error(`❌ DEBUG: ${providerNames[i]} API failed:`, error.message);
            console.error(`🔍 DEBUG: Full error details:`, error);
            continue;
        }
    }

    console.log('🔄 DEBUG: All AI providers failed, using fallback...');
    // If all AI providers fail, use enhanced rule-based fallback
    return getEnhancedFallbackResponse(message, conversationHistory);
}

// Google Gemini API (Free tier available)
async function callGeminiAPI(message, conversationHistory) {
    console.log('🤖 DEBUG: Entering Gemini API function');
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
        console.log('❌ DEBUG: No Gemini API key found');
        throw new Error('No Gemini API key');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    console.log('🌐 DEBUG: Gemini URL constructed:', url.replace(GEMINI_API_KEY, 'HIDDEN_KEY'));

    // Build conversation context
    const context = buildTravelContext(message, conversationHistory);
    console.log('📝 DEBUG: Gemini context built, length:', context.length);

    const requestBody = {
        contents: [{
            parts: [{
                text: context
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 300,
            topP: 0.8,
            topK: 40
        }
    };

    console.log('📤 DEBUG: Sending Gemini request...');
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    console.log(`📥 DEBUG: Gemini response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DEBUG: Gemini error response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📋 DEBUG: Gemini response data:', JSON.stringify(data, null, 2));

    const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    console.log('✅ DEBUG: Gemini extracted result:', result ? `"${result.substring(0, 100)}..."` : 'null');

    return result;
}

// Groq API (Free tier available, very fast)
async function callGroqAPI(message, conversationHistory) {
    console.log('🚀 DEBUG: Entering Groq API function');
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        console.log('❌ DEBUG: No Groq API key found');
        throw new Error('No Groq API key');
    }

    const context = buildTravelContext(message, conversationHistory);
    console.log('📝 DEBUG: Groq context built, length:', context.length);

    const requestBody = {
        model: 'llama3-8b-8192',
        messages: [
            {
                role: 'system',
                content: 'You are NAVISTRA, a helpful travel assistant. Provide concise, practical travel advice. Keep responses under 250 words and always end with a helpful follow-up question. Use simple bullet points with • symbol instead of asterisks *.'
            },
            {
                role: 'user',
                content: context
            }
        ],
        max_tokens: 300,
        temperature: 0.7
    };

    console.log('📤 DEBUG: Sending Groq request...');
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    console.log(`📥 DEBUG: Groq response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ DEBUG: Groq error response:', errorText);
        throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📋 DEBUG: Groq response data:', JSON.stringify(data, null, 2));

    const result = data.choices?.[0]?.message?.content?.trim();
    console.log('✅ DEBUG: Groq extracted result:', result ? `"${result.substring(0, 100)}..."` : 'null');

    return result;
}

// Hugging Face API (Free tier)
async function callHuggingFaceAPI(message, conversationHistory) {
    const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;
    const url = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';

    const headers = {
        'Content-Type': 'application/json',
    };

    if (HF_API_KEY) {
        headers['Authorization'] = `Bearer ${HF_API_KEY}`;
    }

    const context = buildTravelContext(message, conversationHistory);

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            inputs: context,
            parameters: {
                max_new_tokens: 150,
                temperature: 0.7,
                do_sample: true,
                return_full_text: false
            }
        })
    });

    if (!response.ok) {
        throw new Error(`HuggingFace API error: ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = '';

    if (Array.isArray(data) && data[0]?.generated_text) {
        aiResponse = data[0].generated_text.replace(context, '').trim();
    } else if (data.generated_text) {
        aiResponse = data.generated_text.replace(context, '').trim();
    }

    return aiResponse || null;
}

// Build travel-focused context for AI
function buildTravelContext(message, conversationHistory) {
    let context = `You are NAVISTRA, an expert travel assistant. You help with travel planning, destinations, budgets, packing, safety, food, transportation, and cultural tips. Always be helpful, concise, and ask follow-up questions.

IMPORTANT FORMATTING RULES:
- Use simple bullet points with • symbol (not asterisks *)
- For lists, use • at the start of each line
- Keep responses clean and readable in plain text format
- Avoid markdown formatting like *, **, or #
- Use simple line breaks for organization

Previous conversation:
`;

    // Add recent conversation history
    const recentHistory = conversationHistory.slice(-4);
    recentHistory.forEach(msg => {
        context += `${msg.isUser ? 'Human' : 'NAVISTRA'}: ${msg.text}\n`;
    });

    context += `Human: ${message}\nNAVISTRA:`;
    return context;
}

// Enhanced fallback response system (when all AI providers fail)
function getEnhancedFallbackResponse(message, conversationHistory) {
    const lowerMessage = message.toLowerCase();

    // Travel-specific intelligent responses with context awareness
    const responses = {
        // Greeting responses
        greeting: {
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            response: "Hello! I'm NAVISTRA, your travel companion. I'm here to help you plan amazing trips! Whether you need destination recommendations, budget tips, or travel advice, just ask me anything."
        },

        // Destination planning
        destination: {
            keywords: ['where to go', 'destination', 'place to visit', 'recommend', 'suggest a place'],
            response: (msg) => {
                if (msg.includes('budget') || msg.includes('cheap')) {
                    return "For budget-friendly destinations, I recommend:\n• Vietnam (amazing food & culture)\n• Portugal (beautiful coastline)\n• Mexico (rich history)\n• Domestic options: Goa, Rishikesh, or Hampi\n\nWhat's your approximate budget and travel style?";
                }
                if (msg.includes('beach') || msg.includes('coast')) {
                    return "For beautiful beaches, consider:\n• Goa & Andaman Islands (India)\n• Maldives\n• Bali\n• Phuket\n• Santorini\n\nEach offers unique experiences - from budget-friendly to luxury. What kind of beach experience are you looking for?";
                }
                if (msg.includes('mountain') || msg.includes('hill')) {
                    return "For mountain destinations:\n• Manali, Leh-Ladakh, Darjeeling (India)\n• Nepal\n• Switzerland\n• New Zealand\n\nPerfect for trekking, scenic views, and adventure. What's your experience level with mountain travel?";
                }
                return "I'd love to help you find the perfect destination! Tell me:\n• What type of experience interests you? (adventure, relaxation, culture, food, nature)\n• What's your budget range and how long is your trip?";
            }
        },

        // Budget planning
        budget: {
            keywords: ['budget', 'cost', 'expensive', 'cheap', 'money', 'price'],
            response: (msg) => {
                if (msg.includes('international') || msg.includes('abroad')) {
                    return "For international travel budgeting:\n• Southeast Asia ($30-50/day)\n• Eastern Europe ($40-70/day)\n• Western Europe ($80-150/day)\n\nInclude flights, accommodation, food, activities, and emergency fund. Book flights 2-3 months ahead for better deals!";
                }
                return "Smart budget travel tips:\n• Use flight comparison sites and be flexible with dates\n• Stay in hostels or homestays\n• Eat where locals eat\n• Use public transport\n• Book activities in advance\n• Always keep 20% extra for emergencies\n\nWhat's your destination?";
            }
        },

        // Packing advice
        packing: {
            keywords: ['pack', 'luggage', 'suitcase', 'clothes', 'what to bring'],
            response: (msg) => {
                if (msg.includes('cold') || msg.includes('winter')) {
                    return "Cold weather packing essentials:\n• Thermal underwear\n• Wool socks\n• Waterproof jacket\n• Warm hat and gloves\n• Good boots\n• Lip balm and moisturizer\n\nLayering is key! Roll clothes to save space!";
                }
                if (msg.includes('beach') || msg.includes('summer')) {
                    return "Beach/summer packing essentials:\n• Light, breathable fabrics\n• Swimwear\n• Sun hat and sunglasses\n• SPF 50+ sunscreen\n• Flip-flops\n• Light jacket for air conditioning\n• Waterproof bag for electronics!";
                }
                return "Essential packing tips:\n• Roll, don't fold clothes\n• Pack versatile items that mix & match\n• Bring only essentials\n• Leave space for souvenirs\n• Pack a small first-aid kit\n• Don't forget chargers and adapters!";
            }
        },

        // Safety advice
        safety: {
            keywords: ['safe', 'safety', 'dangerous', 'security', 'crime', 'precaution'],
            response: "Travel safety essentials:\n• Research your destination's current situation\n• Keep copies of documents in separate bags\n• Share your itinerary with someone at home\n• Trust your instincts\n• Avoid displaying expensive items\n• Learn basic local phrases\n• Have emergency contacts handy\n\nAny specific safety concerns?"
        },

        // Food & dining
        food: {
            keywords: ['food', 'eat', 'restaurant', 'cuisine', 'local dishes'],
            response: (msg) => {
                if (msg.includes('street food')) {
                    return "Street food safety tips:\n• Choose busy stalls with high turnover\n• Watch them cook your food\n• Avoid raw vegetables in some countries\n• Start with small portions to test your stomach\n• Always have hand sanitizer ready\n\nStreet food is often the most authentic experience!";
                }
                return "Food travel experiences:\n• Eat where locals eat - ask your hotel for recommendations\n• Try signature local dishes\n• Take a food tour on your first day\n• Learn basic food words in the local language\n• Be adventurous but start slowly if you have a sensitive stomach!";
            }
        },

        // Transportation
        transport: {
            keywords: ['transport', 'flight', 'train', 'bus', 'taxi', 'travel', 'getting around'],
            response: (msg) => {
                if (msg.includes('flight')) {
                    return "Flight booking tips:\n• Use comparison sites like Skyscanner\n• Be flexible with dates (+/- 3 days)\n• Book 6-8 weeks in advance for domestic\n• Book 2-3 months for international\n• Consider nearby airports and one-stop flights for savings!";
                }
                return "Getting around tips:\n• Research public transport apps for your destination\n• Consider day passes for metros/buses\n• Use ride-sharing apps\n• Negotiate taxi fares beforehand in some countries\n• Always have offline maps downloaded!";
            }
        },

        // Thanks and closing
        thanks: {
            keywords: ['thank', 'thanks', 'appreciate', 'helpful'],
            response: "You're very welcome! I'm so happy I could help with your travel planning. Have an amazing trip and create wonderful memories! Feel free to ask me anything else before you go. Safe travels! ✈️🌍"
        }
    };

    // Find the best matching response
    for (const [category, config] of Object.entries(responses)) {
        if (config.keywords.some(keyword => lowerMessage.includes(keyword))) {
            if (typeof config.response === 'function') {
                return config.response(lowerMessage);
            }
            return config.response;
        }
    }

    // Context-aware follow-ups based on conversation history
    if (conversationHistory.length > 0) {
        const lastBotMessage = conversationHistory.filter(msg => !msg.isUser).slice(-1)[0];
        if (lastBotMessage?.text.includes('budget range')) {
            return "Great! Based on your budget, I can suggest some perfect destinations. Could you also tell me what type of experience you're looking for? Adventure, relaxation, cultural exploration, or maybe a mix of everything?";
        }
        if (lastBotMessage?.text.includes('destination')) {
            return "Excellent choice! Now let's plan the details. How many days are you planning to travel? This will help me suggest the perfect itinerary and budget breakdown for your trip.";
        }
    }

    // Default intelligent response
    return "I'm here to help make your travel dreams come true! I can assist with destination recommendations, budget planning, packing tips, safety advice, food suggestions, and much more. What aspect of travel planning would you like to explore together?";
}

// POST /api/chat - Send a message to the chatbot
router.post('/', async (req, res) => {
    try {
        const { message, conversationHistory } = req.body;

        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Message is required and must be a string'
            });
        }

        console.log(`🤖 Chatbot received: ${message}`);

        // Get AI response from multiple providers
        const aiResponse = await getAIResponse(message, conversationHistory || []);

        console.log(`🤖 Chatbot responding: ${aiResponse}`);

        res.json({
            message: aiResponse,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Failed to get chat response',
            message: getEnhancedFallbackResponse(req.body.message || '', req.body.conversationHistory || [])
        });
    }
});

// GET /api/chat/models - Get available models and their status
router.get('/models', (req, res) => {
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasGroq = !!process.env.GROQ_API_KEY;
    const hasHuggingFace = !!process.env.HUGGING_FACE_API_KEY;

    res.json({
        current: 'Multi-Provider AI System',
        type: 'Dynamic AI with fallback system',
        providers: [
            {
                name: 'Google Gemini Pro',
                status: hasGemini ? 'Active' : 'Not configured',
                priority: 1,
                model: 'gemini-2.0-flash'
            },
            {
                name: 'Groq Llama 3',
                status: hasGroq ? 'Active' : 'Not configured',
                priority: 2,
                model: 'llama3-8b-8192'
            },
            {
                name: 'Hugging Face DialoGPT',
                status: hasHuggingFace ? 'Active' : 'Not configured',
                priority: 3,
                model: 'microsoft/DialoGPT-large'
            }
        ],
        fallback: {
            name: 'Enhanced Rule-based System',
            status: 'Always Active',
            description: 'Travel-specific responses when AI APIs are unavailable'
        },
        features: [
            'Dynamic AI responses for any travel question',
            'Multi-provider reliability',
            'Conversation context awareness',
            'Intelligent fallback system',
            'Travel-specialized prompting',
            'Clean text formatting for frontend'
        ],
        setup_guide: '/AI_SETUP_GUIDE.md'
    });
});

export default router;
