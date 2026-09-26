# Student Toolkit — Backend

Express + MongoDB backend that adds Google login and cloud storage to the
Student Toolkit frontend.

## 1. Install dependencies

```bash
cd server
npm install
```

## 2. Get a MongoDB connection string (free)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a free **M0 cluster**.
3. Under **Database Access**, create a database user + password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) for now — tighten later.
5. Click **Connect > Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/`
6. Add a database name to the end, e.g. `.../studenttoolkit?retryWrites=true...`

## 3. Get a Google Client ID (free)

1. Go to https://console.cloud.google.com/ and create a project.
2. Go to **APIs & Services > OAuth consent screen** — set it to "External", fill
   basic info, add your email as a test user (while in testing mode).
3. Go to **APIs & Services > Credentials > Create Credentials > OAuth client ID**.
4. Application type: **Web application**.
5. Under **Authorized JavaScript origins**, add the URL your frontend runs on,
   e.g. `http://127.0.0.1:5500` (VS Code Live Server default) — and later your
   real domain once deployed.
6. Copy the **Client ID** (looks like `xxxxx.apps.googleusercontent.com`).
   You do NOT need the client secret for this flow.

## 4. Configure environment variables

```bash
cp .env.example .env
```
Fill in `MONGODB_URI`, `GOOGLE_CLIENT_ID`, `JWT_SECRET`, and `CLIENT_ORIGIN`
in `.env`.

## 5. Run the server

```bash
npm run dev
```
You should see:
```
✅ MongoDB connected
🚀 Server running at http://localhost:5000
```

## 6. Point the frontend at it

Open `js/auth.js` in the main project and set:
```js
var API_BASE = 'http://localhost:5000';
```
to match wherever this server is running (change it again when you deploy
the backend to Render/Railway later).

## API summary

| Method | Route | Auth? | Purpose |
|---|---|---|---|
| POST | `/api/auth/google` | No | Verify Google token, log in / sign up, return our own JWT |
| GET | `/api/auth/me` | Yes | Check current session, get logged-in user |
| GET | `/api/todos` | Yes | List the logged-in user's todos |
| POST | `/api/todos` | Yes | Create a todo |
| PATCH | `/api/todos/:id` | Yes | Update a todo |
| DELETE | `/api/todos/:id` | Yes | Delete a todo |

`todos.js` is a **template** — copy the same pattern (a Mongoose model with
a `userId` field + a router that calls `requireAuth`) for every other tool
you want to sync to the cloud: CGPA records, attendance, resume data, etc.
