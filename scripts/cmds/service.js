const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "service",
    aliases: ["sumaiya", "callservice"],
    version: "1.2",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    category: "media",
    guide: {
      en: "Use {p}service or type trigger words to view services."
    }
  },

  onStart: async function ({ api, event }) {
    return this.handleService({ api, event });
  },

  onChat: async function ({ api, event }) {
    const message = event.body ? event.body.toLowerCase().trim() : "";
    if (!message) return;

    
    const triggers = [
      "সুমাইয়া", "sumaiya",
      "হাতমারা", "hatmara",
      "হাত মারা মাগি", "hat mara magi"
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
    api.setMessageReaction("💋", event.messageID, () => {}, true);

    const videoUrl = "https://files.catbox.moe/divxrc.mp4";
    const cachePath = path.join(__dirname, "cache", `service_${Date.now()}.mp4`);

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
          `» মেসেঞ্জারে কাজ করি ভিডিও কল এক মিনিট\n` +
          `» মেসেঞ্জারে কথা বলে সিওর হয়ে নিবেন\n` +
          `» 𝟭𝟮𝟬 টাকার বিনিময়ে মাল আউট করে দেখাবো\n` +
          `» এখন দেখালে 𝟲𝟬 টাকায় হবে\n` +
          `» আমার হাত মারা ভিডিও দেখতে চাইলে নিচে দেওয়া লিংকে চাপ দিয়ে টেলিগ্রামে জয়েন হন\n` +
          `» আমি সুমাইয়া কল সার্ভিস\n` +
          `» আমার হাত মারা ভিডিও যদি ভালো লাগে তাহলে হলে সার্ভিস নিবেন\n` +
          `» 𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺: https://t.me/yourchannel\n` +
          `───────────────\n` +
          `» 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

        api.sendMessage(
          {
            body: msgBody,
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
        `» ❌ 𝗙𝗮𝗶𝗹𝗲𝗱 𝘁𝗼 𝗹𝗼𝗮𝗱 𝘀𝗲𝗿𝘃𝗶𝗰𝗲 𝘃𝗶𝗱𝗲𝗼.\n` +
        `───────────────\n` +
        `» 👑𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
        event.threadID,
        event.messageID
      );
    }
  }
};
