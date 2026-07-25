const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "poli",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    version: "1.7",
    cooldowns: 10,
    role: 0,
    category: "ai-image",
    guide: {
      en: "{p}poli <prompt>"
    }
  },

  onStart: async function ({ message, args, api, event }) {
    if (args.length === 0) {
      return api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n» 📌 অনুগ্রহ করে একটি \n» 🪂 প্রম্পট লিখুন!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧", 
        event.threadID, 
        event.messageID
      );
    }

    const prompt = args.join(" ");
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    api.sendMessage(
      "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🎨 𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗜𝗡𝗚\n» ⏳ ওয়েট করো জান <😘\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧", 
      event.threadID, 
      event.messageID
    );

    try {
      const styles = ["ultra detailed", "4k resolution", "realistic lighting", "artstation", "digital painting"];
      const imagePaths = [];

      for (let i = 0; i < 4; i++) {
        const enhancedPrompt = `${prompt}, ${styles[i % styles.length]}`;

        const response = await axios.post(`${await baseApiUrl()}/api/poli/generate`, {
          prompt: enhancedPrompt
        }, {
          responseType: "arraybuffer",
          headers: {
            "author": module.exports.config.author
          }
        });

        const filePath = path.join(cacheDir, `generated_${Date.now()}_${i}.png`);
        fs.writeFileSync(filePath, response.data);
        imagePaths.push(filePath);
      }

      const attachments = imagePaths.map(p => fs.createReadStream(p));
      message.reply({
        body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🖼️ 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗘𝗗 𝗜𝗠𝗔𝗚𝗘𝗦\n» ✨ আপনার প্রম্পট অনুযায়ী ছবি প্রস্তুত!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        attachment: attachments
      });

    } catch (error) {
      console.error("Image generation error:", error);
      message.reply(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ ছবি তৈরি করা সম্ভব হয়নি!\n» 🔄 পরবর্তীতে আবার চেষ্টা করুন।\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
      );
    }
  }
};
