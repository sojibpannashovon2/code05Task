require("dotenv").config();

const express = require("express");

const { MongoClient, ServerApiVersion } = require("mongodb");

const multer = require("multer");

const path = require("path");

const cors = require("cors");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const { v4: uuidv4 } = require("uuid");

const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 7000;

// Middleware

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;
client.connect().then(() => {
  db = client.db("sharelink");
  console.log("Connected to MongoDB");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
