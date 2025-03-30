# 🚂 Train Tracker
## ✨ Project Overview
Train Tracker is an application that displays train locations on a map based on data retrieved from the DigiTraffic API. It is designed to allow users to visually track train movements in real time.
### ✅ Key Feature:
- Retrieve train location data from the DigiTraffic API
- Display train locations on a map
- Auto-update train locations
- Display detailed train information (Train No, Speed, Train Type, Train Category)
- Search for a city using the search bar and display train information for that city

## ✨ Getting Started
### ✅ Requirements
- Mapbox access token (Required to display the map)
### ✅ Installation
1. Clone repo
```sh
git clone https://github.com/your-repo/train-tracker.git
cd train-tracker
```
2. Install dependencies
```sh
npm install
```
3. Setup `.env.local` file

    Create a `.env.local` file in the project root and add the following content.
```ini
NEXT_PUBLIC_URL="API BASE URL"
NEXT_PUBLIC_MAPBOX_TOKEN="YOUR ACCESS TOKEN"
```
4. Start app
```sh
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ✨ Technical Architecture
- **Front-end**: React, Next.js(App Router), TypeScript, TailwindCSS, Mapbox
- **Back-end**: Next.js API Routes (Integration with the DigiTraffic API)
- **Data Source**: DigiTraffic API - [Docs](https://www.digitraffic.fi/en/railway-traffic/)
- **Deployment**: Vercel - [Deployed app](https://fictional-succotash-sandy.vercel.app/)