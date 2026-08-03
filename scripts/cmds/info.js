const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

let mediaIndex = 0;

module.exports = {
  config: {
    name: "info",
    version: "4.4.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", //নাম চেঞ্জ করলে বট বন্ধ হয়ে যাবে
    role: 0,
    countDown: 20,
    shortDescription: { en: "Owner & bot info" },
    longDescription: { en: "Show full stylish info" },
    category: "owner",
    guide: { en: "{pn}" }
  },

  onStart: async function ({ message, event, api }) {
    const totalCommands = global.GoatBot?.commands?.size || 0;
    const now = moment().tz("Asia/Dhaka");
    const date = now.format("MMMM Do YYYY");
    const time = now.format("h:mm:ss A");

    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const prefix = global.utils.getPrefix(event.threadID);
    const groupName = event.threadName || "বলবো না 😁 ফারহান বস কে প্রেম করাই দাও নাই😴";

    let botName = "Unknown Bot";
    try {
      const botID = api.getCurrentUserID();
      const botInfo = await api.getUserInfo(botID);
      botName = botInfo[botID]?.name || "Bot";
    } catch (e) {}

    
    const mediaFiles = [
      "https://files.catbox.moe/8f2fc5.mp4",
      "https://files.catbox.moe/3aikdw.mp4"
    ];

    let attachment;
    if (mediaFiles.length > 0) {
      const currentMedia = mediaFiles[mediaIndex % mediaFiles.length];
      mediaIndex = (mediaIndex + 1) % mediaFiles.length;

      try {
        const urlClean = currentMedia.split('?')[0].toLowerCase();
        if (urlClean.endsWith(".mp4") || urlClean.endsWith(".mov") || urlClean.endsWith(".mkv") || urlClean.includes("video")) {
          attachment = await global.utils.getStreamFromURL(currentMedia, "video.mp4");
        } else if (urlClean.endsWith(".gif") || urlClean.includes("gif")) {
          attachment = await global.utils.getStreamFromURL(currentMedia, "animated.gif");
        } else {
          attachment = await global.utils.getStreamFromURL(currentMedia, "image.jpg");
        }
      } catch (err) {
        attachment = undefined;
      }
    }

    return message.reply({
      body: `  𝗢𝗪𝗡𝗘𝗥 𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍
───────────────
» 👑 𝗢𝗪𝗡𝗘𝗥: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
» 🤖 𝗕𝗢𝗧 𝗡𝗔𝗠𝗘: ${botName}
» 🎂 𝗔𝗚𝗘: 18 𝟏7+
» 🚻 𝗚𝗘𝗡𝗗𝗘𝗥: 𝐌𝐀𝐋𝐄
» ☪ 𝗥𝗘𝗟𝗜𝗚𝗜𝗢𝗡: 𝐈𝐒𝐋𝐀𝐌
───────────────
» 🏠 𝗔𝗗𝗗𝗥𝗘𝗦𝗦: 𝐊𝐈𝐒𝐇𝐎𝐑𝐄𝐆𝐀𝐍𝐉 → 𝐁𝐀𝐍𝐆𝐋𝐀𝐃𝐄𝐒𝐇
» 🏫 𝗦𝗖𝗛𝗢𝗢𝗟: 𝐌 𝐀 𝐌𝐀𝐍𝐍𝐀𝐍 𝐌𝐀𝐍𝐈𝐊 𝐇𝐈𝐆𝐇 𝐒𝐂𝐇𝐎𝐎𝐋
» 💔 𝗥𝗘𝗟𝗔𝗧𝗜𝗢𝗡𝗦𝗛𝗜𝗣: 𝐒𝐈𝐍𝐆𝐋𝐄
» 🛠 𝗪𝗢𝗥𝗞: 𝐍𝐎𝐓 𝐖𝐎𝐑𝐊𝐈𝐍𝐆
» 🕒 𝗧𝗜𝗠𝗘: ${time}
» 📅 𝗗𝗔𝗧𝗘: ${date}
───────────────
» 👑 𝗚𝗥𝗢𝗨𝗣: ${groupName}
» ⚙️ 𝗣𝗥𝗘𝗙𝗜𝗫: ${prefix}
» 💬 𝗛𝗘𝗟𝗣: ${prefix}help2
» 📦 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦: ${totalCommands}
» ⏳ 𝗨𝗣𝗧𝗜𝗠𝗘: ${uptimeString}
───────────────
» 🌐 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞: https://www.facebook.com/profile.php?id=61591371186179
» 💬 𝗧𝗜𝗞𝗧𝗢𝗞: @sybar_71_hackar
» 📞 IMO: +8801734339892`,
      attachment: attachment
    });
  }
};
