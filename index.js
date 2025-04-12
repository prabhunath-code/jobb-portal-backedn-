import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import CompanyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import path from "path";

// Get the current directory using import.meta.url
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Load environment variables
dotenv.config();

// Create an Express application instance
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'https://job-portal-front-pgwn.vercel.app' }));

// Static files (make sure this is defined before your routes)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Fallback route for any other request (use this as a catch-all for your SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.js')); // Serve the index.js file
});

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", CompanyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Error handling middleware (optional but recommended)
app.use((req, res, next) => {
  res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Server error");
});

// Connect to the database and start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${PORT}`);
});
