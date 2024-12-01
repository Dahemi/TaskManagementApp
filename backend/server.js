const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
require("dotenv").config();

// Import routes
const UserAPI = require("./Routes/User");

//Initialize app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/v1", UserAPI);
app.get("/", (req, res) => {
  //localhost:3000/api/v1/sign-in
  res.send("Hello From BackEnd!");
});

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB...");
  } catch (err) {
    console.log(err.message);
  }
};

connect();

//start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
