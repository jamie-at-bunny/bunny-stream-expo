# Native video playback with Bunny Stream and Expo

Play [Bunny Stream](https://bunny.net/stream/) videos natively in Expo using `expo-video`. Supports Picture-in-Picture, background audio, lock screen controls, chapters, and captions.

## Setup

Install dependencies:

```bash
npm install
```

Copy `.env` and fill in your Bunny Stream credentials:

```bash
cp .env .env.local
```

```
EXPO_PUBLIC_BUNNY_PULL_ZONE=vz-abc123-456.b-cdn.net
EXPO_PUBLIC_BUNNY_LIBRARY_ID=12345
EXPO_PUBLIC_BUNNY_API_KEY=your-library-api-key
```

You can find your Pull Zone hostname and API key under **Stream > API** in the [bunny.net](https://bunny.net/) dashboard.

> In production, set `EXPO_PUBLIC_API_BASE` to route API calls through a [Bunny Edge Script](https://docs.bunny.net/docs/edge-scripting-overview) so the API key never reaches the client. When unset, the app calls the Bunny API directly for local development.

## Running

`expo-video` requires a development build — it won't work in Expo Go.

```bash
npx expo run:ios
# or
npx expo run:android
```

## Project structure

```
src/
├── app/
│   ├── _layout.tsx            # Root Stack navigator
│   ├── index.tsx              # Video list screen
│   └── video/
│       └── [id].tsx           # Native HLS playback with chapters & captions
├── components/
│   ├── ChapterList.tsx        # Tappable chapter chips
│   └── CaptionPicker.tsx      # Subtitle track picker
└── lib/
    └── bunny.ts               # Types, API client, URL helpers
```
