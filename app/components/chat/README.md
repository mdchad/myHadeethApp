# AI Chat Feature

## Overview

A native-feeling AI chat interface for asking questions about Hadiths, inspired by Vercel's v0 iOS app. Supports streaming responses, tool calls, and smooth animations.

## Features

✅ **Streaming AI responses** - Real-time text streaming with fade-in animations
✅ **Tool call display** - Shows when AI searches for hadiths
✅ **Smooth animations** - Reanimated-powered fade-ins inspired by Vercel's blog post
✅ **Floating composer** - Native-feeling text input with keyboard handling
✅ **Stop generation** - Cancel streaming responses mid-flight
✅ **Dark mode support** - Fully styled for light and dark themes
✅ **Hadith context** - Passes hadith details to the AI

## File Structure

```
app/
├── (app)/
│   └── hadith-chat.tsx              # Main chat screen
└── components/
    ├── hadith-item.tsx               # Updated with "Tanya AI" button
    └── chat/
        ├── message-item.tsx          # Message bubble with animations
        ├── tool-call-item.tsx        # Tool usage display
        ├── use-chat-stream.ts        # Chat streaming logic
        └── README.md                 # This file
```

## API Integration

### API Endpoint Configuration

The chat automatically uses your environment variable:

```typescript
// app/(app)/hadith-chat.tsx
const API_ENDPOINT = `${process.env.EXPO_PUBLIC_API_URL}/api/chat`
```

Configure in `.env`:

```bash
EXPO_PUBLIC_API_URL=https://your-api.com
```

For local development:

```bash
# iOS Simulator
EXPO_PUBLIC_API_URL=http://localhost:3000

# Physical device (use your local IP)
EXPO_PUBLIC_API_URL=http://192.168.X.X:3000
```

**Note:** Restart Expo with `bun start --clear` after changing `.env`

### Expected API Request Format

The chat sends POST requests with:

```json
{
  "messages": [
    { "role": "user", "content": "What does this hadith mean?" },
    { "role": "assistant", "content": "This hadith..." }
  ],
  "hadithContext": {
    "id": "hadith-123",
    "number": "42",
    "contentAr": "Arabic text...",
    "contentMs": "Malay text..."
  }
}
```

### Expected API Response Format

The API should return a **streaming response** using Server-Sent Events (SSE) format:

#### Text streaming:
```
data: {"type":"text-delta","delta":"This "}
data: {"type":"text-delta","delta":"hadith "}
data: {"type":"text-delta","delta":"means..."}
data: [DONE]
```

#### Tool calls:
```
data: {"type":"tool-call","toolName":"searchHadith","args":{"query":"prayer"}}
data: {"type":"tool-result","result":[{"id":"123","text":"..."}]}
data: {"type":"text-delta","delta":"Based on the search..."}
data: [DONE]
```

### AI SDK Integration

If you're using Vercel AI SDK on your backend, it should work automatically. Example Next.js API route:

```typescript
// app/api/chat/route.ts
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function POST(req: Request) {
  const { messages, hadithContext } = await req.json()

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    messages,
    system: `You are an Islamic scholar assistant. The user is asking about Hadith ${hadithContext.number}:

Arabic: ${hadithContext.contentAr}
Malay: ${hadithContext.contentMs}`,
    tools: {
      searchHadith: {
        description: 'Search for hadiths by semantic meaning',
        parameters: z.object({
          query: z.string().describe('The search query'),
        }),
        execute: async ({ query }) => {
          // Your semantic search implementation
          const results = await searchHadiths(query)
          return results
        },
      },
    },
  })

  return result.toDataStreamResponse()
}
```

## Usage

### From HadithItem

Users tap the "Tanya AI" button on any hadith, which navigates to the chat screen with context:

```typescript
<Button onPress={() => handleAskAI(contentIndex)}>
  <SparklesIcon size={10} />
  <Button.Label>Tanya AI</Button.Label>
</Button>
```

### Customization

#### Change colors
Edit the Tailwind classes in `message-item.tsx` and `hadith-chat.tsx`:

```typescript
// User message color
className="bg-royal-blue"  // Change to your brand color

// Assistant message color
className="bg-gray-100 dark:bg-gray-800"
```

#### Adjust animations
Modify animation durations in `message-item.tsx`:

```typescript
entering={FadeIn.duration(300)}  // Change duration (ms)
```

#### Customize tool display
Edit `tool-call-item.tsx` to change how tool calls are displayed:

```typescript
function getToolDisplayName(toolName: string): string {
  return {
    searchHadith: 'Searching hadiths...',
    yourTool: 'Your custom message...',
  }[toolName]
}
```

## Testing

1. **Test navigation**: Tap "Tanya AI" on a hadith
2. **Test streaming**: Send a message and verify it streams
3. **Test tool calls**: Ask a question that triggers search
4. **Test stop generation**: Cancel a response mid-stream
5. **Test keyboard**: Ensure keyboard doesn't overlap input

## Next Steps

- [ ] Replace `YOUR_API_ENDPOINT_HERE` with your actual endpoint
- [ ] Test streaming response format
- [ ] Customize colors to match your brand
- [ ] Add error toast notifications (optional)
- [ ] Add message persistence (optional)
- [ ] Add conversation history (optional)

## Troubleshooting

### Streaming not working
- Verify your API returns SSE format (`data: {...}\n`)
- Check network tab in dev tools
- Ensure Content-Type is `text/event-stream` or similar

### Tool calls not showing
- Verify tool call format matches expected structure
- Check console for parsing errors

### Keyboard issues
- Adjust `keyboardVerticalOffset` in KeyboardAvoidingView
- Test on both iOS and Android

### TypeScript errors
- Ensure all imports are correct
- Run `npx expo install --fix` to sync dependencies
