# AI API Setup Guide for NAVISTRA Chatbot

## Overview

The NAVISTRA chatbot now uses real AI APIs that can handle any type of travel question dynamically. The system tries multiple AI providers for reliability and falls back to rule-based responses only if all AI services are unavailable.

## Supported AI Providers

### 1. Google Gemini API (Recommended) ⭐

**Why Choose**: Most generous free tier, excellent quality responses

- **Free Tier**: 60 requests per minute
- **Model**: Gemini Pro
- **Setup Time**: 2 minutes

**How to Get API Key:**

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add to `.env` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 2. Groq API (Fastest) ⚡

**Why Choose**: Extremely fast responses (1-2 seconds)

- **Free Tier**: Good daily limits
- **Model**: Llama 3 8B
- **Setup Time**: 3 minutes

**How to Get API Key:**

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up for free account
3. Navigate to API Keys section
4. Create new API key
5. Add to `.env` file:
   ```
   GROQ_API_KEY=your_actual_api_key_here
   ```

### 3. Hugging Face API (Backup) 🤗

**Why Choose**: Good backup option, many models available

- **Free Tier**: Rate limited but functional
- **Model**: DialoGPT Large
- **Setup Time**: 2 minutes

**How to Get API Key:**

1. Go to [Hugging Face](https://huggingface.co/settings/tokens)
2. Create free account
3. Create new token with "Read" permissions
4. Add to `.env` file:
   ```
   HUGGING_FACE_API_KEY=your_actual_api_key_here
   ```

## Quick Start (Recommended)

### Option 1: Just Google Gemini (Easiest)

1. Get Gemini API key (2 minutes)
2. Add to `.env` file
3. Restart backend server
4. Done! ✅

### Option 2: All Three APIs (Best Reliability)

1. Get all three API keys (5-7 minutes total)
2. Add all to `.env` file
3. Restart backend server
4. System will automatically try them in order of preference

## Testing Your Setup

1. **Start the backend server:**

   ```bash
   cd backend
   npm start
   ```

2. **Test with curl:**

   ```bash
   curl -X POST http://localhost:5000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "What are some unique travel experiences in Japan?"}'
   ```

3. **Expected Response:**
   - If API keys work: Dynamic AI-generated response
   - If no API keys: Falls back to rule-based responses

## Example Responses

### With AI APIs:

**User**: "What are some unique travel experiences in Japan?"
**AI Response**: "Japan offers incredible unique experiences! Try staying in a traditional ryokan with hot springs, participate in a tea ceremony in Kyoto, visit the snow monkeys in Nagano, experience a robot restaurant in Tokyo, or sleep in a capsule hotel. For something truly special, consider visiting during cherry blossom season or staying at a temple for a meditation retreat. What type of experience interests you most?"

### Without AI APIs (Fallback):

**User**: "What are some unique travel experiences in Japan?"
**Fallback Response**: "I'd love to help you find the perfect destination! Tell me: What type of experience interests you? (adventure, relaxation, culture, food, nature). Also, what's your budget range and how long is your trip?"

## Benefits of AI Integration

✅ **Handles Any Question**: Can respond to unexpected or complex travel queries
✅ **Context Awareness**: Understands conversation flow and previous messages  
✅ **Natural Responses**: More conversational and human-like interactions
✅ **Multiple Fallbacks**: If one API fails, tries others automatically
✅ **Free to Use**: All recommended APIs have generous free tiers
✅ **Easy Setup**: Get started in under 5 minutes

## File Locations

- **Backend Route**: `backend/routes/chat.js`
- **Environment Variables**: `backend/.env`
- **Frontend Component**: `src/components/Chatbot.tsx`

## Troubleshooting

### If chatbot gives rule-based responses:

1. Check if API keys are correctly added to `.env` file
2. Restart the backend server after adding keys
3. Check backend console for error messages
4. Verify API keys are valid and have remaining quota

### If responses are slow:

1. Groq is fastest (1-2 seconds)
2. Gemini is medium speed (3-5 seconds)
3. Hugging Face can be slower (5-15 seconds)

### If you get API errors:

1. Check your internet connection
2. Verify API key permissions
3. Check if you've exceeded rate limits
4. Try a different API provider

## Status: 🚀 Ready for Dynamic AI!

The chatbot is now equipped with real AI that can handle any travel question intelligently. Just add at least one API key and enjoy human-like travel assistance!
