import express from 'express';
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from "@clerk/express";
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRouter from './routes/users.js';
import roomRouter from './routes/rooms.js';
import bookingRouter from './routes/bookings.js';

connectDB()

const app = express();
app.use(cors()) // Enable Cross-Origin Resource Sharing

// Middleware
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}))
app.use(clerkMiddleware())

// Serve Static Uploads
app.use('/uploads', express.static('uploads'));

// API Routes
app.use("/api/clerk", clerkWebhooks);
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

app.get('/', (req, res) => res.send("API is working"))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));