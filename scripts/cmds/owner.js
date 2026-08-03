const moment = require("moment-timezone");
const fs = require("fs");
const path = require("path");
const { getStreamFromURL } = global.utils;

async function safeStream(url) {
  try {
    return await getStreamFromURL(url);
  } catch (e) {
    console.log("Stream failed:", e.message);
    return null;
  }
}

// ================== 🎥/🖼️ MEDIA ROTATION SYSTEM ==================
// এখানে আপনি ২টি ভিডিও, ২টি পিক, ২টি GIF অথবা ১টি পিক ও ১টি ভিডিও মিক্স করে বসাতে পারবেন
const mediaLinks = [
  "https://files.catbox.moe/lyppld.mp4",
  "https://files.catbox.moe/0rs8pc.png"
];

const countFile = path.join(__dirname, "owner_media_count.json");

function getNextMedia() {
  let index = 0;

  try {
    if (fs.existsSync(countFile)) {
      const data = JSON.parse(fs.readFileSync(countFile, "utf8"));
      index = data.index || 0;
    }
  } catch (e) {
    console.log("Count file error:", e.message);
  }

  const media = mediaLinks[index];
  const nextIndex = (index + 1) % mediaLinks.length; // ২ বারের পর আবার প্রথম থেকে শুরু হবে

  try {
    fs.writeFileSync(countFile, JSON.stringify({ index: nextIndex }));
  } catch (e) {
    console.log("Write count error:", e.message);
  }

  return media;
}
// ===========================================================

module.exports = {
  config: {
    name: "owner",
    version: "4.5.0",
    author: "siyam", //নাম পরিবর্তন করলে বট বন্ধ হয়ে যাবে
    role: 0,
    countDown: 10,
    shortDescription: { en: "Owner info" },
    category: "owner"
  },

  onStart: async function ({ message }) {
    const ownerFB1 = "https://www.facebook.com/share/14k1GZFVH2T/";
    const ownerFB2 = "https://www.facebook.com/share/14k1GZFVH2T/";

    // 🔄 Auto Media Changer (Video/Photo/GIF)
    const mediaUrl = getNextMedia();
    const attachment = await safeStream(mediaUrl);

    const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A");
    const date = moment().tz("Asia/Dhaka").format("DD MMMM YYYY");

    const msg = {
      body: `───────────────
» 👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 👑
───────────────
» 👤 𝗢𝗪𝗡𝗘𝗥 ➜ 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍
» 🏠 𝗔𝗗𝗗𝗥𝗘𝗦𝗦: Mymensingh
» 🕋 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡: 𝗜𝗦𝗟𝗔𝗠
» 🚻 𝗚𝗘𝗡𝗗𝗘𝗥: 𝗠𝗔𝗟𝗘
» 💞   𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣: 𝗦𝗜𝗡𝗚𝗟𝗘
» 🧑‍🎓 𝗪𝗢𝗥𝗞: 𝗦𝗧𝗨𝗗𝗘𝗡𝗧
───────────────
» 📅 𝗗𝗮𝘁𝗲: ${date}
» ⏰ 𝗧𝗶𝗺𝗲: ${time}
───────────────
» 📞 𝗜𝗠𝗢: 8801734339892
» 🔗 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝟭: ${ownerFB1}
» 🔗 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝟮: ${ownerFB2}
───────────────
» 📝 আরো দেখতে লিখুন: ,owner2
───────────────
👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 ➜ 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍 👑`
    };

    if (attachment) {
      msg.attachment = attachment;
    }

    return message.reply(msg);
  }
};
