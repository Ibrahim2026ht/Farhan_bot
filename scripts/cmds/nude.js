const axios = require("axios");

module.exports = {
  config: {
    name: "nude",
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Generate nude image (API demo)",
    longDescription: "Fetch a NSFW image using a fixed UID",
    category: "18+",
    guide: "{p}nude"
  },

  onStart: async function ({ message }) {
    const uid = "100085332887575";

    try {
      const res = await axios.get(`https://mostakim.onrender.com/nude?uid=${uid}`);
      const data = res.data;

      if (data.success && data.url) {
        const imageRes = await axios.get(data.url, { responseType: 'stream' });
        return message.reply({
          body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 📁 𝗧𝘆𝗽𝗲: ${data.type}
» ✅ 𝗦𝘁𝗮𝘁𝘂𝘀: 𝗦𝘂𝗰𝗰𝗲𝘀𝘀
» ───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          attachment: imageRes.data
        });
      } else {
        return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗳𝗲𝘁𝗰𝗵 𝗶𝗺𝗮𝗴𝗲.
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);
      }
    } catch (err) {
      return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ 𝗘𝗿𝗿𝗼𝗿 𝗼𝗰𝗰𝘂𝗿𝗿𝗲𝗱: ${err.message}
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);
    }
  }
};
