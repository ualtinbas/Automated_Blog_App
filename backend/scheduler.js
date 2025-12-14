import cron from "node-cron";
import axios from "axios";

export const startScheduler = () => {
  // 12:30 every day
  cron.schedule("30 12 * * *", async () => {
    try {
      console.log("[scheduler] Generating daily post...");
      await axios.post("http://localhost:3000/posts/ai", { topic: "" });
      console.log("[scheduler] Done.");
    } catch (err) {
      console.error("[scheduler] Failed:", err?.message || err);
    }
  }, {
    timezone: "Europe/Istanbul",
  });
};
