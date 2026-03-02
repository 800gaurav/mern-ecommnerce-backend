# Backend - MERN E-Commerce API

Express + MongoDB backend for authentication, role-based authorization, and product listing/management APIs.

## Features

- JWT auth (`register`, `login`, `me`)
- Role-based access control (`admin`, `user`)
- Admin product CRUD
- Server-side product filtering, search, sorting, pagination
- Input validation with `express-validator`
- Centralized error middleware
- MongoDB indexes for listing performance
- Seed script for admin + sample products

## Folder Structure

```text
Backend/
  src/
    config/db.js
    controllers/
    middleware/
    models/
    routes/
    utils/
    validators/
    app.js
    server.js
    seed.js
  .env.example
```

## Setup

```bash
cd Backend
npm install
cp .env.example .env
```

Update `.env` values:

- `MONGO_URI`
- `JWT_SECRET`
- `FRONTEND_URL`
- optional `ADMIN_*` seed values

## Run

```bash
npm run dev
```

Health check:

- `GET http://localhost:5000/api/health`

## Seed Data

```bash
npm run seed
```

Default admin (if unchanged):

- Email: `admin@example.com`
- Password: `Admin@123`

## Main API Endpoints

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)

## Products

- `GET /api/products` (public listing with filters)
- `GET /api/products/:id`
- `GET /api/products/admin/list` (admin)
- `POST /api/products` (admin)
- `PUT /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

## Listing Query Params

- `page`, `limit`
- `search`
- `category` (comma-separated for multi-select)
- `brand` (comma-separated for multi-select)
- `minPrice`, `maxPrice`
- `rating` (minimum)
- `inStock=true`
- `sort=newest|price_low_high|price_high_low|top_rated`
