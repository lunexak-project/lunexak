# Setup Guide

This guide sets up LunexAK locally with the API server on port `5000` and the Next.js client on port `3000`.

## Prerequisites

- Node.js 20 or newer
- npm
- MongoDB connection string, either from MongoDB Atlas or a local MongoDB instance

## 1. Install Dependencies

Install server dependencies:

```bash
cd lunexak-server
npm install
```

Install client dependencies:

```bash
cd ../lunexak-client
npm install
```

## 2. Configure the Server

Create the server environment file:

```bash
cd ../lunexak-server
cp .env.example .env
```

Update `.env` with your values. The server accepts either `MONGO_URI` or `MONGODB_URI` for the MongoDB connection string:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lunexak
JWT_SECRET=replace_with_a_long_random_secret
JWT_REFRESH_SECRET=replace_with_another_long_random_secret
CORS_ORIGIN=http://localhost:3000
```

If you keep the `MONGODB_URI` name from `.env.example`, the server will use that value automatically.

## 3. Configure the Client

Create the client environment file:

```bash
cd ../lunexak-client
cp .env.example .env.local
```

The client source currently calls the API directly at `http://localhost:5000/api`, so the default local setup works with the server port above.

## 4. Start Development Servers

Start the API server:

```bash
cd lunexak-server
npm run dev
```

Start the client in another terminal:

```bash
cd lunexak-client
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## 5. Useful Commands

Client:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

Server:

```bash
npm run dev
npm start
```

## 6. Git Hygiene

The root `.gitignore` excludes `node_modules`, `.env`, `.next`, logs, uploads, and other generated files.

If dependencies or local secrets were already staged, untrack them before committing:

```bash
git rm -r --cached lunexak-server/node_modules
git rm --cached lunexak-server/.env
```

Only run those commands if the files are currently tracked or staged.
