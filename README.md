# LunexAK

LunexAK is a full-stack ecommerce application with a Next.js storefront/admin client and an Express + MongoDB API server.

## Project Structure

```text
LunexAK/
  lunexak-client/   Next.js 16, React 19, TypeScript, Tailwind CSS
  lunexak-server/   Express 5, Mongoose, JWT auth, order/product APIs
```

## Features

- Customer storefront with home sections, category pages, product details, cart, wishlist, checkout, account, login, and registration screens.
- Admin screens for dashboard metrics, products, product editing, product creation, and order management.
- REST API for authentication, products, orders, and dashboard statistics.
- MongoDB persistence through Mongoose models for users, products, and orders.
- JWT-based authentication helpers on the server and local-storage-backed auth state on the client.

## Tech Stack

### Client

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Axios
- Lucide React
- SweetAlert2

### Server

- Node.js
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens
- bcryptjs
- dotenv
- nodemon

## Local Development

See [SETUP.md](./SETUP.md) for full setup instructions.

Quick start:

```bash
cd lunexak-server
npm install
npm run dev
```

In a second terminal:

```bash
cd lunexak-client
npm install
npm run dev
```

The client runs at `http://localhost:3000` and the API runs at `http://localhost:5000`.

## API Overview

The server mounts these routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products`
- `GET /api/products/:id`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/user/:userId`
- `PUT /api/orders/:id`
- `GET /api/dashboard`

## Notes

- Do not commit real `.env` files or `node_modules`.
- The root `.gitignore` protects generated dependencies, builds, local env files, logs, uploads, and editor/OS artifacts.
- If `node_modules` or `.env` were already staged before this `.gitignore` was added, remove them from Git tracking with `git rm --cached` before committing.

