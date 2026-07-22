const fs = require("fs-extra");
const path = require("path");

const AUTHOR = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍"; // 🔒 locked author
const dataPath = path.join(__dirname, "cache", "economy.json");

// ডাটাবেজ হেল্পার ফাংশন
function getEconomyData() {
  if (!fs.existsSync(dataPath)) {
    fs.ensureDirSync(path.join(__dirname, "cache"));
    fs.writeFileSync(dataPath, JSON.stringify({}));
  }
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

function saveEconomyData(data) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = {
  config: {
    name: "rob",
    aliases: ["steal", "ডাকাতি", "চুরি"],
    version: "1.0",
    author: AUTHOR,
    role: 0,
    category: "game",
    guide: "rob @mention (যাকে ডাকাতি করতে চান)",
    countDown: 10
  },

  onStart: async function ({ api, event, args }) {
    try {
      // 🔒 AUTHOR LOCK SYSTEM
      if (module.exports.config.author !== AUTHOR) {
        return api.sendMessage(
          "⛔ This file is locked!\nAuthor change detected.",
          event.threadID
        );
      }

      const mentions = Object.keys(event.mentions);
      let targetID;

      if (mentions.length > 0) {
        targetID = mentions[0];
      } else if (event.type === "message_reply") {
        targetID = event.messageReply.senderID;
      } else {
        return api.sendMessage(
          "⚠️ কাকে ডাকাতি করতে চান তাকে মেনশন বা মেসেজে রিপ্লাই দিন!\nযেমন: rob @friend",
          event.threadID
        );
      }

      const robberID = event.senderID;

      if (robberID === targetID) {
        return api.sendMessage("❌ নিজের পকেটেই নিজে ডাকাতি করতে চান? বুদ্ধি তো চরম!", event.threadID);
      }

      // নাম ও ডাটা সংগ্রহ
      const db = getEconomyData();

      // প্লেয়ারদের প্রাথমিক ব্যালেন্স জেনারেট (ডিফল্ট ৫০০ কয়েন)
      if (!db[robberID]) db[robberID] = { coins: 1000 };
      if (!db[targetID]) db[targetID] = { coins: 1000 };

      let robberName = "ডাকাাত";
      let targetName = "শিকার";

      try {
        const info = await api.getUserInfo([robberID, targetID]);
        robberName = info[robberID]?.name || "ডাকাাত";
        targetName = info[targetID]?.name || "শিকার";
      } catch (e) {}

      if (db[targetID].coins < 200) {
        return api.sendMessage(
          `😅 ${targetName} এমনিতেই ফকির! তার ব্যাংকে পর্যাপ্ত টাকা নেই।`,
          event.threadID
        );
      }

      // ডাকাতির সাকসেস রেট (৫০% চান্স)
      const success = Math.random() < 0.5;

      if (success) {
        // ২০% থেকে ৫০% পর্যন্ত চুরি হবে
        const stolenPercent = Math.floor(Math.random() * 31) + 20;
        const stolenAmount = Math.floor((db[targetID].coins * stolenPercent) / 100);

        db[targetID].coins -= stolenAmount;
        db[robberID].coins += stolenAmount;
        saveEconomyData(db);

        const msg = `» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
───────────────
🥷 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟! 💰
───────────────
🔥 ${robberName}** সফলভাবে ${targetName} এর ব্যাংক হ্যাক করেছে!

💸 চুরি করা অ্যামাউন্ট: $${stolenAmount.toLocaleString()}
👛 ${robberName} এর বর্তমান ব্যালেন্স: $${db[robberID].coins.toLocaleString()}
📉 ${targetName} এর বাঁকি ব্যালেন্স: $${db[targetID].coins.toLocaleString()}
───────────────
» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        return api.sendMessage(msg, event.threadID);
      } else {
        // পুলিশ ধরে ফেলেছে! জরিমানা ৫০%
        const penalty = Math.floor(db[robberID].coins * 0.3);
        db[robberID].coins -= penalty;
        db[targetID].coins += penalty; // জরিমানা ভিকটিম পেয়ে যাবে
        saveEconomyData(db);

        const msg = `» 👑 𝗢𝗪𝗡𝗘𝗥 : 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍
───────────────
🚨 𝗥𝗢𝗕𝗕𝗘𝗥𝗬 𝗙𝗔𝗜𝗟𝗘𝗗! 🚓
───────────────
🚔 ${robberName}** ডাকাতি করতে গিয়ে পুলিশের হাতে ধরা খেয়েছে!

⚠️ জরিমানা হিসেবে $${penalty.toLocaleString()} টাকা কেটে ${targetName} কে দেওয়া হলো!
👛 ${robberName} এর বর্তমান ব্যালেন্স: $${db[robberID].coins.toLocaleString()}
───────────────
» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        return api.sendMessage(msg, event.threadID);
      }

    } catch (e) {
      console.error(e);
      return api.sendMessage("❌ ডাকাতি প্রক্রিয়ায় সমস্যা হয়েছে!", event.threadID);
    }
  }
};
