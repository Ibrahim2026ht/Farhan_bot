const axios = require("axios");

const DEFAULT_GROUP_ID = "1018073844423801";

if (!global.videoBoxActiveThreads) {
  global.videoBoxActiveThreads = new Set([DEFAULT_GROUP_ID]);
}
if (!global.videoBoxWarns) {
  global.videoBoxWarns = {};
}
if (!global.videoBoxLastMsgIDs) {
  global.videoBoxLastMsgIDs = {};
}

function toBold(text) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bold = "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞🇱𝗠𝗡𝗢𝗣𝗤🇷𝗦𝗧🇺𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸🇱𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";
  return text.split('').map(char => {
    const index = alphabet.indexOf(char);
    return index !== -1 ? bold.slice(index * 2, (index + 1) * 2) : char;
  }).join('');
}

module.exports = {
  config: {
    name: "videobox",
    version: "3.0.0",
    author: "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    role: 0,
    premium: false,
    description: "Video box management and protection system with 3-tier warning handling",
    category: "box-protection",
    guide: {
      en: "Use 'videobox on' or 'videobox off' to manage protection."
    }
  },

  onStart: async function ({ api, event, args }) {
    const threadID = String(event.threadID);
    const command = args[0]?.toLowerCase();

    if (command === "on") {
      try {
        global.videoBoxActiveThreads.add(threadID);
        if (api.setMessageReaction) {
          await api.setMessageReaction("✅", event.messageID, () => {}, true);
        }
      } catch (error) {
        console.error(error);
        if (api.setMessageReaction) {
          await api.setMessageReaction("❌", event.messageID, () => {}, true);
        }
      }
    } else if (command === "off") {
      try {
        global.videoBoxActiveThreads.delete(threadID);
        if (api.setMessageReaction) {
          await api.setMessageReaction("✅", event.messageID, () => {}, true);
        }
      } catch (error) {
        console.error(error);
        if (api.setMessageReaction) {
          await api.setMessageReaction("❌", event.messageID, () => {}, true);
        }
      }
    }
  },

  onChat: async function ({ api, event }) {
    const threadID = String(event.threadID);
    
    if (!global.videoBoxActiveThreads.has(threadID)) return;
    if (String(event.senderID) === String(api.getCurrentUserID())) return;

    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const adminIDs = threadInfo.adminIDs.map(admin => String(admin.id));
      const senderID = String(event.senderID);

      if (adminIDs.includes(senderID)) return;

      const botID = String(api.getCurrentUserID());
      const isBotAdmin = adminIDs.includes(botID);

      const hasVideo = event.attachments && event.attachments.some(att => att.type === "video");
      const hasVoice = event.attachments && event.attachments.some(att => att.type === "audio" || att.type === "voice");

      if (hasVideo || hasVoice) {
        if (api.setMessageReaction) {
          const reacts = [
            "😀","😃","😄","😁","😆","😅","😂","🤣","🥲","🥹","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥸","🤩","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","😢","😭","😮‍💨","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🫣","🤗","🫡","🤔","🤫","🫠","🤥","😶","🫥","😐","😑","😬","🫨","😮","😯","😲","🥱","😴","🤤","😪","😵","😵‍💫","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿","👹","👺","🤡","💩","👻","💀","☠️","👽","👾","🤖","🎃","😺","😸","😹","😻","😼","😽","🙀","😿","😾"
          ];
          const randomReact = reacts[Math.floor(Math.random() * reacts.length)];
          await api.setMessageReaction(randomReact, event.messageID, () => {}, true);
        }
        return;
      }

      if (!isBotAdmin) return;

      if (api.unsendMessage && event.messageID) {
        try { await api.unsendMessage(event.messageID); } catch(e){}
      }

      if (!global.videoBoxWarns[senderID]) {
        global.videoBoxWarns[senderID] = 1;
      } else {
        global.videoBoxWarns[senderID] += 1;
      }

      const currentWarnCount = global.videoBoxWarns[senderID];

      if (currentWarnCount <= 3) {
        const userInfo = await api.getUserInfo(senderID);
        const name = userInfo[senderID]?.name || "User";

        const warningBody = 
`📢 『░⃟̎̎̎̎̐𝄞𝐅𝐑𝐈𝐄𝐍𝐃𝐒' 𝄟≛⃝𝐕𝐈𝐃𝐄𝐎≛⃝𝄟𝐁𝐎𝐗░⃟̎̎̎̎̐』\n\n` +
`🕌 𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔 𝐀𝐋𝐀𝐈𝐊𝐔𝐌 🤲\n\n` +
`🚫 @Everyone ⚠️\n` +
`📢 এটি একটি 𝐕𝐈𝐃𝐄𝐎 𝐁𝐎𝐗।\n` +
`⛔ এখানে কোনো প্রকার Sticker, Emoji বা Text করা সম্পূর্ণ নিষিদ্ধ।\n` +
`❌ ৩ বার স্টিকার, ইমোজি বা টেক্সট করলে সাথে সাথেই Kick/Remove করা হবে।\n` +
`⚠️ আপনার বর্তমান ওয়ার্নিং সংখ্যা: ${currentWarnCount}/৩\n` +
`🎥 এখানে শুধুমাত্র ভিডিও পোস্ট করবেন।\n` +
`🤝 সবাই নিয়ম মেনে চলুন এবং সুন্দর পরিবেশ বজায় রাখুন।\n` +
`💖 ধন্যবাদ।\n` +
`━━━━━━━━━━━━━━━━━━\n` +
`${toBold("OWNER")} ➜ 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`;

        const finalMsg = {
          body: `───────────────\n\n» ⚠️ @${name} ${warningBody}\n\n───────────────\n» 👑 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍`,
          mentions: [{ tag: `@${name}`, id: senderID }]
        };

        const previousMsgID = global.videoBoxLastMsgIDs[senderID];
        if (previousMsgID && api.unsendMessage) {
          try { await api.unsendMessage(previousMsgID); } catch(e){}
        }

        return api.sendMessage(finalMsg, threadID, (err, info) => {
          if (!err && info && info.messageID) {
            global.videoBoxLastMsgIDs[senderID] = info.messageID;
          }
        });

      } else {
        delete global.videoBoxWarns[senderID];
        
        const previousMsgID = global.videoBoxLastMsgIDs[senderID];
        if (previousMsgID && api.unsendMessage) {
          try { await api.unsendMessage(previousMsgID); } catch(e){}
        }
        delete global.videoBoxLastMsgIDs[senderID];

        return api.removeUserFromGroup(senderID, threadID);
      }

    } catch (error) {
      console.error(error);
    }
  }
};
