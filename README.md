# Avurudu Nakath

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat&logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?style=flat&logo=react)](https://reactnative.dev/)

Mobile app for **Sinhala & Hindu New Year** auspicious times (**nakath**) for **2026**.

- **Timezone**: Asia/Colombo (UTC+05:30)
- **Offline-first**: the nakath schedule is bundled in the app (no backend / no API)
- **Languages**: Sinhala, English, Tamil

**Repository**: `https://github.com/senalanuraheesara/Avurudu-Nakath`  
**Expo project**: `avurudu-nakath`  
**Android applicationId**: `com.avurudu.nakath` (see `mobile/app.json`)

---

## Table of contents

- [Features](#features)
- [Data (no backend, no database server)](#data-no-backend-no-database-server)
- [Requirements](#requirements)
- [Run locally](#run-locally)
- [Build Android APK (sideload)](#build-android-apk-sideload)
- [Release builds](#release-builds)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)

---

## Features

- **Active nakath hero** with themed artwork and motion
- **Countdown** to the next upcoming nakath
- **Full list (සීට්ටුව)** with “past” state and per‑nakath mute for reminders
- **Local notifications** (where supported by the OS)
- **Compass** for direction-facing rituals
- **Sinhala / English / Tamil**

---

## Data (no backend, no database server)

- Source of truth: `mobile/src/data/nakath2026.ts`
- No MongoDB / SQL / server DB and no connection strings
- On-device storage (AsyncStorage) is used only for small preferences (e.g. muted nakaths)

---

## Requirements

- **Node.js** LTS (20.x or 22.x)
- **npm** (bundled with Node)
- One of:
  - **Expo Go** on a phone, or
  - Android Studio emulator / iOS simulator (macOS + Xcode)

---

## Run locally

```bash
git clone https://github.com/senalanuraheesara/Avurudu-Nakath.git
cd Avurudu-Nakath/mobile
npm install
npm start
```

Then:

- Press `a` for Android
- Press `i` for iOS (macOS only)
- Or scan the QR with Expo Go

---

## Build Android APK (sideload)

This creates an installable **`.apk`** file you can share directly (no Play Store).

```bash
cd mobile
npm install
npm install -g eas-cli
eas login
eas build --platform android --profile apk
```

Download the APK from the Expo build page when the build finishes.

If you changed **icons**, `app.json`, native plugins, or dependencies, you **must** create a new build to see those changes on a device.

---

## Release builds

- Latest Android build (EAS): `https://expo.dev/accounts/senalanuraheesara/projects/avurudu-nakath/builds/e2d9d96d-f5ab-41b6-aba8-6cd1a11baad7`

Note: Android launchers can cache icons. If the icon doesn’t change after installing a new APK, uninstall the old app once and install again.

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
