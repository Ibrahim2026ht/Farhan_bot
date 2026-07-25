const fs = require("fs");
const axios = require("axios");

const baseApiUrl = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports.config = {
  name: "mygirl",
  version: "1.7",
  role: 0,
  author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  category: "fun",
  cooldowns: 5
};

module.exports.onStart = async ({ event, api, args }) => {
  try {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions)[0] || (event.messageReply && event.messageReply.senderID);

    if (!mention)
      return api.sendMessage(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ⚠️ অনুগ্রহ করে কাউকে ট্যাগ বা রিপ্লাই দিন।
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, threadID, messageID);

    const user1 = senderID;
    const user2 = mention;

    const baseUrl = await baseApiUrl();
    const apiUrl = `${baseUrl}/api/myboy?user1=${user1}&user2=${user2}`;

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

    const imgPath = __dirname + `/cache/mygirl_${user1}_${user2}.png`;
    fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

    api.sendMessage({
      body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🖤 𝗧𝗛𝗔𝗧'𝗦 𝗠𝗔𝗛 𝗚𝗜𝗥𝗟!
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => fs.unlinkSync(imgPath), messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» ❌ কিছু একটা সমস্যা হয়েছে।
───────────────
» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, event.threadID, event.messageID);
  }
};
