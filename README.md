# Product Manager

A simple Product Management application

## Tech Stack

* Next.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Zod
* TanStack Query
* Tailwind CSS

## Features

* User registration and login
* JWT authentication using HTTP-only cookies
* Create products
* View products
* View product details
* Delete products
* Search products
* Server-side pagination
* Responsive UI
* Loading, empty, and error states

## Getting Started

### 1. Clone the repository

```bash
git clone http://github.com/fariskt/rc-task
cd rc-task
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/product-manager  (used local mongodb)
JWT_SECRET=your-secret-key
```

### 4. Start MongoDB

Make sure MongoDB is running locally.

### 5. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Backend

The backend is built using Next.js Route Handlers.

API routes are located under:

```text
src/app/api/
```

Authentication:

```text
POST /api/auth/signup
POST /api/auth/signin
POST /api/auth/logout
GET  /api/auth/me
```

Products:

```text
GET    /api/products
POST   /api/products
GET    /api/products/:id
DELETE /api/products/:id
```

All product endpoints require authentication.

## Database

MongoDB is used as the database and Mongoose is used for database operations.

Main collections:

* Users
* Products

Each product belongs to the authenticated user using `userId`.

Product fields:

```text
_id
userId
name
category
quantity
price
createdAt
updatedAt
```

Product IDs are UUID strings and timestamps are handled by Mongoose.

## Implementation Approach

### Frontend

I used Next.js App Router with TypeScript and Tailwind CSS.

The application is split into reusable UI components (can replace with shadcn easily) such as buttons, inputs, dialogs, tables, pagination, skeleton loaders, and form components.

TanStack Query is used for server state such as products and authentication data. Local component state is used for temporary UI state such as dialogs and form inputs.

### Authentication

Authentication uses JWT stored in an HTTP-only cookie.

Passwords are hashed using bcryptjs before being stored in MongoDB.

Server-side pages and API routes verify the JWT before allowing access to protected resources.

### API Design

The API is implemented using Next.js Route Handlers.

Product queries are always scoped to the authenticated user's `userId`, so users can only access their own products.

Zod is used to validate product input before saving it to the database.

Search and pagination are handled on the server to avoid loading the entire product collection on the client.

### Database Design

The application uses two main models:

```text
User
  └── Products
```

Each product stores the owner's `userId`. This keeps ownership simple and allows product queries to be filtered by the authenticated user.

## Running the Project

Make sure these are running:

1. MongoDB
2. Next.js development server

Then open:

```text
http://localhost:3000
```