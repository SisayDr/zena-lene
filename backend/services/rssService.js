import Parser from "rss-parser";
import News from "../models/News.js";
import * as cheerio from "cheerio";
import { summarize } from "./aiService.js";

const SOURCES = [
  {
    name: "Fana Media Corporation",
    url: "https://fanamc.com/feed/",
  },
];
const parser = new Parser();

export const fetchAndStoreNews = async () => {
  for (const source of SOURCES) {
    const newsItems = [];
    const feed = await parser.parseURL(source.url);

    for (const item of feed.items) {
      const link = item.link?.split("?")[0].trim();
      const publishedAt = new Date(item.pubDate);

      //Parse description
      const $ = cheerio.load(item["content:encoded"]);
      const content = $.text().trim().slice(0, 300);

      // Extract thumbnail where available
      const thumbnail = item.enclosure?.type?.startsWith("image/")
        ? item.enclosure.url
        : item.thumbnail || $("img").first().attr("src") || null;

      const newsDoc = new News({
        link,
        source: source.name,
        publishedAt,
        thumbnail,
      });

      try {
        const savedNews = await newsDoc.save();
        newsItems.push({
          _id: savedNews._id,
          news: content,
        });
      } catch (error) {
        continue;
      }
    }

    //batch summarize and update news items
    const chunkSize = 10;
    for (let i = 0; i < newsItems.length; i += chunkSize) {
      const chunk = newsItems.slice(i, i + chunkSize);
      const chunkIds = chunk.map((item) => item._id);

      let summarizedChunk;
      try {
        summarizedChunk = JSON.parse(await summarize(JSON.stringify(chunk)));
      } catch (err) {
        const deleted = await News.deleteMany({ _id: { $in: chunkIds } });
        console.error("Summarization failed:", err);
        console.log(
          `Deleted ${deleted.deletedCount} items in chunk due to summarization failure`,
        );
        continue;
      }

      const failedUpdates = [];
      for (const result of summarizedChunk) {
        try {
          const updated = await News.findByIdAndUpdate(result._id, {
            summary: result.summary,
            relevanceScore: result.relevant ? 1 : 0,
          });

          if (!updated) {
            // ID not found or update failed
            failedUpdates.push(result._id);
          }
        } catch (err) {
          console.error(`Failed to update ${result._id}:`, err);
          failedUpdates.push(result._id);
        }
      }

      // Delete items in this chunk that were not successfully updated
      if (failedUpdates.length > 0) {
        const deleted = await News.deleteMany({ _id: { $in: failedUpdates } });
        console.log(
          `Deleted ${deleted.deletedCount} items that failed to update`,
        );
      }
      // Sleep for 70 seconds to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 70000));
    }
  }
};
