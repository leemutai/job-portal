import express from 'express';
import cors from 'cors';
import 'dotenv/config';


// Initialize express app

const app = express();

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