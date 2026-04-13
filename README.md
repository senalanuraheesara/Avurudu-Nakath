# Avurudu Nakath

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat&logo=react)](https://reactnative.dev/)

**Avurudu Nakath** is a mobile app for **Sinhala & Hindu New Year** auspicious times (**nakath**) for **2026**, with all clock times in **Asia/Colombo** (UTC+05:30). It includes Sinhala, English, and Tamil, local notifications, a compass for directions, and illustrated scenes per ritual.

| | |
|---|---|
| **Repository** | [github.com/senalanuraheesara/Avurudu-Nakath](https://github.com/senalanuraheesara/Avurudu-Nakath) |
| **Mobile** | Expo (React Native) — `mobile/` |
| **API (optional)** | Node.js + Express + MongoDB — `server/` |

---

## Features

- **Bundled 2026 almanac** — Full schedule in-app when offline or when no API is configured  
- **Active nakath hero** — Highlights the ritual in progress with art and motion  
- **Countdown** — Next upcoming nakath with a live timer  
- **සීට්ටුව (full list)** — Scrollable list with past/upcoming state and mute per ritual  
- **Languages** — Sinhala, English, Tamil  
- **Notifications** — Local reminders for upcoming instants (where supported)  
- **Compass** — Helpful for direction-facing rituals  
- **Optional API** — Fetch events from your own backend; app falls back to bundled data on failure  

---

## Tech stack

| Area | Stack |
|------|--------|
| App | [Expo](https://expo.dev/) ~54, React 19, React Native 0.81, TypeScript |
| API | Node.js (ESM), Express, Mongoose, MongoDB |
| Deploy (API) | Docker (`server/Dockerfile`) — e.g. AWS App Runner, ECS |
| Android builds | [EAS Build](https://docs.expo.dev/build/introduction/) — `apk` profile in `mobile/eas.json` |

---

## Prerequisites

- **Node.js** LTS (20.x or 22.x recommended)  
- **npm**  
- **MongoDB** — only if you run `server/` (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))  
- **Expo Go** or Android/iOS emulator for development  

---

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/senalanuraheesara/Avurudu-Nakath.git
cd Avurudu-Nakath
```

### 2. Mobile app (Expo)

```bash
cd mobile
npm install
npm start
```

- Press **`a`** for Android emulator, **`i`** for iOS simulator, or scan the QR code with **Expo Go** on a physical device.

#### Optional: remote nakath API

Create `mobile/.env` (do not commit secrets):

```env
EXPO_PUBLIC_API_URL=https://your-api-host.example.com
```

The client calls:

`GET {EXPO_PUBLIC_API_URL}/api/nakath/events`

If the variable is unset or the request fails, the app uses the bundled data in `mobile/src/data/nakath2026.ts`.

### 3. API server (optional)

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and set **`MONGODB_URI`** (and **`PORT`** if you need a port other than `4000`).

```bash
npm run seed   # optional — loads sample nakath documents into MongoDB
npm start
```

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Health check |
| `GET /api/nakath/events` | JSON array of nakath events (same shape as the mobile `NakathEvent` type) |

For container deployment, see **`server/Dockerfile`** and **`server/.env.example`**.

---

## Building an Android APK (direct install)

Store upload is optional. To produce an **`.apk`** for sideloading:

```bash
cd mobile
npm install -g eas-cli
eas login
eas build --platform android --profile apk
```

Download the artifact from the EAS dashboard when the build completes. Users must allow **install from unknown sources** for your chosen install method.

---

## Project structure

```
Avurudu-Nakath/
├── mobile/
│   ├── App.tsx
│   ├── app.json
│   ├── eas.json
│   ├── assets/                 # App icon, splash, ritual artwork
│   └── src/
│       ├── data/               # 2026 almanac + Tamil copy bundle
│       ├── components/         # UI, hero, compass, banners
│       ├── hooks/
│       ├── i18n/
│       ├── utils/              # Time, active nakath, animations
│       └── notifications.ts
├── server/
│   ├── index.js
│   ├── seed.js
│   ├── models/
│   ├── Dockerfile
│   └── .env.example
├── .gitignore
└── README.md
```

---

## npm scripts

| Location | Command | Description |
|----------|---------|-------------|
| `mobile/` | `npm start` | Start Expo dev server |
| `mobile/` | `npm run android` | Open on Android |
| `mobile/` | `npm run ios` | Open on iOS |
| `mobile/` | `npm run web` | Open in web browser |
| `server/` | `npm start` | Start API (`PORT` default `4000`) |
| `server/` | `npm run seed` | Seed MongoDB |

---

## Contributing

1. Fork the repository  
2. Create a feature branch from `main`  
3. Make focused commits and follow existing code style  
4. Open a pull request  

---

## Disclaimer

Nakath times are provided for **cultural and informational** purposes only. For religious or legal decisions, confirm times with your preferred official almanac or authority.

---

## Acknowledgements

Built with [Expo](https://expo.dev/) and the React Native community.
