const { GoatWrapper } = require("fca-liane-utils");
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "video",
    version: "2.2.3",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Search & download YouTube videos",
    longDescription: "Search YouTube videos by name and download without prefix",
    category: "media",
    guide: {
      en: "video <video name>"
    }
  },

  // 🎯 MULTI API SEARCH FUNCTION (ADDED ONLY)
  async searchVideo(query) {
    const apis = [
      `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(query)}`,
      `https://yt-api-imran.vercel.app/api/search?query=${encodeURIComponent(query)}`,
      `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(query)}`
    ];

    for (let url of apis) {
      try {
        const res = await axios.get(url);

        let video = null;

        // API-1 format
        if (res.data?.[0]) video = res.data[0];

        // API-2 format
        else if (res.data?.results?.[0]) video = res.data.results[0];

        // API-3 fallback format
        else if (res.data?.items?.[0]) {
          const item = res.data.items[0];
          video = {
            title: item.snippet?.title,
            url: `https://www.youtube.com/watch?v=${item.id?.videoId}`
          };
        }

        if (video?.url) return video;

      } catch (e) {
        continue; // next API try
      }
    }

    return null;
  },

  onStart: async function ({ api, event, args }) {
    const { threadID, messageID, body } = event;
    const creatorName = "𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍";

    let query = args.join(" ");

    if (!query && body) {
      query = body.replace(/^video\s+/i, "").trim();
    }

    if (!query || query.toLowerCase() === "video") {
      return api.sendMessage(
        `❌ Please provide a song name.\n📌 Example: video Let Me Love You`,
        threadID,
        messageID
      );
    }

    let tempMsgID = null;

    try {
      const searching = await api.sendMessage(
        `🔍 Searching\n━━━━━━━━━━━━━━━\n📌 Query: ${query}\n⏳ Please wait...`,
        threadID
      );
      tempMsgID = searching.messageID;

      // 🔥 NOW USING MULTI API SEARCH (ADDED)
      const video = await module.exports.searchVideo(query);

      if (!video || !video.url) throw new Error("No results found from all APIs.");

      await api.unsendMessage(tempMsgID).catch(() => {});

      const downloading = await api.sendMessage(
        `🎬 Video Found\n━━━━━━━━━━━━━━━\n📖 Title: ${video.title}\n⬇️ Downloading...`,
        threadID
      );
      tempMsgID = downloading.messageID;

      const dlRes = await axios.get(
        `https://yt-api-imran.vercel.app/api?url=${video.url}`
      );

      const downloadUrl = dlRes.data?.downloadUrl;
      if (!downloadUrl) throw new Error("Download link not available.");

      const buffer = (
        await axios.get(downloadUrl, { responseType: "arraybuffer" })
      ).data;

      const cacheDir = path.join(process.cwd(), "cache");
      await fs.ensureDir(cacheDir);

      const filePath = path.join(cacheDir, `video_${Date.now()}.mp4`);
      await fs.writeFile(filePath, buffer);

      const finalMessage = {
        body:
          `━━━━━━━━━━━━━━━━━━\n` +
          `🎬 VIDEO READY\n` +
          `━━━━━━━━━━━━━━━━━━\n` +
          `📖 Title: ${video.title}\n` +
          `⏱ Duration: ${video.time || "N/A"}\n` +
          `🖌️ 𝐏𝐎𝐖𝐄𝐑 𝐁𝐘: ${creatorName}\n` +
          `━━━━━━━━━━━━━━━━━━`,
        attachment: fs.createReadStream(filePath)
      };

      await api.sendMessage(finalMessage, threadID, async () => {
        if (fs.existsSync(filePath)) await fs.unlink(filePath);
      }, messageID);

      if (tempMsgID) await api.unsendMessage(tempMsgID).catch(() => {});

    } catch (err) {
      if (tempMsgID) await api.unsendMessage(tempMsgID).catch(() => {});
      api.sendMessage(
        `❌ Failed\n━━━━━━━━━━━━━━━\n${err.message || "An unexpected error occurred."}`,
        threadID,
        messageID
      );
    }
  }
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });
