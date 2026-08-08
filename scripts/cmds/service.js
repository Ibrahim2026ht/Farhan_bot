const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "chipa",
    aliases: ["চিপা", "chipa", "callservice"],
    version: "1.2",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "media",
    guide: {
      en: "Use {p}chipa or type trigger words to view services."
    }
  },

  onStart: async function ({ api, event }) {
    return this.handleService({ api, event });
  },

  onChat: async function ({ api, event }) {
    const message = event.body
      ? event.body.toLowerCase().trim()
      : "";

    if (!message) return;

    const triggers = [
      "চিপা",
      "chipa"
    ];

    let matched = false;

    for (const trigger of triggers) {
      if (message.includes(trigger)) {
        matched = true;
        break;
      }
    }

    if (matched) {
      return this.handleService({ api, event });
    }
  },

  handleService: async function ({ api, event }) {
    api.setMessageReaction(
      "💋",
      event.messageID,
      () => {},
      true
    );

    const videoUrl = "https://files.catbox.moe/ivs6gy.mp4";
    const cachePath = path.join(
      __dirname,
      "cache",
      `service_${Date.now()}.mp4`
    );

    try {
      if (!fs.existsSync(path.join(__dirname, "cache"))) {
        fs.mkdirSync(path.join(__dirname, "cache"));
      }

      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(cachePath);

      response.data.pipe(writer);

      writer.on("finish", () => {
        const msgBody =
          `🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧👑\n` +
          `───────────────\n` +
          `» আসসালামুয়ালাইকুম সম্মানিত গ্রুপ আপনাদের সকল কে গ্রুপ এ আসার অনুরোধ রইলো\n` +
          `» @everyone\n` +
          `───────────────\n` +
          `» 👑𝆠𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍`;

        api.sendMessage(
          {
            body: msgBody,
            attachment: fs.createReadStream(cachePath),
            mentions: [
              {
                tag: "@everyone",
                id: "0"
              }
            ]
          },
          event.threadID,
          () => {
            if (fs.existsSync(cachePath)) {
              fs.unlinkSync(cachePath);
            }

            api.setMessageReaction(
              "🎀",
              event.messageID,
              () => {},
              true
            );
          },
          event.messageID
        );
      });

      writer.on("error", (err) => {
        console.error(err);
      });

    } catch (error) {
      console.error(error);

      api.sendMessage(
        `🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧👑\n` +
        `───────────────\n` +
        `» ❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗹𝗼𝗮𝗱 𝘀𝗲𝗿𝘃𝗶𝗰𝗲 𝘃𝗶𝗱𝗲𝗼.\n` +
        `───────────────\n` +
        `» 👑𝆠𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍`,
        event.threadID,
        event.messageID
      );
    }
  }
};
