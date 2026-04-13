# Avurudu Nakath

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat&logo=react)](https://reactnative.dev/)

**Avurudu Nakath** is a cross-platform mobile app for **Sinhala & Hindu New Year** auspicious times (**nakath**) for **2026**. All times use **Asia/Colombo** (UTC+05:30).

The app is **fully offline for the schedule**: nakath data is plain TypeScript/JSON in [`mobile/src/data/nakath2026.ts`](mobile/src/data/nakath2026.ts). This project does **not** use **MongoDB**, **SQL**, or any other **server database**. There is **no backend**, **no API**, and **no `.env` required** for the app to run.

| | |
|---|---|
| **GitHub** | [senalanuraheesara/Avurudu-Nakath](https://github.com/senalanuraheesara/Avurudu-Nakath) |
| **Expo slug** | `avurudu-nakath` |
| **Code** | `mobile/` |
| **Data** | In-app only — **no MongoDB**, no remote DB |

---

## Table of contents

- [Features](#features)
- [Data storage (no database server)](#data-storage-no-database-server)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Android APK build](#android-apk-build)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)

---

## Features

| Area | What you get |
|------|----------------|
| **Almanac** | Full 2026 nakath list bundled in the app |
| **Hero** | Large “active” nakath view with themed artwork and motion |
| **Countdown** | Timer to the next upcoming nakath |
| **සීට්ටුව** | Full scrollable list; completed items drop off after a short grace period |
| **Languages** | **සිංහල**, **English**, **தமிழ்** |
| **Notifications** | Local reminders for upcoming nakath times (where the OS allows) |
| **Compass** | Bearing helper for rituals that specify a direction |
| **Mute** | Per–nakath mute for notification reminders |

---

## Data storage (no database server)

- All nakath times and copy ship **inside the app** (see `mobile/src/data/`).
- **MongoDB is not used** and there is **no** database connection string or seed step.
- Optional **AsyncStorage** on the device may store only small preferences (e.g. muted rituals), not a MongoDB file or cloud DB.

---

## Tech stack

| Layer | Details |
|-------|---------|
| Framework | [Expo](https://expo.dev/) SDK ~54, [React Native](https://reactnative.dev/) 0.81 |
| UI | React 19, TypeScript |
| Native bits | `expo-notifications`, `expo-location`, `expo-sensors`, `react-native-svg`, etc. |
| Release builds | [EAS Build](https://docs.expo.dev/build/introduction/) — see [`mobile/eas.json`](mobile/eas.json) (`apk` profile for installable APKs) |

---

## Prerequisites

- [Node.js](https://nodejs.org/) **LTS** (20.x or 22.x)
- **npm** (bundled with Node)
- For on-device dev: [Expo Go](https://expo.dev/go) on a phone, or Android Studio / Xcode simulators

---

## Getting started

```bash
git clone https://github.com/senalanuraheesara/Avurudu-Nakath.git
cd Avurudu-Nakath/mobile
npm install
npm start
```

Then:

- Press **`a`** — Android emulator  
- Press **`i`** — iOS simulator (macOS + Xcode)  
- Scan the QR code — **Expo Go** on a physical device  

You do **not** need MongoDB, a database server, an API URL, or any `.env` file to run or develop the app.

---

## Android APK build

To build an **`.apk`** you can share or sideload (outside Google Play):

1. Install the Expo CLI for builds: `npm install -g eas-cli`
2. Log in: `eas login`
3. From `mobile/`:

```bash
cd mobile
eas build --platform android --profile apk
```

4. When the build finishes, download the artifact from the [Expo dashboard](https://expo.dev/).

The Android application id is **`com.avurudu.nakath`** (see [`mobile/app.json`](mobile/app.json)). End users may need to allow installation from **unknown sources** for how you distribute the file.

---

## Project structure

```
Avurudu-Nakath/
├── README.md
├── .gitignore
└── mobile/
    ├── App.tsx                 # Root UI
    ├── app.json                # Expo config (name, icons, plugins)
    ├── eas.json                # EAS Build profiles (e.g. apk)
    ├── index.ts
    ├── assets/                 # Icons, splash, ritual images
    └── src/
        ├── data/               # nakath2026.ts — source of truth for times
        ├── components/         # Hero, list, compass, splash, …
        ├── hooks/              # useNakathEvents (bundled data only)
        ├── i18n/
        ├── utils/              # Time, active nakath, animations
        └── notifications.ts
```

---

## Scripts

Run these inside **`mobile/`**:

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo dev server (Metro) |
| `npm run android` | Open in Android emulator / device |
| `npm run ios` | Open in iOS simulator / device |
| `npm run web` | Run in the browser (Expo web) |

---

## Contributing

1. Fork the repo and create a branch from `main`.  
2. Keep changes focused; follow existing TypeScript and React patterns.  
3. Open a pull request with a short description of what changed.

---

## Disclaimer

Nakath times are for **cultural and general information** only. For religious practice or legal use, confirm with your own trusted almanac or authority.

---

## Acknowledgements

Made with [Expo](https://expo.dev/) and the React Native community.
