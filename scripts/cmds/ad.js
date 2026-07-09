const OWNER_NAME = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍";  // নাম পরিবর্তন করলে ফাইল নষ্ট হতে পারে⚠️
const ANTI_TAMPER = "𝆠፝";
const hiddenOwner = ANTI_TAMPER + OWNER_NAME;

if (hiddenOwner !== "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") {  // নাম পরিবর্তন করলে ফাইল নষ্ট হতে পারে⚠️
  process.exit(0);
}

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "ad",
    version: "1.0",
    author: hiddenOwner,
    countDown: 10,
    role: 0,

    shortDescription: {
      en: "Generate ad style image"
    },

    description: {
      en: "Creates ad style meme image from profile picture"
    },

    category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",

    guide: {
      en:
        "{p}ad\n" +
        "{p}ad @mention\n" +
        "reply + {p}ad"
    }
  },

  onStart: async function ({ api, event, message }) {
    try {

      const { senderID, mentions, type, messageReply } = event;

      let uid;

      if (Object.keys(mentions).length > 0) {
        uid = Object.keys(mentions)[0];
      }
      else if (type === "message_reply") {
        uid = messageReply.senderID;
      }
      else {
        uid = senderID;
      }

      const avatarURL =
        `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

      const apiURL =
        `https://api.popcat.xyz/v2/ad?image=${encodeURIComponent(avatarURL)}`;

      const res = await axios.get(apiURL, {
        responseType: "arraybuffer"
      });

      const cacheFolder = path.join(__dirname, "cache");

      if (!fs.existsSync(cacheFolder)) {
        fs.mkdirSync(cacheFolder, { recursive: true });
      }

      const filePath = path.join(
        cacheFolder,
        `ad_${uid}_${Date.now()}.png`
      );

      fs.writeFileSync(filePath, res.data);

      await message.reply({
        body: "📢কিরে শালা 😁তর এড দিয়া 😂ভাইরাল কইরা দিলাম🐸",
        attachment: fs.createReadStream(filePath)
      });

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error(err);

      message.reply(
        "❌ | Failed to generate ad image."
      );
    }
  }
};
