 function toBoldStyle(text) {
  if (!text) return "";
  const normalChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const boldChars   = "𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗";
  
  return text.toString().split("").map(char => {
    const index = normalChars.indexOf(char);
    return index !== -1 ? boldChars.substring(index * 2, (index * 2) + 2) : char;
  }).join("");
}

module.exports = {
  config: {
    name: "antiout",
    version: "𝟕.𝟎",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍", // 🔒 LOCKED AUTHOR
    countDown: 5,
    role: 0,
    shortDescription: "𝐄𝐧𝐚𝐛𝐥𝐞 𝐨𝐫 𝐝𝐢𝐬𝐚𝐛𝐥𝐞 𝐚𝐧𝐭𝐢𝐨𝐮𝐭",
    longDescription: "",
    category: "𝐛𝐨𝐱𝐜𝐡𝐚𝐭",
    guide: "{𝐩𝐧} [𝐨𝐧 | 𝐨𝐟𝐟]"
  },

  onStart: async function ({ message, event, threadsData, args }) {

    // 🔒 author lock check
    if (module.exports.config.author !== "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") return;

    let antiout = await threadsData.get(event.threadID, "settings.antiout");

    if (antiout === undefined) {
      await threadsData.set(event.threadID, true, "settings.antiout");
      antiout = true;
    }

    if (!["on", "off"].includes(args[0])) {
      return message.reply(`বস সিয়াম ডাক দে😜 𝐔𝐬𝐞 '𝐨𝐧' 𝐨𝐫 '𝐨𝐟𝐟' 𝐛𝐫𝐨!`);
    }

    await threadsData.set(event.threadID, args[0] === "on", "settings.antiout");
    return message.reply(`😎 𝐀𝐧𝐭𝐢out ${args[0] === "on" ? "𝐄𝐍𝐀𝐁𝐋𝐄𝐃 🔥" : "𝐃𝐈𝐒𝐀𝐁𝐋𝐄𝐃 ❌"}`);
  },

  onEvent: async function ({ api, event, threadsData }) {

    // 🔒 author lock check
    if (module.exports.config.author !== "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍") return;

    const antiout = await threadsData.get(event.threadID, "settings.antiout");
    if (!antiout) return;

    if (
      event.logMessageType === "log:unsubscribe" &&
      event.logMessageData &&
      event.logMessageData.leftParticipantFbId
    ) {

      const userId = event.logMessageData.leftParticipantFbId;
      if (userId == api.getCurrentUserID()) return;

      let leaveData = await threadsData.get(event.threadID, "data.leaveCount") || {};
      leaveData[userId] = (leaveData[userId] || 0) + 1;
      await threadsData.set(event.threadID, leaveData, "data.leaveCount");

      const styledCount = toBoldStyle(leaveData[userId]);

      if (leaveData[userId] > 5) {
        return api.sendMessage(
          `🛑 ${styledCount} বার পালাইছস! 🤡
তুই এখন "𝐄𝐬𝐜𝐚𝐩𝐞 𝐋𝐞𝐠𝐞𝐧𝐝" 💀🏆
আর 𝐚𝐝𝐝 করা হইবো না! 𝐁𝐲𝐞 𝐛𝐲𝐞 👋

_𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 亗 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍 亗 ⚡_`,
          event.threadID
        );
      }

      try {
        await api.addUserToGroup(userId, event.threadID);

        const userInfo = await api.getUserInfo(userId);
        const userName = toBoldStyle(userInfo[userId].name); // অটো জেনারেট হওয়া নাম মোটা হরফে আসবে

        if (leaveData[userId] >= 3) {
          try {
            await api.changeNickname(toBoldStyle("𝐑𝐮𝐧𝐧𝐞𝐫 𝐏𝐫𝐨 🏃‍♂️🔥"), event.threadID, userId);
          } catch (e) {}
        }

        if (leaveData[userId] == 4) {

          api.sendMessage(
            {
              body: `😏🔥 ${userName} ৪ বার পালাইছস!!

𝐑𝐞𝐬𝐮𝐦𝐞 তে লিখবি —
"𝐏𝐫𝐨𝐟𝐞𝐬𝐬𝐢𝐨𝐧𝐚𝐥 𝐆𝐫𝐨𝐮𝐩 𝐋𝐞𝐚𝐯𝐞𝐫 – 𝟒 𝐘𝐞𝐚𝐫𝐬 𝐄𝐱𝐩𝐞𝐫𝐢𝐞𝐧𝐜𝐞" 🤡📄

আর একবার করলে 𝐬𝐮𝐫𝐩𝐫𝐢𝐬𝐞 আছে 💀

_𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 亗 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍 亗 ⚡_`,
              mentions: [{
                tag: userName,
                id: userId
              }]
            },
            event.threadID
          );

        } else if (leaveData[userId] == 3) {

          api.sendMessage(
            {
              body: `💀 ${userName} আবার পালাইছে!

৩ বার 𝐚𝐥𝐫𝐞𝐚𝐝𝐲 🤡
তুই এখন 𝐨𝐟𝐟𝐢𝐜𝐢𝐚𝐥𝐥𝐲 𝐑𝐮𝐧𝐧𝐞𝐫 𝐏𝐫𝐨 🏃‍♂️🔥

𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲 তোর উপর নজর রাখতেছে 👀

_𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 亗 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍 亗 ⚡_`,
              mentions: [{
                tag: userName,
                id: userId
              }]
            },
            event.threadID
          );

        } else if (leaveData[userId] == 5) {

          api.sendMessage(
            {
              body: `⚠️ 𝐋𝐀𝐒𝐓 𝐖𝐀𝐑𝐍𝐈𝐍𝐆 ${userName}

৫ বার পালাইছস 😈
আর একবার করলে 𝐩𝐞𝐫𝐦𝐚𝐧𝐞𝐧𝐭 𝐟𝐫𝐞𝐞𝐝𝐨𝐦 😌

𝐁𝐨𝐭 𝐰𝐚𝐭𝐜𝐡𝐢𝐧𝐠 𝐲𝐨𝐮 🕵️‍♂️🔥

_𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 亗 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍 亗 ⚡_`,
              mentions: [{
                tag: userName,
                id: userId
              }]
            },
            event.threadID
          );

        } else {

          api.sendMessage(
            {
              body: `🚨🔍 𝐅𝐁𝐈 𝐀𝐋𝐄𝐑𝐓! 🚨

${userName} পালানোর চেষ্টা করছিল 🏃‍♂️💨
কিন্তু 𝐬𝐚𝐭𝐞𝐥𝐥𝐢𝐭𝐞 𝐭𝐫𝐚𝐜𝐤𝐢𝐧𝐠 𝐬𝐲𝐬𝐭𝐞𝐦 এ ধরা খাইছে 📡😎

𝐀𝐫𝐞𝐚 𝟓𝟏 𝐥𝐞𝐯𝐞𝐥 𝐬𝐞𝐜𝐮𝐫𝐢𝐭𝐲 🔒👽
𝐌𝐢𝐬𝐬𝐢𝐨𝐧: 𝐑𝐞-𝐀𝐝𝐝𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲 ✅🔥
(𝐋𝐞𝐚𝐯𝐞 𝐜𝐨𝐮𝐧𝐭: ${styledCount}/𝟓)

_𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 亗 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍 亗⚡_`,
              mentions: [{
                tag: userName,
                id: userId
              }]
            },
            event.threadID
          );

        }

      } catch (err) {

        api.sendMessage(
          `🤡 পালানোর প্ল্যান সফল হইছে মনে হয়ছে! হয়তো ওর লগে আমি এড না অথবা আমাকে বিয়ে করছে 😭
এইবার বেঁচে গেলি 😏

_𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 亗 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍 亗 ⚡_`,
          event.threadID
        );

      }
    }
  }
};
