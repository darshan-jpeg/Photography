const express = require("express");
const path = require("path");
require("dotenv").config();
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Log incoming requests
app.use((req, res, next) => {
    console.log(`📥 Incoming request: ${req.method} ${req.url}`);
    next();
});

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Route to serve HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Email sending route
app.post("/send", (req, res) => {
    const { name, email, message } = req.body;

    console.log("📧 Email request body:", req.body);

    if (!name || !email || !message) {
        console.error("❌ Missing fields in request body");
        return res.status(400).send("All fields are required.");
    }

    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("❌ Email sending error:", error);
            return res.status(500).send("Error sending message.");
        }
        console.log("✅ Email sent:", info.response);
        res.status(200).send("Message sent successfully!");
    });
});

// MongoDB connection
const MONGO_ATLAS_PASSWORD = process.env.MONGO_ATLAS_PASSWORD;
const MONGO_URI = `mongodb+srv://darshan:${MONGO_ATLAS_PASSWORD}@photo.chkhh1l.mongodb.net/?tls=true`;
const DB_NAME = process.env.DB_NAME || "photography";
let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useUnifiedTopology: true })
    .then((client) => {
        db = client.db(DB_NAME);
        console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
    });

// Endpoint to get all photo metadata (only _id, alt, title)
app.get("/api/photos", async (req, res) => {
    if (!db) {
        return res.status(500).json({ error: "Database not connected" });
    }
    // Returns an array of all photo documents with type "photo"
    // Only includes _id, alt, and title fields for each photo
    // Used by the frontend to list/display all photos
    // Example response: [{ _id: "...", alt: "Photo 1", title: "Sunset" }, ...]
    // To get the actual image, use /api/photo/:id
    try {
        const photos = await db
            .collection("media")
            .find({ type: "photo" })
            .project({ _id: 1, alt: 1, title: 1 })
            .toArray();
        res.json(photos);
    } catch (err) {
        console.error("❌ Error fetching photos:", err);
        res.status(500).json({ error: "Failed to fetch photos" });
    }
});

// Endpoint to get photo binary data by id
app.get("/api/photo/:id", async (req, res) => {
    if (!db) {
        return res.status(500).send("Database not connected");
    }
    // Returns the raw binary image data for a specific photo by its MongoDB _id
    // Sets the correct Content-Type (e.g., image/jpeg, image/webp)
    // Used as the src for <img> tags in the frontend
    try {
        const photo = await db
            .collection("media")
            .findOne({ _id: new ObjectId(req.params.id) });
        if (!photo || !photo.data) {
            return res.status(404).send("Photo not found");
        }
        res.set("Content-Type", photo.mimetype);
        res.send(photo.data.buffer);
    } catch (err) {
        res.status(500).send("Error retrieving photo");
    }
});

// Endpoint to get all video metadata (only _id, title)
app.get("/api/videos", async (req, res) => {
    if (!db) {
        return res.status(500).json({ error: "Database not connected" });
    }
    // Returns an array of all video documents with type "video"
    // Only includes _id and title fields for each video
    // Used by the frontend to list/display all videos
    // Example response: [{ _id: "...", title: "My Video" }, ...]
    // To get the actual video, use /api/video/:id
    try {
        const videos = await db
            .collection("media")
            .find({ type: "video" })
            .project({ _id: 1, title: 1 })
            .toArray();
        res.json(videos);
    } catch (err) {
        console.error("❌ Error fetching videos:", err);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});

// Endpoint to stream video binary data by id
app.get("/api/video/:id", async (req, res) => {
    if (!db) {
        return res.status(500).send("Database not connected");
    }
    // Returns the raw binary video data for a specific video by its MongoDB _id
    // Sets the correct Content-Type (e.g., video/mp4)
    // Used as the src for <video> tags in the frontend
    try {
        const video = await db
            .collection("media")
            .findOne({ _id: new ObjectId(req.params.id) });
        if (!video || !video.data) {
            return res.status(404).send("Video not found");
        }
        res.set("Content-Type", video.mimetype);
        res.send(video.data.buffer);
    } catch (err) {
        res.status(500).send("Error retrieving video");
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () =>
    console.log(`🚀 Server running on http://${HOST}:${PORT}`)
);

