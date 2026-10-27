
import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { clerkMiddleware } from '@clerk/express';

// Initialize Express app
const app = express();

// Connect to database
await connectDB();
console.log('Database connection initialized');

await connectCloudinary();
console.log('Cloudinary configuration initialized');

// General middleware
app.use(cors());

// IMPORTANT: Register the Clerk webhook BEFORE express.json().
// Svix needs the original raw request body to verify the signature.
app.post(
    '/webhooks',
    express.raw({ type: 'application/json' }),
    clerkWebhooks
);

// Parse JSON for all other routes
app.use(express.json());

// Clerk authentication middleware
app.use(clerkMiddleware());

// Debug Clerk authentication for user API requests
app.use(async (req, res, next) => {
    if (req.originalUrl.startsWith('/api/user')) {
        console.log(
            'Authorization header present:',
            !!req.headers.authorization
        );

        try {
            const auth = await req.auth();

            console.log(
                'Clerk user ID:',
                auth.userId ?? 'No authenticated user'
            );
        } catch (error) {
            console.error('Clerk authentication error:', error.message);
        }
    }

    next();
});

// General routes
app.get('/', (req, res) => {
    console.log('Health check requested');
    res.send('API is running...');
});

app.get('/debug-sentry', function mainHandler(req, res) {
    throw new Error('My first Sentry error!');
});

// Company routes
app.use('/api/company', companyRoutes);

// Job routes
app.use('/api/jobs', jobRoutes);

// Log requests reaching the user API
app.use('/api/user', (req, res, next) => {
    console.log('User API request:', req.method, req.originalUrl);

    next();
});

// User routes
app.use('/api/user', userRoutes);

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
