# 🏠 ServiceHub — Neighbourhood Service Marketplace

> **Hackathon Project** | Full-Stack MERN Application  
> Track 1: Web Development
> Connect homeowners with verified local service professionals — instantly.

### 👥 Team Members
- **Kishan Kumar**
- **Lucky Jaiswal**
- **Lakshman Kashyap**
- **Mithlesh Kumar**

---

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://mongodb.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)

---

## 📸 Features

- 🔍 **Search & Filter** — Search services by keyword and city location
- 👤 **Authentication** — JWT-based login/register with role support (User & Provider)
- 📅 **Booking System** — Book appointments with date, time, address — stored in MongoDB
- 🌗 **Dark / Light Mode** — Full dark mode across all pages
- 📖 **My Bookings** — Customers track orders; providers accept/decline/complete jobs
- 🏅 **Provider Profiles** — Ratings, reviews, categories, hourly rate
- 📱 **Responsive** — Mobile-first design with premium glassmorphism UI

---

## 🛠️ Tech Stack

### Frontend
| Tech | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool & dev server |
| Tailwind CSS | 3 | Utility-first styling |
| Framer Motion | 11 | Animations |
| React Router | 6 | Client-side routing |
| Lucide React | latest | Icons |
| shadcn/ui | latest | UI component library |
| date-fns | latest | Date formatting |

### Backend
| Tech | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4 | Web framework |
| MongoDB | Atlas | Database |
| Mongoose | 8 | ODM for MongoDB |
| JWT | 9 | Authentication tokens |
| bcrypt | 5 | Password hashing |
| cookie-parser | 1 | Cookie handling |
| CORS | 2 | Cross-origin requests |
| dotenv | 16 | Environment variables |

---

## 📁 Project Structure

```
Parth2.0_KishanKumar/
└── Neighbourhood_Service_Marketplace/
    ├── backend/                    # Node.js + Express API
    │   ├── config/
    │   │   └── db.js               # MongoDB connection
    │   ├── middleware/
    │   │   └── auth.js             # JWT verification middleware
    │   ├── model/
    │   │   ├── user.js             # User schema (customer/provider)
    │   │   ├── providerProfile.js  # Provider profile schema
    │   │   ├── booking.js          # Booking schema
    │   │   └── review.js           # Review schema
    │   ├── routes/
    │   │   ├── auth.js             # /api/auth (login, register, logout, me)
    │   │   ├── providers.js        # /api/providers
    │   │   ├── bookings.js         # /api/bookings
    │   │   └── reviews.js          # /api/reviews
    │   ├── seed.js                 # Database seed script
    │   ├── server.js               # Express app entry point
    │   ├── .env                    # 🔒 NOT committed — see .env.example
    │   └── .env.example            # Template for environment variables
    │
    └── frontend/                   # React + Vite app
        ├── public/
        ├── src/
        │   ├── app/
        │   │   ├── components/     # Reusable UI components
        │   │   │   ├── Navbar.tsx
        │   │   │   ├── Footer.tsx
        │   │   │   ├── ServiceCard.tsx
        │   │   │   └── CategoryCard.tsx
        │   │   ├── context/
        │   │   │   └── AppContext.tsx   # Global user + theme state
        │   │   ├── pages/
        │   │   │   ├── Home.tsx
        │   │   │   ├── ServiceListings.tsx
        │   │   │   ├── ProviderProfile.tsx
        │   │   │   ├── Booking.tsx
        │   │   │   ├── MyBookings.tsx
        │   │   │   ├── Auth.tsx
        │   │   │   ├── Settings.tsx
        │   │   │   └── NotFound.tsx
        │   │   ├── routes.tsx          # React Router config
        │   │   └── App.tsx
        │   └── styles/
        │       ├── index.css
        │       └── theme.css           # Design system & CSS variables
        ├── index.html
        ├── tailwind.config.js
        ├── vite.config.ts
        └── package.json
```

---

## ⚙️ Requirements & Setup

### Prerequisites

Make sure you have these installed:

```
Node.js  >= 18.0.0     https://nodejs.org
npm      >= 9.0.0      (comes with Node.js)
Git      >= 2.x        https://git-scm.com
```

A free **MongoDB Atlas** account: https://cloud.mongodb.com

---

### 1. Clone the Repository

```bash
git clone https://github.com/kishanyadav5436/Parth2.0_KishanKumar.git
cd Parth2.0_KishanKumar/Neighbourhood_Service_Marketplace
```

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxx.mongodb.net/?appName=Cluster0
JWT_SECRET=your_strong_secret_here
```

Start the backend server:

```bash
# Development (with auto-restart)
npm run dev

# OR Production
npm start
```

The API will be running at: **http://localhost:5000**

#### (Optional) Seed the Database

```bash
node seed.js
```

This creates sample providers with categories and reviews.

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at: **http://localhost:5173**

> The Vite dev server proxies `/api/*` requests to `http://localhost:5000` automatically.

---

### 4. Run Both Simultaneously (from project root)

```bash
cd Neighbourhood_Service_Marketplace

# Install root concurrently package
npm install

# Run backend + frontend together
npm run dev
```

---

## 🔑 API Endpoints

### Auth (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | ❌ | Register new user/provider |
| POST | `/login` | ❌ | Login and get cookie |
| POST | `/logout` | ❌ | Clear auth cookie |
| GET | `/me` | ✅ | Get current user info |

### Providers (`/api/providers`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | ❌ | List all providers (filter: `?category=`) |
| GET | `/:id` | ❌ | Get single provider profile |
| POST | `/profile` | ✅ Provider | Create/update provider profile |

### Bookings (`/api/bookings`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | ✅ | Create new booking |
| GET | `/` | ✅ | Get user's bookings |
| GET | `/:id` | ✅ | Get single booking |
| PATCH | `/:id/status` | ✅ | Update booking status |

### Reviews (`/api/reviews`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | ✅ | Submit a review |
| GET | `/provider/:userId` | ❌ | Get provider's reviews |

---

## 🌐 Pages & Routes

| Route | Page | Auth Required |
|-------|------|--------------|
| `/` | Home | ❌ |
| `/services` | All Services | ❌ |
| `/services/:category` | Category Listings | ❌ |
| `/provider/:id` | Provider Profile | ❌ |
| `/booking/:providerId` | Book Service | ✅ |
| `/bookings` | My Bookings | ✅ |
| `/auth` | Login / Register | ❌ |
| `/settings` | Account Settings | ✅ |

---

## 👥 User Roles

| Feature | Customer (user) | Provider |
|---------|----------------|---------|
| Browse services | ✅ | ✅ |
| Book a service | ✅ | ❌ |
| View own bookings | ✅ | ✅ |
| Accept/decline bookings | ❌ | ✅ |
| Mark booking complete | ❌ | ✅ |
| Leave reviews | ✅ | ❌ |
| Create provider profile | ❌ | ✅ |

---

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your_atlas_uri>
JWT_SECRET=<strong_random_secret>
```

### Build Frontend

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## 📝 License

MIT © 2026 — Built with ❤️ for Hackathon by **Kishan Kumar & Team**

---

> **Hackathon Note:** This project was built as part of a hackathon. The codebase focuses on demonstrating full-stack integration, premium UI/UX design, and functional data persistence using MongoDB.

