const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pet",
    version: "1.1",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    shortDescription: "Pet a user",
    longDescription: "Generates a pet GIF for a tagged user with real profile picture",
    category: "fun",
    guide: "{p}pet @user"
  },

  onStart: async function ({ message, event, usersData }) {
    const mentions = Object.keys(event.mentions || {});
    let userid = mentions.length > 0 ? mentions[0] : event.messageReply ? event.messageReply.senderID : null;

    if (!userid) {
      return message.reply(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n» 📌 অনুগ্রহ করে যাকে পেট করতে চান\n» 👤 তাকে মেনশন করুন অথবা মেসেজে রিপ্লাই দিন!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
      );
    }

    try {
      // 1️⃣ Get Real Facebook Avatar URL
      const avatarUrl = `https://graph.facebook.com/${userid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      // 2️⃣ Generate Petpet GIF with Real Profile Picture
      const petApiUrl = `https://api.popcat.xyz/pet?image=${encodeURIComponent(avatarUrl)}`;

      const res = await axios.get(petApiUrl, { responseType: "arraybuffer" });

      const cacheDir = path.join(__dirname, "cache");
      await fs.ensureDir(cacheDir);

      const filePath = path.join(cacheDir, `pet_${userid}_${Date.now()}.gif`);
      await fs.writeFile(filePath, Buffer.from(res.data));

      const name = await usersData.getName(userid);

      await message.reply({
        body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🐾 𝗣𝗘𝗧 𝗣𝗘𝗧\n» 🐱 ${name}-কে কিউট একটা আদর দেওয়া হলো!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        attachment: fs.createReadStream(filePath)
      });

      await fs.remove(filePath);
    } catch (err) {
      console.error("❌ Pet command error:", err);
      return message.reply(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ পেট পিকচার তৈরি করতে সমস্যা হয়েছে!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
      );
    }
  }
};
