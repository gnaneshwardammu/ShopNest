const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require('./routes/authRoutes');
dotenv.config();
connectDB();

const app = express();
// CORS must run before routes. The `cors` middleware also handles OPTIONS
// preflight requests for these origins.
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://eshop-nest.vercel.app',
  process.env.FRONTEND_URL && process.env.FRONTEND_URL.replace(/\/+$/, ''),
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Shopnet Backend");
});
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});
app.use('/api/auth', userRoutes);
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes.js'));
app.use('/api/analytics', require('./routes/analyticRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
