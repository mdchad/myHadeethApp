# AI Chat Setup Guide

## ✅ What's Been Done

Your AI chat feature is now fully integrated and ready to test!

### Files Created/Modified

**Created:**
- `app/(app)/hadith-chat.tsx` - Main chat screen (using AI SDK 5.0)
- `app/components/chat/message-item.tsx` - Message bubbles with animations
- `app/components/chat/tool-call-item.tsx` - Tool call display
- `app/components/chat/README.md` - Detailed documentation

**Modified:**
- `app/components/hadith-item.tsx` - Added navigation to chat from "Tanya AI" button

## 🔧 AI SDK 5.0 Updates

This implementation uses **AI SDK 5.0** with the following changes:
- ✅ Uses `useChat` hook from `@ai-sdk/react`
- ✅ Transport-based architecture with `DefaultChatTransport`
- ✅ Local input state management (SDK no longer manages it)
- ✅ Message structure uses `parts` array instead of direct `content`
- ✅ Status-based loading state (`streaming`, `submitted`, `ready`, `error`)

## 🚀 Quick Start

### 1. Verify API URL (Already Done!)

The chat uses your existing environment variable:

```bash
# .env
EXPO_PUBLIC_API_URL=https://dev.myway.my
```

The chat endpoint is automatically: `${EXPO_PUBLIC_API_URL}/api/chat`

### 2. Test Locally (Optional)

To test with your local Next.js dev server, update `.env`:

**On iOS Simulator:**
```bash
EXPO_PUBLIC_API_URL=http://localhost:3000
```

**On Physical Device:**
```bash
# Find your local IP: ifconfig | grep "inet " | grep -v 127.0.0.1
EXPO_PUBLIC_API_URL=http://192.168.X.X:3000  # Your local IP
```

Then restart Expo to load the new env var:
```bash
bun start --clear
```

### 3. Run the App

```bash
bun start
```

Then choose your platform (iOS/Android).

### 4. Test the Chat

1. Navigate to any hadith in your app
2. Tap the **"Tanya AI"** button
3. You should see the chat screen with the hadith context at the top
4. Ask a question like:
   - "What does this hadith mean?"
   - "Can you explain the context?"
   - "Find similar hadiths about prayer"

## 🎨 Features Implemented

- ✅ Streaming AI responses with fade-in animations
- ✅ Tool call display (shows when AI searches hadiths)
- ✅ Stop generation button
- ✅ Keyboard handling
- ✅ Auto-scroll to bottom
- ✅ Dark mode support
- ✅ Hadith context in header
- ✅ Empty state with helpful text
- ✅ Error handling

## 🔍 How It Works

### Request Flow

```
User taps "Tanya AI"
    ↓
Navigate to /hadith-chat with hadith data
    ↓
User sends message
    ↓
POST to your API endpoint with:
  - messages: conversation history
  - hadith: current hadith context
    ↓
Stream response back
    ↓
Parse AI SDK UI message stream
    ↓
Display messages with fade-in animations
```

### API Integration

Your existing API route is already compatible! The mobile app sends:

```json
{
  "messages": [
    { "role": "user", "content": "What does this mean?" }
  ],
  "hadith": {
    "_id": "...",
    "number": "42",
    "book_title": { "ms": "Sahih al-Bukhari" },
    "content": [
      { "ar": "Arabic text...", "ms": "Malay text..." }
    ]
  }
}
```

Your API returns the AI SDK UI message stream format, which we parse to show:
- Streaming text responses
- Tool invocations (searchHadith)
- Tool results

## 🐛 Troubleshooting

### Messages not streaming
- Check network tab in React Native debugger
- Verify API endpoint is correct
- Test API endpoint with curl/Postman first
- Check CORS settings if calling from web

### Tool calls not showing
- Check console for parsing errors
- Verify the AI is actually calling the tool
- Check that `searchHadith` is working in your API

### Keyboard issues on iOS
- Adjust `keyboardVerticalOffset` in `hadith-chat.tsx` (line 136)
- Try different values like 70, 90, 100

### TypeScript errors
```bash
npx expo install --fix
```

### Network errors
- Make sure your API is running
- Check that your device/simulator can reach the API
- For physical devices, use your local network IP, not localhost

## 🎨 Customization

### Change Colors

Edit in `message-item.tsx`:
```typescript
// User message
className="bg-royal-blue"  // Your brand color

// Assistant message
className="bg-gray-100 dark:bg-gray-800"
```

### Adjust Animations

In `message-item.tsx`:
```typescript
entering={FadeIn.duration(300)}  // Change duration (ms)
```

### Customize Tool Display

In `tool-call-item.tsx`:
```typescript
function getToolDisplayName(toolName: string): string {
  return {
    searchHadith: 'Searching hadiths...',
    // Add more tools here
  }[toolName]
}
```

## 📱 Testing Checklist

- [ ] Chat screen opens when tapping "Tanya AI"
- [ ] Hadith context shows at the top
- [ ] Can type and send messages
- [ ] Messages stream in smoothly
- [ ] Tool calls show when AI searches
- [ ] "Stop generating" button works
- [ ] Keyboard doesn't overlap input
- [ ] Auto-scrolls to new messages
- [ ] Works in both light and dark mode
- [ ] Back button returns to hadith

## 🚢 Deployment

Once tested locally, update the API endpoint to your production URL and rebuild:

```bash
# For iOS
bun build:ios

# For Android
bun build:android
```

## 📚 Next Steps (Optional)

- Add conversation history persistence (MMKV)
- Add share message functionality
- Add copy message text
- Add regenerate response button
- Add suggested questions
- Add typing indicators
- Add markdown rendering for formatted text

## 💬 Need Help?

See `app/components/chat/README.md` for detailed API documentation and advanced customization options.
