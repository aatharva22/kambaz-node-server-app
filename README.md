<h1 align="center">Kambaz — REST API Server</h1>

<p align="center">
  A production-style backend for a Canvas-inspired learning management system.<br/>
  Courses, modules, assignments, enrollments, and session-based multi-user auth.
</p>

<p align="center">
  <a href="https://github.com/aatharva22/kambaz-node-server-app/actions"><img alt="CI" src="https://github.com/aatharva22/kambaz-node-server-app/actions/workflows/ci.yml/badge.svg"/></a>
  <img alt="Node" src="https://img.shields.io/badge/node-%E2%89%A518.x-339933?logo=nodedotjs&logoColor=white"/>
  <img alt="Express" src="https://img.shields.io/badge/express-5.x-000000?logo=express&logoColor=white"/>
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white"/>
  <img alt="License" src="https://img.shields.io/badge/license-ISC-blue"/>
</p>

<p align="center">
  <b>🌐 Live client:</b> <a href="https://kambaz-next-js-xhy3.vercel.app">kambaz-next-js-xhy3.vercel.app</a> ·
  <b>💻 Frontend repo:</b> <a href="https://github.com/aatharva22/kambaz-next-js">kambaz-next-js</a>
</p>

---

## ✨ Why this project

Most "clone a SaaS" student projects ship a single-page CRUD demo and stop there. **Kambaz** is built to look like something a small team would actually keep running:

- **Session-based auth** with `express-session`, hardened for cross-site cookies in production (`sameSite=none; secure; trust proxy`).
- **Clean layering** — every domain (users, courses, modules, assignments, enrollments) follows the same `routes → DAO → schema` split, so adding a resource is mechanical, not creative.
- **Referential cleanup at the app layer** — deleting a course unenrolls every student in it; deleting a user doesn't strand sessions.
- **Deployed end-to-end** — Vercel frontend talking to a Node API with credentialed CORS, env-driven config, and a CI pipeline on every push.

---

## 🧩 What's in the box

```
┌──────────────────────┐         credentialed CORS         ┌────────────────────────┐
│  Next.js client       │  ──────────────────────────────▶  │  Express 5 REST API    │
│  (Vercel)             │                                   │  (this repo)           │
└──────────────────────┘  ◀──── session cookie ────────────  └──────────┬─────────────┘
                                                                       │ Mongoose
                                                              ┌────────▼─────────┐
                                                              │  MongoDB Atlas   │
                                                              └──────────────────┘
```

---

## 📚 API surface

| Resource | Endpoints | Notes |
|---|---|---|
| **Auth** | `POST /api/users/signup` · `/signin` · `/signout` · `GET /api/users/profile` | Server-side sessions; `userId=current` resolves from the cookie. |
| **Users** | `GET POST PUT DELETE /api/users[/:userId]` | Filter `?role=` or partial `?name=`. Roles: `STUDENT`, `FACULTY`, `ADMIN`, `USER`. |
| **Courses** | `GET /api/courses` · `POST /api/users/current/courses` · `PUT DELETE /api/courses/:courseId` | Creator is auto-enrolled in their new course. |
| **Enrollments** | `GET /api/users/:userId/enrollments` · `POST DELETE /api/users/:userId/enrollments/:courseId` · `GET /api/users/:userId/courses` | Many-to-many between users and courses. |
| **Modules** | `GET POST /api/courses/:courseId/modules` · `PUT DELETE /api/courses/:courseId/modules/:moduleId` | Nested under a course; supports inline lessons. |
| **Assignments** | `GET POST /api/courses/:courseId/assignments` · `GET PUT DELETE /api/assignments/:assignmentId` | |

### Try it

