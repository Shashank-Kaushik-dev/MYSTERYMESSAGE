# MysteryMessage

A privacy-first anonymous messaging web app built with Next.js, NextAuth, Mongoose and Resend for verification emails.

## Features

- Anonymous message sending with optional suggestions
- Email verification flow for sign-up and message acceptance
- User dashboard to view and accept messages
- API routes for sending, suggesting, accepting and deleting messages
- Mongoose-powered MongoDB persistence

## Tech stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- NextAuth for authentication
- Mongoose for MongoDB
- Resend (or SMTP) for verification emails
- Tailwind CSS + shadcn/ui for UI components

## Quick start

1. Clone the repo

```bash
git clone https://github.com/<your-username>/mysterymessage.git
cd mysterymessage
```

2. Install dependencies

```bash
npm install
# or `pnpm install` / `yarn`
```

3. Create a `.env` file in the project root and add the required environment variables (see below).

4. Run the dev server

```bash
npm run dev
# app starts at http://localhost:3000 by default
```

5. Build for production

```bash
npm run build
npm run start
```

6. Linting

```bash
npm run lint
```

## Environment variables

Create a `.env` with at least the following variables (names may vary depending on your provider/config):

- `MONGODB_URI` — MongoDB connection string used by Mongoose
- `NEXTAUTH_URL` — The canonical site URL (e.g. `http://localhost:3000`)
- `NEXTAUTH_SECRET` — Secret for NextAuth
- `RESEND_API_KEY` — API key if using Resend for emails (or SMTP credentials below)
- `EMAIL_FROM` — Sender address used for verification emails

If you use SMTP instead of Resend, provide standard SMTP credentials (host, port, user, pass) in your helper configuration.

## Project structure (high level)

- [src/app](src/app) — Next.js App Router pages and layouts
- [src/app/api](src/app/api) — Serverless API routes (send-message, get-messages, verify-code, sign-up, etc.)
- [src/components](src/components) — React UI components (MessageCard, Navbar, shadcn/ui wrappers)
- [src/lib/dbConnect.ts](src/lib/dbConnect.ts) — MongoDB connection helper
- [src/model/User.ts](src/model/User.ts) — Mongoose user model
- [src/helpers/sendVerificationEmail.tsx](src/helpers/sendVerificationEmail.tsx) — Email helper
- [src/schemas](src/schemas) — Zod schemas for request validation
- [src/messages.json](src/messages.json) — Message suggestions seed data

## Key API endpoints

The app exposes API routes under `/api` (server-side routes). Notable endpoints:

- `POST /api/send-message` — Send an anonymous message
- `GET /api/get-messages` — Retrieve public/accepted messages
- `POST /api/accept-messages` — Accept a message (verification flow)
- `POST /api/verify-code` — Verify email codes
- `POST /api/sign-up` — Create a new user (verification required)
- `POST /api/suggest-messages` — Return suggested messages from suggestions list
- `DELETE /api/delete-message/[messageid]` — Delete a message by id

Refer to the files in [src/app/api](src/app/api) for exact request/response shapes.

## Authentication

Authentication is handled with NextAuth. See [src/app/api/auth/[...nextauth]](src/app/api/auth/[...nextauth]/route.ts) for provider and session configuration.

## Email verification

Verification and verification-code handling are implemented with helpers in [src/helpers/sendVerificationEmail.tsx](src/helpers/sendVerificationEmail.tsx) and the API route [src/app/api/verify-code/route.ts](src/app/api/verify-code/route.ts).

## Development notes

- Database connection details are in [src/lib/dbConnect.ts](src/lib/dbConnect.ts).
- Validation schemas are in [src/schemas] and use `zod`.
- UI components follow shadcn/ui patterns and live under [src/components/ui].

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a PR with a clear description

Please follow the code style in the repo and run lint before opening a PR.


