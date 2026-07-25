const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "pinterest",
    aliases: ["pin", "pint"],
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 2,
    role: 0,
    description: "Search Pinterest and get image results",
    category: "image",
    guide: {
      en: "{pn} [keyword] — Get Pinterest image results\nExample: {pn} Naruto"
    }
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");
    if (!query) {
      return api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n» 📌 অনুগ্রহ করে একটি\n» 🔍 সার্চ কিওয়ার্ড লিখুন!\n» 💡 উদাহরণ: pinterest Naruto\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧", 
        event.threadID, 
        event.messageID
      );
    }

    try {
      const count = 5;
      const url = `https://betadash-api-swordslush-production.up.railway.app/pinterest?search=${encodeURIComponent(query)}&count=${count}`;
      const res = await axios.get(url);

      const imageList = res.data?.data;
      if (!Array.isArray(imageList) || imageList.length === 0) {
        return api.sendMessage(
          "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗡𝗢𝗧 𝗙𝗢𝗨𝗡𝗗\n» ❌ কোনো ছবি পাওয়া যায়নি!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧", 
          event.threadID, 
          event.messageID
        );
      }

      const attachments = [];

      for (let i = 0; i < imageList.length; i++) {
        const imageRes = await axios.get(imageList[i], { responseType: "arraybuffer" });
        const imagePath = path.join(__dirname, `pin_${i}.jpg`);
        fs.writeFileSync(imagePath, imageRes.data);
        attachments.push(fs.createReadStream(imagePath));
      }

      api.sendMessage({
        body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🖼️ 𝗣𝗜𝗡𝗧𝗘𝗥𝗘𝗦𝗧\n » 🍫 𝗥𝗘𝗦𝗨𝗟𝗧𝗦\n» 🔍 সার্চ: "${query}"\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        attachment: attachments
      }, event.threadID, () => {
        for (let i = 0; i < attachments.length; i++) {
          try {
            fs.unlinkSync(path.join(__dirname, `pin_${i}.jpg`));
          } catch (e) {
            console.error(e);
          }
        }
      }, event.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» 🚫 পিন্টারেস্ট এপিআই থেকে\n» ❌ ছবি আনতে সমস্যা হয়েছে!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧", 
        event.threadID, 
        event.messageID
      );
    }
  }
};
