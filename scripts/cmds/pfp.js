const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "pfp",
    aliases: ["pp", "profilepic", "profile"],
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    description: {
      vi: "Lấy ảnh đại diện của người dùng",
      en: "Fetch user's profile picture"
    },
    category: "utility",
    guide: {
      vi: '   {pn}: Lấy ảnh đại diện của bạn'
        + '\n   {pn} <@tag>: Lấy ảnh đại diện của người được tag'
        + '\n   {pn} <uid>: Lấy ảnh đại diện từ UID'
        + '\n   {pn} <profile_link>: Lấy ảnh đại diện từ link profile'
        + '\n   (Hoặc reply tin nhắn của ai đó)',
      en: '   {pn}: Fetch your profile picture'
        + '\n   {pn} <@tag>: Fetch tagged user\'s profile picture'
        + '\n   {pn} <uid>: Fetch profile picture from UID'
        + '\n   {pn} <profile_link>: Fetch profile picture from profile link'
        + '\n   (Or reply to someone\'s message)'
    }
  },

  langs: {
    vi: {
      fetching: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🔍 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗣𝗜𝗖𝗧𝗨𝗥𝗘\n» ⏳ Đang lấy ảnh đại diện...\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
      success: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📸 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗣𝗜𝗖𝗧𝗨𝗥𝗘\n» 👤 Ảnh đại diện của %1\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
      error: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ Không thể lấy ảnh đại diện: %1\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
      invalidUID: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ UID không hợp lệ!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
    },
    en: {
      fetching: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🔍 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗣𝗜𝗖𝗧𝗨𝗥𝗘\n» ⏳ ছবি লোড করা হচ্ছে, অপেক্ষা করুন...\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
      success: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📸 𝗣𝗥𝗢𝗙𝗜𝗟𝗘 𝗣𝗜𝗖𝗧𝗨𝗥𝗘\n» 👤 %1-এর প্রোফাইল পিকচার!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
      error: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ প্রোফাইল পিকচার পাওয়া যায়নি: %1\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
      invalidUID: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ সঠিক ইউআইডি (UID) দেওয়া হয়নি!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
    }
  },

  onStart: async function ({ api, message, args, event, getLang, usersData }) {
    try {
      let uid = event.senderID;
      
      if (event.messageReply) {
        uid = event.messageReply.senderID;
      } else if (Object.keys(event.mentions || {}).length > 0) {
        uid = Object.keys(event.mentions)[0];
      } else if (args[0]) {
        if (!isNaN(args[0])) {
          uid = args[0];
        } else if (args[0].includes("facebook.com/")) {
          const match = args[0].match(/(?:profile\.php\?id=|\/)([\d]+)/);
          if (match)
            uid = match[1];
          else {
            const vanityMatch = args[0].match(/facebook\.com\/([^/?]+)/);
            if (vanityMatch) {
              try {
                const response = await axios.get(`https://www.facebook.com/${vanityMatch[1]}`);
                const uidMatch = response.data.match(/"userID":"(\d+)"/);
                if (uidMatch)
                  uid = uidMatch[1];
              } catch (err) {
                return message.reply(getLang("error", "Could not extract UID from link"));
              }
            }
          }
        }
      }
      
      if (!uid || isNaN(uid))
        return message.reply(getLang("invalidUID"));
      
      await message.reply(getLang("fetching"));
      
      const userName = await usersData.getName(uid);
      const avatarURL = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      
      const cachePath = path.join(__dirname, "cache", `pfp_${uid}.jpg`);
      await fs.ensureDir(path.dirname(cachePath));
      
      const response = await axios.get(avatarURL, { responseType: "arraybuffer" });
      await fs.writeFile(cachePath, Buffer.from(response.data));
      
      await message.reply({
        body: getLang("success", userName),
        attachment: fs.createReadStream(cachePath)
      });
      
      await fs.remove(cachePath);
    } catch (err) {
      console.error("Error in pfp command:", err);
      return message.reply(getLang("error", err.message));
    }
  }
};
