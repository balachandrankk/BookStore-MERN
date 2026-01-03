-- This is a MongoDB seeding script (JavaScript format for MongoDB Compass)
-- Run this in MongoDB Compass or MongoDB shell

// Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@bookstore.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDfm", // password: admin123
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});

// Create sample books
db.books.insertMany([
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 12.99,
    stock: 25,
    category: "Fiction",
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    image: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 14.99,
    stock: 30,
    category: "Fiction",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    image: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "1984",
    author: "George Orwell",
    price: 13.99,
    stock: 20,
    category: "Science Fiction",
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    image: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 11.99,
    stock: 15,
    category: "Romance",
    description: "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
    image: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    price: 13.50,
    stock: 18,
    category: "Fiction",
    description: "A controversial novel about teenage rebellion and alienation in post-war America.",
    image: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    price: 15.99,
    stock: 40,
    category: "Fantasy",
    description: "The first book in the beloved Harry Potter series about a young wizard's adventures.",
    image: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    price: 24.99,
    stock: 12,
    category: "Fantasy",
    description: "An epic high fantasy novel about the quest to destroy the One Ring.",
    image: "",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 16.99,
    stock: 22,
    category: "Fantasy",
    description: "A children's fantasy novel about Bilbo Baggins' unexpected adventure.",
    image: "",
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

// Create sample user
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDfm", // password: password123
  role: "user",
  createdAt: new Date(),
  updatedAt: new Date()
});
