const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const { connectDB } = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");

const app = express();
const port = process.env.PORT || 3000;

connectDB();
app.use(cors());
app.use(express.json()); 

app.use("/", authRoutes);
app.use("/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Express + JavaScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
