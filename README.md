# WealthPilot AI 💰

A full-stack AI-powered Wealth Management application built with **React + Vite + Tailwind CSS** (frontend) and **FastAPI + PostgreSQL** (backend).

---

## 📁 Project Structure

```
wealthpilot/
├── backend/                  # FastAPI backend
│   ├── main.py               # FastAPI app entry point
│   ├── database.py           # SQLAlchemy DB connection
│   ├── models.py             # ORM models (User, Profile, Goal, Portfolio)
│   ├── schemas.py            # Pydantic schemas
│   ├── auth.py               # JWT authentication utilities
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment variables template
│   └── routers/
│       ├── auth.py           # Register / Login endpoints
│       ├── profile.py        # User profile CRUD
│       ├── goals.py          # Financial goals CRUD
│       └── portfolio.py      # Investment portfolio CRUD
│
└── frontend/                 # React + Vite frontend
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example          # Frontend env template
    └── src/
        ├── main.jsx          # React entry point
        ├── App.jsx           # Routes & layout
        ├── index.css         # Tailwind base styles
        ├── api/
        │   └── axios.js      # Axios instance with JWT interceptor
        ├── context/
        │   └── AuthContext.jsx  # Auth state (login/logout/token)
        ├── components/
        │   ├── Sidebar.jsx   # Navigation sidebar
        │   ├── Navbar.jsx    # Top navigation bar
        │   ├── PrivateRoute.jsx  # Route guard
        │   └── Loader.jsx    # Loading spinner
        └── pages/
            ├── Login.jsx     # Login page
            ├── Signup.jsx    # Registration page
            ├── Dashboard.jsx # Main dashboard with stats
            ├── Profile.jsx   # User profile management
            ├── Goals.jsx     # Financial goals tracker
            └── Portfolio.jsx # Investment portfolio manager
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 14+

---

### Backend Setup

```bash
cd wealthpilot/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and a strong SECRET_KEY

# Run the server
uvicorn main:app --reload --port 8000
```

API docs available at: http://localhost:8000/docs

---

### Frontend Setup

```bash
cd wealthpilot/frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit VITE_API_URL if your backend runs on a different port

# Start dev server
npm run dev
```

App available at: http://localhost:5173

---

## 🔑 Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | JWT signing secret (use a long random string) |
| `ALGORITHM` | JWT algorithm (default: HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry in minutes |

### Frontend `.env`
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Login and receive JWT token |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile/` | Get user profile |
| POST | `/profile/` | Create profile |
| PUT | `/profile/` | Update profile |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/goals/` | List all goals |
| POST | `/goals/` | Create a goal |
| PUT | `/goals/{id}` | Update a goal |
| DELETE | `/goals/{id}` | Delete a goal |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolio/` | List all investments |
| POST | `/portfolio/` | Add investment |
| PUT | `/portfolio/{id}` | Update investment |
| DELETE | `/portfolio/{id}` | Delete investment |

---

## 🎨 Features

- **🔐 Authentication** — JWT-based register/login with protected routes
- **👤 Profile Management** — Personal info, risk tolerance, annual income
- **🎯 Goals Tracker** — Create and track financial goals with progress bars
- **📈 Portfolio Manager** — Track investments with real-time P&L calculations
- **📊 Dashboard** — Overview of portfolio value, goals, and recent activity
- **🌙 Dark Theme** — Full dark UI with Tailwind CSS + indigo/purple accents

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| HTTP Client | Axios |
| Backend | FastAPI, Python 3.9+ |
| ORM | SQLAlchemy |
| Database | PostgreSQL |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Validation | Pydantic v2 |

---

## 📝 License

MIT License — built for the WealthPilot AI PRD use case.
