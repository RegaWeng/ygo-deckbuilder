# YGO Deck Builder

A full-stack Yu-Gi-Oh deck-building app combining a relational database (PostgreSQL) for user-owned data and a NoSQL database (MongoDB Atlas) as a flexible cache of the YGOPRODeck card catalog, with JWT authentication, role-based authorization, and asynchronous deck validation via RabbitMQ.

## Tech Stack

- **Backend:** Node.js, Express
- **Relational DB:** PostgreSQL — users, decks, deck_cards (ownership, referential integrity, quantity/section constraints)
- **NoSQL DB:** MongoDB Atlas — cached card catalog (14,500+ cards), irregular schema by card type
- **Auth:** JWT + bcrypt, 4-tier roles (guest/user/worker/super_admin)
- **Async processing:** RabbitMQ — deck construction rule validation, decoupled from the request/response cycle
- **Containerization:** Docker Compose (Postgres, app, RabbitMQ, worker)
- **Testing:** Jest + Supertest

## Architecture

Client → Express API → PostgreSQL (users/decks/deck_cards) + MongoDB Atlas (card catalog)
API → RabbitMQ → Worker process → writes validation results back to PostgreSQL

Card `card_id` references in `deck_cards` are validated at the application layer against MongoDB, since PostgreSQL cannot enforce foreign keys across database engines.

## Setup

1. Clone this repository
2. Create a `.env` file in the project root:

\`\`\`
PORT=3000
JWT_SECRET=your_secret_here
PGHOST=postgres
PGUSER=postgres
PGPASSWORD=choose_a_password
PGDATABASE=ygo_deckbuilder
PGPORT=5432
MONGO_URI=your_mongodb_atlas_connection_string
ALLOWED_ORIGIN=*
\`\`\`

3. Run:
\`\`\`
docker-compose up --build
\`\`\`
4. App: `http://localhost:3000` — RabbitMQ dashboard: `http://localhost:15672` (guest/guest)

## Default Admin Account

A `super_admin` account is seeded automatically on first container start:
- Username: `admin`
- Password: `adminpass123`

**Change this password if required** via `PUT /change-password` after first login — it's a known, documented default for demo/grading purposes only.

## Seeding the Card Catalog

MongoDB Atlas needs to be populated once with YGOPRODeck's card data:
\`\`\`
node scripts/seedCards.js
\`\`\`
Run this outside Docker, with `.env`'s `MONGO_URI` pointing at your Atlas cluster. Only needs to be run once — the collection persists in Atlas independently of the Docker containers.

## API Documentation

Interactive docs available at `http://localhost:3000/api-docs` once the server is running. A Postman collection is also included in this repository.

## Running Tests

\`\`\`
npm test
\`\`\`

## Known Limitations

- Card images are hotlinked directly from YGOPRODeck's CDN rather than self-hosted .
- The `worker` role is fully implemented (schema, middleware, JWT-independent role checks) but has no assigned permissions yet.
- Password recovery uses a returned token rather than real email delivery, i didnt implement OAuth.