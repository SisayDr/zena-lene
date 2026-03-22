import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    link: { type: String, required: true, unique: true, trim: true },
    source: { type: String, default: "Unknown", trim: true },
    summary: { type: String, default: "" },
    publishedAt: { type: Date, required: true },
    thumbnail: { type: String, default: null },
    category: { type: String, default: null },
    relevanceScore: { type: Number, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("News", newsSchema);
