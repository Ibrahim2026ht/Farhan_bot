const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const https = require("https");

function decode(b64) {
  return Buffer.from(b64, "base64").toString("utf-8");
}

async function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, res => {
      if (res.statusCode !== 200)
        return reject(new Error(`Image fetch failed with status: ${res.statusCode}`));
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", err => {
      fs.unlink(filePath, () => reject(err));
    });
  });
}

const encodedUrl = "aHR0cHM6Ly9yYXNpbi1hcGlzLm9ucmVuZGVyLmNvbQ==";
const encodedKey = "cnNfaGVpNTJjbTgtbzRvai11Y2ZjLTR2N2MtZzE=";

module.exports = {
  config: {
    name: "needgf",
    version: "3.0.1",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 10,
    role: 0,
    shortDescription: "তোর Gf এর প্রোফাইল পিক দেখায় 😍",
    longDescription: "সিঙ্গেলদের জন্য বিশেষ কমান্ড 💔 প্রতি বার নতুন সুন্দরী মেয়ের প্রোফাইল 😚",
    category: "fun",
  },

  onStart: async function ({ message, event }) {
    try {
      const apiUrl = decode(encodedUrl);
      const apiKey = decode(encodedKey);
      const fullUrl = `${apiUrl}/api/rasin/gf?apikey=${apiKey}`;

      const res = await axios.get(fullUrl);
      const imgUrl = res.data?.data?.url;

      if (!imgUrl)
        return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ ছবি পাওয়া যায়নি ভাই 😭
» ⚠️ আবার চেষ্টা করো!
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);

      const imgPath = path.join(__dirname, "tmp", `${event.senderID}_gf.jpg`);
      await downloadImage(imgUrl, imgPath);

      const replyMsg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🌸 আপনার ভাগ্য জেগেছে ভাই!
» 💕 এমন সুন্দরী gf সবাই পায় না
» 😚 নিচে দেখুন আপনার gf এর প্রোফাইল
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      await message.reply({
        body: replyMsg,
        attachment: fs.createReadStream(imgPath)
      });

      fs.unlinkSync(imgPath);

    } catch (err) {
      console.error("❌ Error:", err.message);
      message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ কিছু একটা গন্ডগোল হইছে ভাই 😭
» ⚠️ পরে আবার চেষ্টা করো!
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);
    }
  }
};