```bash
# 1. Sign up
curl -i -c cookies.txt -H 'Content-Type: application/json' \
  -d '{"username":"asonawane","password":"hunter2","firstName":"Atharva"}' \
  http://localhost:4000/api/users/signup

# 2. Create a course as the logged-in user (cookie sent automatically)
curl -i -b cookies.txt -H 'Content-Type: application/json' \
  -d '{"_id":"RS101","name":"Rocket Surgery","credits":4}' \
  http://localhost:4000/api/users/current/courses

# 3. List the courses you're enrolled in
curl -b cookies.txt http://localhost:4000/api/users/current/courses
```

---

## 🏗️ Architecture

Every domain follows the same three-layer pattern, so the codebase stays predictable as it grows:

```
Kambaz/
├── Users/         routes.js · dao.js · schema.js · model.js
├── Courses/       routes.js · dao.js · schema.js · model.js
├── Modules/       routes.js · dao.js · schema.js
├── Enrollments/   routes.js · dao.js · schema.js · model.js
├── Assignments/   routes.js · dao.js
└── Database/      in-memory seed data (dev fallback)
```

- **`routes.js`** — Express handlers only. No DB calls inline.
- **`dao.js`** — the *only* layer that touches Mongoose. Swap it out and the routes don't care.
- **`schema.js` / `model.js`** — Mongoose schema bound to a fixed collection name.

The top-level [`index.js`](index.js) wires CORS, sessions, JSON parsing, and registers every resource's router.

---

## 🚀 Quickstart

**Prerequisites:** Node 18+, and either a local `mongod` or a MongoDB Atlas URI.

```bash
git clone https://github.com/aatharva22/kambaz-node-server-app.git
cd kambaz-node-server-app
npm install
cp .env.example .env       # then edit values
npm run dev                # nodemon on http://localhost:4000
```

### `.env`

```bash
DATABASE_CONNECTION_STRING=mongodb://127.0.0.1:27017/kambaz
SESSION_SECRET=replace-me-with-a-long-random-string
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=4000
```

### Scripts

| Command | What it does |
|---|---|
| `npm start` | Start the server with Node. |
| `npm run dev` | Start with `nodemon` (auto-reload on file changes). |
| `npm run check` | Run `node --check` on every `.js` file — fast syntax pass. |
| `npm test` | Placeholder; CI runs `check` + boot smoke test. |

---

## ☁️ Deployment

Designed to run behind a reverse proxy (Render, Railway, Fly, Heroku-style PaaS):

- `app.set("trust proxy", 1)` so secure cookies survive the proxy hop.
- For any `NODE_ENV` other than `development`, cookies are issued with `sameSite=none; secure=true` — required for the Vercel-hosted frontend to send credentials cross-origin.
- `cors` is `credentials: true` with an allow-listed `CLIENT_URL`; no wildcard origins.

**CI** ([.github/workflows/ci.yml](.github/workflows/ci.yml)) runs on Node 18 and 20, installs deps with `npm ci`, syntax-checks every JS file, and boots the server for 3 seconds to catch wiring errors before merge.

---

## 🛣️ Roadmap

- [ ] Hash passwords with `bcrypt` and migrate existing users.
- [ ] Move sessions out of memory into Mongo / Redis so they survive restarts and scale horizontally.
- [ ] Add Jest + Supertest integration tests around auth and enrollment flows.
- [ ] Validate request bodies at the route boundary with Zod instead of trusting `req.body`.
- [ ] Add rate limiting (`express-rate-limit`) on auth endpoints.

---

## 🧰 Tech stack

`Node.js` · `Express 5` · `MongoDB` · `Mongoose` · `express-session` · `cors` · `dotenv` · `nodemon` · `GitHub Actions`

## 👤 Author

**Atharva Sonawane** — MS Computer Science, Northeastern University · Boston, MA
📧 atharvaboston10@gmail.com · 🔗 [LinkedIn](https://linkedin.com/in/atharva-sonawane-25b801227) · 💼 [Portfolio](https://github.com/aatharva22)

## 📄 License

ISC — see [LICENSE](LICENSE).
