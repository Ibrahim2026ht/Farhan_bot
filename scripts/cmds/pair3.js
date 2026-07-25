const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

async function getApiBase() {
  try {
    const GITHUB_RAW = "https://raw.githubusercontent.com/Saim-x69x/sakura/main/ApiUrl.json";
    const res = await axios.get(GITHUB_RAW);
    return res.data.apiv1;
  } catch (e) {
    console.error("GitHub raw fetch error:", e.message);
    return null;
  }
}

async function toFont(text, id = 21) {
  try {
    const apiBase = await getApiBase();
    if (!apiBase) return text;
    const apiUrl = `${apiBase}/api/font?id=${id}&text=${encodeURIComponent(text)}`;
    const { data } = await axios.get(apiUrl);
    return data.output || text;
  } catch (e) {
    console.error("Font API error:", e.message);
    return text;
  }
}

module.exports = {
  config: {
    name: "pair3",
    aliases: ["lovepair3", "match3"],
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    version: "2.0",
    role: 0,
    category: "love",
    shortDescription: { en: "💘 Generate a love match between you and another group member" },
    longDescription: { en: "This command calculates a love match based on gender. Shows avatars, background, and love percentage." },
    guide: { en: "{p}{n} — Use this command in a group to find a love match" }
  },

  onStart: async function ({ api, event, usersData }) {
    const cacheDir = path.join(__dirname, "cache");
    fs.ensureDirSync(cacheDir);
    const outputPath = path.join(cacheDir, `pair3_${event.senderID}_${Date.now()}.png`);

    try {
      const senderData = await usersData.get(event.senderID);
      let senderName = senderData.name;

      const threadData = await api.getThreadInfo(event.threadID);
      const users = threadData.userInfo || [];

      const myData = users.find(user => user.id === event.senderID);
      if (!myData || !myData.gender) {
        return api.sendMessage(
          "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚\n» ❌ আপনার জেন্ডার নির্ধারণ করা যায়নি!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
          event.threadID,
          event.messageID
        );
      }

      const myGender = myData.gender.toUpperCase();
      let matchCandidates = [];

      if (myGender === "MALE") matchCandidates = users.filter(user => user.gender === "FEMALE" && user.id !== event.senderID);
      else if (myGender === "FEMALE") matchCandidates = users.filter(user => user.gender === "MALE" && user.id !== event.senderID);

      if (matchCandidates.length === 0) {
        return api.sendMessage(
          "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗡𝗢 𝗠𝗔𝗧𝗖𝗛\n» ❌ গ্রুপে বিপরীত লিঙ্গের কোনো মেম্বার পাওয়া যায়নি!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
          event.threadID,
          event.messageID
        );
      }

      const selectedMatch = matchCandidates[Math.floor(Math.random() * matchCandidates.length)];
      let matchName = selectedMatch.name;

      senderName = await toFont(senderName, 21);
      matchName = await toFont(matchName, 21);

      const avatar1 = `https://graph.facebook.com/${event.senderID}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const avatar2 = `https://graph.facebook.com/${selectedMatch.id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const apiBase = await getApiBase();
      if (!apiBase) {
        return api.sendMessage(
          "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ এপিআই সার্ভার কানেক্ট করতে ব্যর্থ হয়েছে!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
          event.threadID,
          event.messageID
        );
      }

      const apiUrl = `${apiBase}/api/pair4?avatar1=${encodeURIComponent(avatar1)}&avatar2=${encodeURIComponent(avatar2)}`;

      const imageRes = await axios.get(apiUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(outputPath, Buffer.from(imageRes.data));

      const lovePercent = Math.floor(Math.random() * 31) + 70;

      const messageText = 
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n` +
        `» 💗 𝗠𝗔𝗧𝗖𝗛𝗠𝗔𝗞𝗜𝗡𝗚 𝗖𝗢𝗠𝗣𝗟𝗘𝗧𝗘\n` +
        `» 👤 ${senderName}\n` +
        `» 👤 ${matchName}\n` +
        `» 🌹 ভাগ্য আপনাদের দুজনকে একসাথে বেঁধে দিল!\n` +
        `» 💘 মিলের শতাংশ: ${lovePercent}%\n───────────────\n` +
        `» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

      api.sendMessage(
        { body: messageText, attachment: fs.createReadStream(outputPath) },
        event.threadID,
        () => fs.removeSync(outputPath),
        event.messageID
      );

    } catch (error) {
      console.error("Pair3 Command Error:", error);
      if (fs.existsSync(outputPath)) fs.removeSync(outputPath);

      api.sendMessage(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ জোড়া তৈরি করতে সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        event.threadID,
        event.messageID
      );
    }
  }
};
