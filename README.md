# TripPlan Dashboard ✈️

> **Better trips. Less stress.**  
> A full-stack travel planning platform built with **React.js**, **Tailwind CSS**, **Node.js**, **Express.js**, **MongoDB / Mongoose**, and **JWT Authentication**, meticulously aligned with the reference design.

---

## 🌟 Key Features

1. **Dashboard (Pixel-Perfect Match to Reference Design)**:
   - **Left Sidebar**: Brand logo, quick search (`⌘K`), navigation (`Home`, `Trips`, `Explore`, `Budget`, `Itinerary`, `Saved`, `Settings`), promo banner with Mount Fuji, and user profile card (`Shihab, Free Plan`).
   - **Top Navigation Bar**: Global search bar (*"Where do you want to go?"*), live notification bell with badge counter and dropdown, user avatar with account switcher & 1-click demo login, and **+ New Trip** quick action button.
   - **Hero Banner**: High-resolution Mount Fuji twilight view, personalized greeting (*"Good morning, Shihab"*), gradient title (*"Plan your next adventure"*), 4 pill stat indicators (*2 People*, *5 Nights*, *$3,680 Budget*, *NRT Airport*), and a floating glassmorphic *"Your next trip Tokyo, Japan"* preview card.
   - **Day Selector Tabs**: Seamless switcher for *Day 1 (Shibuya)*, *Day 2 (Tradition)*, *Day 3 (Akihabara)*, *Day 4 (Nightlife)*, and *Day 5 (Departure)*.
   - **Arrivals & Itinerary Card**: Color-coded timeline dots (*#3B82F6*, *#0284C7*, *#EAB308*, *#22C55E*, *#F97316*, *#EF4444*), activity titles, duration pills (`90m`, `60m`, etc.), with **+ Add Activity** modal and quick edit/delete actions.
   - **Budget Breakdown Card**: 6 category breakdown cards (*Flights 33.7% - $1,240*, *Hotels 28.5% - $1,050*, *Food 18.5% - $680*, *Activities 11.4% - $420*, *Transport 5.2% - $190*, *Other 2.7% - $100*), live animated category progress bar, and **+ Add Expense** modal.
   - **Neighborhood Guide**: 4 cards with authentic photography and tags (*Shibuya / Energy*, *Asakusa / Tradition*, *Shinjuku / Energy*, *Akihabara / Tech & Anime*).
   - **Right Sidebar**:
     - *Trip Summary Card*: Dates, Travelers, Total Budget, Airport, and gradient *"View Full Details"* button.
     - *Quick Actions*: Edit Itinerary, Manage Budget, View Documents, Add to Calendar (`.ics` calendar file export).
     - *Inspiration Quote Card*: Tokyo Tower sunset background with *"Good trips create great stories. Make yours unforgettable."*
     - *Assistance Card*: *"Need assistance? Our team is here to help you."* with support link.

2. **Trip Management (`/trips`)**:
   - Create new trips with destination, start/end dates, budget, airport, and travelers.
   - Switch active trip in one click with reactive dashboard sync.
   - Delete past or completed trips.

3. **Itinerary Planner (`/itinerary`)**:
   - Filter activities by Day 1–5.
   - Interactive activity completion checkboxes with strike-through styling.
   - Add, edit, and delete activities with customizable start times and color badges.

4. **Budget Management (`/budget`)**:
   - Real-time calculations: Total Budget, Amount Spent, Remaining Balance, and % Spent.
   - Interactive category pills with icons.
   - Transaction ledger table with dates, categories, payment methods, and delete actions.

5. **Explore & Bookmarking (`/explore`)**:
   - Discover attractions in Tokyo, Kyoto, Paris, and more.
   - Filter by categories (*Sightseeing, Culture, Nightlife, Food, Art & Tech, Nature, Shopping*).
   - Instant bookmarking (*Save / Unsave Place*) with confetti celebration.
   - Direct *"Add to Itinerary"* shortcut from any place card.

6. **Saved Places (`/saved`)**:
   - Dedicated collection of bookmarked places with notes and ratings.
   - Quick *"Add to Itinerary"* action and removal options.

7. **Settings & Export (`/settings`)**:
   - Update user profile name and preferences.
   - Currency switcher (USD, EUR, GBP, JPY, INR).
   - Appearance theme switcher (Space Cadet Dark, Midnight Glow, Obsidian Dim).
   - **Data Export (JSON)**: Download full trip, itinerary, and expense database.
   - **Print / PDF**: Print-friendly summary layout.

8. **Backend & Dual-Mode Database**:
   - **MongoDB with Mongoose**: Connects automatically when `MONGODB_URI` is provided (e.g., `mongodb://127.0.0.1:27017/tripplan` or Atlas).
   - **Intelligent Fallback JSON Store**: If MongoDB is not running locally, seamlessly switches to an internal file-backed database (`backend/data/db_store.json`), pre-seeded with Shihab's Tokyo trip so everything works out of the box with zero setup friction!
   - **JWT Authentication**: Password hashing with `bcryptjs`, JWT verification middleware, protected endpoints.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v25)
- **npm** v9+

### 2. Running Backend
```bash
cd backend
npm install
npm start
```
*Backend runs at `http://localhost:5000` with automated health check at `http://localhost:5000/api/health`.*

### 3. Running Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:3000`.*

---

## 🗄️ API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | Sign in with email and password |
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/me` | GET | Retrieve authenticated user profile |
| `/api/trips` | GET, POST | Get all trips or create a new trip |
| `/api/trips/active` | GET | Get active trip with activities, expenses, and budget summary |
| `/api/trips/:id/activate` | PUT | Set selected trip as active |
| `/api/trips/:id/activities` | GET, POST | Get or add activities to a trip |
| `/api/trips/:id/activities/:activityId` | PUT, DELETE | Update or remove an itinerary activity |
| `/api/trips/:id/expenses` | GET, POST | Get or add expenses to a trip |
| `/api/trips/:id/expenses/:expenseId` | PUT, DELETE | Update or remove an expense |
| `/api/saved-places` | GET, POST, DELETE | Bookmark or remove saved places |
| `/api/explore` | GET | Search attractions and neighborhood guides |
| `/api/notifications` | GET, PUT | View and mark notifications as read |

---

## 🎨 Design System
- **Background**: `#0B0E17` (Deep space cadet dark)
- **Cards**: `#121927` / `#18233C` with glassmorphic borders `rgba(255, 255, 255, 0.08)`
- **Accents**: Indigo & Purple gradients (`from-blue-500 via-indigo-600 to-purple-600`)
- **Typography**: Plus Jakarta Sans & JetBrains Mono
