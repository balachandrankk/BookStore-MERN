const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("dotenv").config()

const User = require("../models/User")
const Book = require("../models/Book")

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bookstore")
    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Book.deleteMany({})
    console.log("Cleared existing data")

    // Create admin user
    const adminPassword = await bcrypt.hash("admin123", 12)
    const admin = new User({
      name: "Admin User",
      email: "admin@bookstore.com",
      password: adminPassword,
      role: "admin",
    })
    await admin.save()

    // Create sample user
    const userPassword = await bcrypt.hash("password123", 12)
    const user = new User({
      name: "John Doe",
      email: "john@example.com",
      password: userPassword,
      role: "user",
    })
    await user.save()

    // Create sample books with online images
    const books = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 399,
        stock: 25,
        category: "Fiction",
        description:
          "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 349,
        stock: 30,
        category: "Fiction",
        description: "A gripping tale of racial injustice and childhood innocence in the American South.",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      },
      {
        title: "1984",
        author: "George Orwell",
        price: 299,
        stock: 20,
        category: "Science Fiction",
        description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
        image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 325,
        stock: 15,
        category: "Romance",
        description: "A romantic novel that critiques the British landed gentry at the end of the 18th century.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        price: 375,
        stock: 18,
        category: "Fiction",
        description: "A controversial novel about teenage rebellion and alienation in post-war America.",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        price: 499,
        stock: 40,
        category: "Fantasy",
        description: "The first book in the beloved Harry Potter series about a young wizard's adventures.",
        image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=400&fit=crop",
      },
      {
        title: "The Lord of the Rings",
        author: "J.R.R. Tolkien",
        price: 899,
        stock: 12,
        category: "Fantasy",
        description: "An epic high fantasy novel about the quest to destroy the One Ring.",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop",
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        price: 425,
        stock: 22,
        category: "Fantasy",
        description: "A children's fantasy novel about Bilbo Baggins' unexpected adventure.",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop",
      },
      {
        title: "Dune",
        author: "Frank Herbert",
        price: 599,
        stock: 28,
        category: "Science Fiction",
        description: "A science fiction epic set in a distant future amidst a feudal interstellar society.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
      },
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 350,
        stock: 35,
        category: "Philosophy",
        description: "A philosophical book about following your dreams and listening to your heart.",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      },
      {
        title: "Sapiens",
        author: "Yuval Noah Harari",
        price: 499,
        stock: 20,
        category: "History",
        description: "A brief history of humankind exploring how Homo sapiens came to dominate Earth.",
        image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=400&fit=crop",
      },
      {
        title: "The Da Vinci Code",
        author: "Dan Brown",
        price: 399,
        stock: 25,
        category: "Mystery",
        description: "A mystery thriller following symbologist Robert Langdon as he investigates a murder.",
        image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop",
      },
    ]

    await Book.insertMany(books)

    console.log("Database seeded successfully!")
    console.log("Admin credentials: admin@bookstore.com / admin123")
    console.log("User credentials: john@example.com / password123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
