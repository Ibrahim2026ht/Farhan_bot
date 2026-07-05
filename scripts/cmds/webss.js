const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "webss",
    version: "1.1",
    author: "MR_FARHAN",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Website screenshot"
    },
    description: {
      en: "Take a full page screenshot of any website"
    },
    category: "Ai",
    guide: {
      en: "{p}webss <url>\nExample: {p}webss https://google.com"
    }
  },

  langs: {
    en: {
      missing:
        `✨ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗨𝗥𝗟 ✨\n` +
        `──────────────────\n` +
        `⚠️ Please Provide A Valid Url\n` +
        `📌 Example : webss https://example.com`,
      loading:
        `✨ 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 ✨\n` +
        `──────────────────\n` +
        `📸 Web Screenshot Taking...\n` +
        `🌐 %1`,
      error:
        `✨ 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 𝗙𝗔𝗜𝗟𝗘𝗗 ✨\n` +
        `──────────────────\n` +
        `❌ Invalid Or Blocked Url\n\n` +
        `──────────────────\n` +
        `👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑`
    }
  },

  onStart: async function ({ message, args, getLang }) {
    if (!args[0]) return message.reply(getLang("missing"));

    const url = args[0].startsWith("http")
      ? args[0]
      : `https://${args[0]}`;

    const loadingMessage = getLang("loading").replace("%1", `**${url}**`);
    await message.reply(loadingMessage);

    try {
      const res = await axios.get(
        `https://api.popcat.xyz/v2/screenshot?url=${encodeURIComponent(url)}`,
        { responseType: "arraybuffer" }
      );

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const filePath = path.join(
        cacheDir,
        `webss_${Date.now()}.png`
      );

      fs.writeFileSync(filePath, res.data);

      await message.reply(
        {
          body:
            `✨ 𝗦𝗖𝗥𝗘𝗘𝗡𝗦𝗛𝗢𝗧 𝗦𝗨𝗖𝗖𝗘𝗦𝗦 ✨\n` +
            `──────────────────\n` +
            `📸 Website Screenshot\n\n` +
            `🌐 Url :  ${url}**\n` +
            `🖼️ Type : Full Page\n` +
            `⚡ Status : Success\n\n` +
            `──────────────────\n` +
            `👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑`,
          attachment: fs.createReadStream(filePath)
        },
        () => {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      );
    } catch (err) {
      console.error(err);
      message.reply(getLang("error"));
    }
  }
};
