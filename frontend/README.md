# BookStore Frontend

This is the frontend application for the MERN BookStore project built with Next.js 14, React, and Tailwind CSS.

## Features

- 🏠 **Home Dashboard** - Statistics overview and featured books
- 📚 **Books Collection** - Browse, search, and filter books
- 🛒 **Shopping Cart** - Add/remove items, update quantities
- 👤 **User Authentication** - Login and signup
- 📋 **Order Management** - View order history
- 👨‍💼 **Admin Dashboard** - Book and order management (admin only)
- 📞 **Contact & About** - Company information and contact form

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend server running on port 5000

### Installation

1. Navigate to the frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
frontend/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── page.tsx         # Home page
│   │   ├── books/           # Books pages
│   │   ├── login/           # Authentication pages
│   │   ├── admin/           # Admin dashboard
│   │   └── ...
│   ├── components/          # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   └── navbar.tsx       # Navigation component
│   └── lib/                 # Utility functions
├── public/                  # Static assets
└── package.json
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Setup

The frontend is configured to proxy API requests to the backend server running on port 5000. Make sure your backend server is running before starting the frontend.

## Authentication

The application uses HTTP-only cookies for authentication. Users can:
- Sign up for new accounts
- Login with email/password
- Access protected routes (cart, orders, admin)
- Logout to clear session

## Admin Features

Admin users can access additional features:
- Book management (add, edit, delete)
- Order status updates
- User management
- Inventory tracking

Default admin credentials:
- Email: admin@bookstore.com
- Password: admin123
