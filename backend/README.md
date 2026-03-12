# 365System — Backend API

> Everyone has goals. Few have systems.

FastAPI backend for 365System. Connects to Supabase (PostgreSQL) for storage.

---

## Stack
- **FastAPI** — Python web framework
- **Supabase** — PostgreSQL database
- **JWT** — Authentication
- **Render** — Deployment

---

## Setup — Step by Step

### 1. Supabase Setup
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (remember your database password)
3. Go to **SQL Editor** → paste the entire contents of `schema.sql` → Run
4. Go to **Settings → API**:
   - Copy **Project URL** → this is your `SUPABASE_URL`
   - Copy **service_role** key (not anon key) → this is your `SUPABASE_SERVICE_KEY`

### 2. Local Development
```bash
# Clone and enter directory
cd 365system-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Fill in your SUPABASE_URL, SUPABASE_SERVICE_KEY, and a random JWT_SECRET

# Run locally
uvicorn main:app --reload
```

API docs available at: `http://localhost:8000/docs`

### 3. Generate JWT Secret
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```
Copy the output into your `.env` as `JWT_SECRET`

### 4. Deploy to Render
1. Push this folder to a GitHub repo (e.g. `365system-backend`)
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Render will auto-detect `render.yaml`
5. Add environment variables in Render dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your Netlify URL once deployed)
6. Deploy — your API URL will be `https://365system-api.onrender.com`

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Sign in, get token |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/me` | Get profile |
| POST | `/user/onboard` | Complete onboarding |
| PUT | `/user/settings` | Update settings |

### Daily
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/daily/{date}` | Get day log |
| GET | `/daily/range/{start}/{end}` | Get date range |
| POST | `/daily/` | Save day log |

### Journal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/journal/{date}` | Get day journals |
| GET | `/journal/pillar/{pillar_id}` | Get pillar archive |
| POST | `/journal/` | Save journal entry |
| POST | `/journal/lock/{date}` | Lock past day |

### Pillars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pillars/` | Get user pillars |

---

## Frontend Connection
Once deployed, update your React app's API base URL to your Render URL.

All requests need the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Project Structure
```
365system-backend/
├── main.py              # FastAPI app entry
├── requirements.txt
├── render.yaml          # Render deployment config
├── schema.sql           # Supabase database schema
├── .env.example
└── app/
    ├── config.py        # DB, JWT, auth helpers
    ├── models/
    │   └── schemas.py   # Pydantic models
    └── routers/
        ├── auth.py
        ├── user.py
        ├── daily.py
        ├── journal.py
        └── pillars.py
```
