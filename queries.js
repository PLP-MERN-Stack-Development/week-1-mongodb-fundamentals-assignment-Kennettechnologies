// MongoDB Queries for Assignment

// Task 1: MongoDB Setup
// Database and collection are created using the MongoDB Shell or Compass.

// Task 2: Basic CRUD Operations
// Insert books using the insert_books.js script.

import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string if using Atlas
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    console.log('Connected to MongoDB server');

    const db = client.db('plp_bookstore');
    const books = db.collection('books');

    // Task 2: Basic CRUD Operations

    // Find all books in a specific genre (e.g., 'Fiction')
    const fictionBooks = await books.find({ genre: 'Fiction' }).toArray();
    console.log('Fiction books:', fictionBooks);

    // Find books published after a certain year (e.g., 2000)
    const recentBooks = await books.find({ published_year: { $gt: 2000 } }).toArray();
    console.log('Books published after 2000:', recentBooks);

    // Find books by a specific author (e.g., 'Harper Lee')
    const authorBooks = await books.find({ author: 'Harper Lee' }).toArray();
    console.log('Books by Harper Lee:', authorBooks);

    // Update the price of a specific book (e.g., 'To Kill a Mockingbird')
    const updateResult = await books.updateOne(
      { title: 'To Kill a Mockingbird' },
      { $set: { price: 15.99 } }
    );
    console.log('Updated book price:', updateResult);

    // Delete a book by its title (e.g., 'Animal Farm')
    const deleteResult = await books.deleteOne({ title: 'Animal Farm' });
    console.log('Deleted book:', deleteResult);

    // Task 3: Advanced Queries

    // Find books that are both in stock and published after 2010
    const inStockRecentBooks = await books.find({
      in_stock: true,
      published_year: { $gt: 2010 }
    }).toArray();
    console.log('In-stock books published after 2010:', inStockRecentBooks);

    // Use projection to return only the title, author, and price fields
    const projectedBooks = await books.find({}, {
      projection: { title: 1, author: 1, price: 1, _id: 0 }
    }).toArray();
    console.log('Books with projected fields:', projectedBooks);

    // Implement sorting to display books by price (ascending)
    const sortedBooksAsc = await books.find().sort({ price: 1 }).toArray();
    console.log('Books sorted by price (ascending):', sortedBooksAsc);

    // Implement sorting to display books by price (descending)
    const sortedBooksDesc = await books.find().sort({ price: -1 }).toArray();
    console.log('Books sorted by price (descending):', sortedBooksDesc);

    // Use the limit and skip methods to implement pagination (5 books per page)
    const page = 1; // Change this to navigate through pages
    const booksPerPage = 5;
    const paginatedBooks = await books.find()
      .skip((page - 1) * booksPerPage)
      .limit(booksPerPage)
      .toArray();
    console.log(`Page ${page} of books:`, paginatedBooks);

    // Task 4: Aggregation Pipeline

    // Calculate the average price of books by genre
    const avgPriceByGenre = await books.aggregate([
      { $group: { _id: '$genre', avgPrice: { $avg: '$price' } } }
    ]).toArray();
    console.log('Average price by genre:', avgPriceByGenre);

    // Find the author with the most books in the collection
    const authorWithMostBooks = await books.aggregate([
      { $group: { _id: '$author', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]).toArray();
    console.log('Author with most books:', authorWithMostBooks);

    // Group books by publication decade and count them
    const booksByDecade = await books.aggregate([
      {
        $group: {
          _id: { $floor: { $divide: ['$published_year', 10] } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();
    console.log('Books by decade:', booksByDecade);

    // Task 5: Indexing

    // Create an index on the title field
    await books.createIndex({ title: 1 });
    console.log('Index created on title field');

    // Create a compound index on author and published_year
    await books.createIndex({ author: 1, published_year: 1 });
    console.log('Compound index created on author and published_year fields');

    // Use the explain() method to demonstrate the performance improvement
    const explainResult = await books.find({ title: 'To Kill a Mockingbird' }).explain();
    console.log('Explain result for title query:', explainResult);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

main().catch(console.error); 