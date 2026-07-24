const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "rndm",
    version: "2.5",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍👑",
    countDown: 5,
    role: 0,
    description: "Send random Anime TikTok video",
    category: "media"
  },

  onStart: async function ({ message }) {
    try {
      
      await message.reply(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⏳ 𝗙𝗲𝘁𝗰𝗵𝗶𝗻𝗴 𝗥𝗮𝗻𝗱𝗼𝗺\n» 🎥 𝗔𝗻𝗶𝗺𝗲 𝗩𝗶𝗱𝗲𝗼...\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );

    
      const keywords = [
        "anime edit",
        "anime amv",
        "aesthetic anime",
        "anime viral",
        "naruto edit",
        "one piece amv",
        "anime trend"
      ];
      const randomKey = keywords[Math.floor(Math.random() * keywords.length)];

      const api = `https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(randomKey)}&count=12`;
      const res = await axios.get(api);

      const videos = res.data?.data?.videos;
      if (!videos || videos.length === 0) {
        return message.reply("❌ No anime video found at the moment.");
      }

      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      const videoUrl = randomVideo.play; // Watermark-free video URL
      const title = randomVideo.title || "Random Anime Video";

      const cachePath = path.join(__dirname, "cache");
      if (!fs.existsSync(cachePath)) fs.ensureDirSync(cachePath);

      const filePath = path.join(cachePath, `anime_${Date.now()}.mp4`);

      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, response.data);

       await message.reply({
        body: ` » 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🎥 ⌜ 𝐀𝐧𝐢𝗺𝐞 𝐑𝐚𝐧𝐝𝐨𝐦 ⌟\n» 📌 𝗧𝗶𝘁𝗹𝗲: ${title}\n» ✨ 𝗘𝗻𝗷𝗼𝘆 𝗬𝗼𝘂𝗿 𝗩𝗶𝗱𝗲𝗼!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧!`,
        attachment: fs.createReadStream(filePath)
      });

        if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error(err);
      return message.reply("❌ Failed to fetch Anime video. Please try again.");
    }
  }
};
