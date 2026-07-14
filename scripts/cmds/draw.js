const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "draw",
    aliases: ["imagine", "aiimg"],
    version: "1.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "ai",
    guide: {
      en: "Use {p}draw [prompt] to generate AI image."
    }
  },

  onStart: async function ({ api, event, args }) {
    const prompt = args.join(" ");

    if (!prompt) {
      return api.sendMessage(
        `🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧👑\n` +
        `───────────────\n` +
        `» ℹ️ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗽𝗿𝗼𝗺𝗽𝘁.\n` +
        `» 𝗘𝘅𝗮𝗺𝗽𝗹𝗲: #𝗱𝗿𝗮𝘄 𝗮𝗻𝗶𝗺𝗲 𝗯𝗼𝘆\n` +
        `───────────────\n` +
        `» 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        event.threadID,
        event.messageID
      );
    }


    api.setMessageReaction("🎨", event.messageID, () => {}, true);

    try {
      const cachePath = path.join(__dirname, "cache", `ai_img_${Date.now()}.png`);
      
       if (!fs.existsSync(path.join(__dirname, "cache"))) {
        fs.mkdirSync(path.join(__dirname, "cache"));
      }

      const apiUrl = `https://image.pollinations.ai/p/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${Math.floor(Math.random() * 100000)}`;

      const response = await axios({
        url: apiUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(cachePath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: 
              `🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧👑\n` +
              `───────────────\n` +
              `» 🎨 𝗜𝗺𝗮𝗴𝗲 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆!\n` +
              `» 📝 𝗣𝗿𝗼𝗺𝗽𝘁: ${prompt}\n` +
              `───────────────\n` +
              `» 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
            attachment: fs.createReadStream(cachePath)
          },
          event.threadID,
          () => {
            if (fs.existsSync(cachePath)) {
              fs.unlinkSync(cachePath);
            }
            api.setMessageReaction("🎀", event.messageID, () => {}, true);
          },
          event.messageID
        );
      });

      writer.on("error", (err) => {
        throw err;
      });

    } catch (error) {
      console.error(error);
      api.sendMessage(
        `🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧👑\n` +
        `───────────────\n` +
        `» ❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝗶𝗺𝗮𝗴𝗲.\n` +
        `───────────────\n` +
        `» 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        event.threadID,
        event.messageID
      );
    }
  }
};
