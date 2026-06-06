import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';


// Initialize express app

const app = express();

// connect to database
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/',(req, res) => res.send("API is running..."));

// PORT

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})