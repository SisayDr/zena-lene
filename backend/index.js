import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fetchAndStoreNews } from "./services/rssService.js";
import News from "./models/News.js";

dotenv.config();
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

//Routes
app.get("/api/news", async (req, res) => {
  const newsItems = await News.find().sort({ publishedAt: -1 });
  res.json(newsItems);
});

//delete all news items
app.get("/news/delete-all", async (req, res) => {
  try {
    await News.deleteMany({});
    res.json({ message: "All news items deleted" });
  } catch (error) {
    console.error("Error deleting news items:", error);
    res.status(500).json({ error: "Failed to delete news items" });
  }
});

app.get("/fetch-news", async (req, res) => {
  try {
    const newsItems = await fetchAndStoreNews();
    res.json(newsItems);
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
