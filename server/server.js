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
const { access } = require("fs");

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

//? Start server

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//? File upload configuration

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

//?Verify Jwt or Validation of JWT token

const verifyJWT = (req, res, next) => {
  const authoraization = req.headers.authorization;
  if (!authoraization) {
    return res
      .status(401)
      .send({ error: true, message: `Unauthorized Access` });
  }
  const token = authoraization.split(" ")[1];

  //verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .send({ error: true, message: `Unauthorized Access` });
    }
    req.user = decoded;
    next();
  });
};

//Genarate Jwt token
app.post("/jwt", async (req, res) => {
  const email = req.body;
  const token = jwt.sign(email, process.env.JWT_SECRET, {
    expiresIn: `7d`,
  });
  // console.log(token)
  res.send({ token });
});

// Create a shareable link from user

app.post("/api/links", verifyJWT, upload.single("file"), async (req, res) => {
  const { content, isPublic, password, expiresAt } = req.body;
  const file = req.file; // Uploaded file details

  if (!file && !content) {
    return res
      .status(400)
      .json({ error: "Either file or content is required" });
  }

  const newLink = {
    linkId: uuidv4(),
    file: file ? file.filename : null, // Handle null file
    content,
    isPublic,
    passwordHash: isPublic ? null : bcrypt.hashSync(password, 10),
    expiresAt,
    owner: req.user.uid,
    accessCount: 0,
    createdAt: new Date(),
  };

  await db.collection("links").insertOne(newLink);
  res.json({ link: `${process.env.CLIENT_URL}/content/${newLink.linkId}` });
});

//? Access content via link (protected route)

app.get("/api/links/:id", async (req, res) => {
  const links = db.collection("links");
  const link = await links.findOne({ linkId: req.params.id });

  if (!link) return res.status(404).json({ error: "Link not found" });

  if (link.expiresAt && new Date() > link.expiresAt) {
    return res.status(410).json({ error: "Link expired" });
  }

  if (!link.isPublic) {
    const password = req.headers["x-password"];
    if (!password || !bcrypt.compareSync(password, link.passwordHash)) {
      return res.status(401).json({ error: "Unauthorized" });
    }
  }

  await links.updateOne({ linkId: link.linkId }, { $inc: { accessCount: 1 } });
  res.json({
    content: link.content,
    file: link.file ? `/uploads/${link.file}` : null,
    isPublic: link.isPublic,
  });
});

//? Delete a link (protected route)

app.delete("/api/links/:id", verifyJWT, async (req, res) => {
  const links = db.collection("links");
  const link = await links.findOne({ linkId: req.params.id });

  if (!link) return res.status(404).json({ error: "Link not found" });

  if (link.owner !== req.user.uid) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await links.deleteOne({ linkId: req.params.id });
  res.json({ message: "Link deleted" });
});

//? Error handling middleware

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});
