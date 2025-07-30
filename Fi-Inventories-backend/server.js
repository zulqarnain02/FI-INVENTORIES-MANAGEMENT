const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const { connectDB } = require("./config/db");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

const app = express();
const port = process.env.PORT || 3000;

connectDB();

const allowedOrigins = [
  'https://fi-inventories-management-frontend.vercel.app',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use("/", authRoutes);
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Express + JavaScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
