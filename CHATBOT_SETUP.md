# NAVISTRA Chatbot Integration

## Overview

The NAVISTRA chatbot is now integrated with open-source AI models via the Hugging Face Inference API. This provides intelligent, context-aware responses for travel-related queries.

## Features

- **Real AI Integration**: Uses Microsoft's DialoGPT-medium model for conversational AI
- **Travel-Focused**: Specialized prompts for travel advice and planning
- **Conversation History**: Maintains context across multiple messages
- **Fallback Responses**: Local responses when API is unavailable
- **Free to Use**: No API costs (with rate limits)

## Setup Instructions

### 1. Backend Setup (Already Done)

- ✅ Created `/backend/routes/chat.js` with AI integration
- ✅ Added chat route to main server in `index.js`
- ✅ Configured Hugging Face API integration

### 2. Frontend Setup (Already Done)

- ✅ Updated `Chatbot.tsx` to call backend API
- ✅ Added proper error handling and fallback responses
- ✅ Maintains conversation context for better responses

### 3. Optional: Get Better Performance

To improve response quality and remove rate limits:

1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a free account and generate an API token
3. Add it to your `.env` file:
   ```
   HUGGING_FACE_API_KEY=your_token_here
   ```

## How It Works

### 1. User sends message

```
User: "What should I pack for a beach vacation?"
```

### 2. Frontend sends to backend

```javascript
POST /api/chat
{
  "message": "What should I pack for a beach vacation?",
  "conversationHistory": [previous messages...]
}
```

### 3. Backend processes with AI

- Adds travel-focused context
- Includes conversation history
- Sends to Hugging Face DialoGPT model
- Returns intelligent response

### 4. Frontend displays response

```
NAVISTRA: "For a beach vacation, pack: 1) Lightweight, quick-dry clothing
2) Swimwear and cover-ups 3) Waterproof phone case 4) High SPF sunscreen
5) Sandals and water shoes 6) Beach towel 7) Sun hat and sunglasses.
Don't forget to check the weather forecast and any water activity gear!"
```

## Available Models

- **Current**: `microsoft/DialoGPT-medium` (balanced quality/speed)
- **Alternative**: `microsoft/DialoGPT-large` (better quality, slower)
- **Alternative**: `facebook/blenderbot-400M-distill` (different style)

## API Endpoints

### POST /api/chat

Send a message to the chatbot

```json
{
  "message": "string",
  "conversationHistory": [
    {
      "id": "string",
      "text": "string",
      "isUser": boolean,
      "timestamp": "date"
    }
  ]
}
```

Response:

```json
{
  "message": "AI response text",
  "timestamp": "2025-07-06T10:30:00.000Z"
}
```

### GET /api/chat/models

Get information about available AI models

```json
{
  "current": "microsoft/DialoGPT-medium",
  "available": ["microsoft/DialoGPT-medium", "microsoft/DialoGPT-large"],
  "provider": "Hugging Face Inference API"
}
```

## Testing the Chatbot

1. Start the backend server:

   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:

   ```bash
   npm run dev
   ```

3. Click the chat icon and try these test messages:
   - "What should I pack for a trip to Japan?"
   - "How can I travel on a budget?"
   - "Is it safe to travel solo?"
   - "What documents do I need for international travel?"

## Troubleshooting

### If AI responses seem generic:

- Add your Hugging Face API key to `.env`
- Try different models in `/backend/routes/chat.js`

### If chatbot doesn't respond:

- Check backend console for errors
- Verify backend is running on port 5000
- Check browser network tab for failed requests

### If responses are slow:

- This is normal for free tier (can take 10-20 seconds)
- Consider using a paid API key for faster responses

## Future Enhancements

- Add support for multiple AI providers (OpenAI, Anthropic)
- Implement conversation memory across sessions
- Add voice input/output capabilities
- Integrate with travel data for personalized recommendations
