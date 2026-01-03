# BookStore Backend

This is the backend API for the MERN BookStore project built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication** - JWT-based auth with HTTP-only cookies
- 📚 **Book Management** - CRUD operations for books
- 🛒 **Shopping Cart** - Real-time cart management
- 📦 **Order Processing** - Complete order workflow
- 👨‍💼 **Admin Controls** - Book inventory and order management
- 📊 **Dashboard Stats** - Analytics and reporting
- 📧 **Contact Forms** - Message handling

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Navigate to the backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the `.env` file with your configuration:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=5000
\`\`\`

5. Seed the database:
\`\`\`bash
npm run seed
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The server will start on [http://localhost:5000](http://localhost:5000)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove cart item

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

### Admin Routes
- `GET /api/admin/books` - Get all books (admin)
- `POST /api/admin/books` - Create book
- `PUT /api/admin/books/:id` - Update book
- `DELETE /api/admin/books/:id` - Delete book
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/users` - Get all users

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Contact
- `POST /api/contact` - Submit contact form

## Database Models

### User
- name, email, password, role (user/admin)

### Book
- title, author, price, stock, category, description, image

### Cart
- user reference, items array, total

### Order
- user reference, items array, total, status

### Contact
- name, email, subject, message

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## Default Credentials

After seeding the database:

**Admin User:**
- Email: admin@bookstore.com
- Password: admin123

**Regular User:**
- Email: john@example.com
- Password: password123
