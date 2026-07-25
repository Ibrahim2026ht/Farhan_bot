const QRCode = require('qrcode');
const fs = require('fs-extra');
const path = require('path');

const profileInfo = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 👤 𝗡𝗮𝗺𝗲: 𝗦𝗶𝘆𝗮𝗺 𝗛𝗮𝘀𝗮𝗻
» 📍 𝗔𝗱𝗱𝗿𝗲𝘀𝘀: 𝗞𝗶𝘀𝗵𝗼𝗿𝗲𝗴𝗮𝗻𝗷
» 👉 𝗕𝗮𝗻𝗴𝗹𝗮𝗱𝗲𝘀𝗵
» 💻 𝗥𝗼𝗹𝗲: 𝗕𝗼𝘁 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗲𝗿
» ⚡ 𝗦𝗽𝗲𝗰𝗶𝗮𝗹𝘁𝘆: 𝗡𝗶𝗷𝗵𝘂𝗺
» 🧘 𝗖𝗵𝗮𝘁𝗯𝗼𝘁 & 𝗖𝘂𝘀𝘁𝗼𝗺 𝗕𝗼𝘁
» 🗼 𝗗𝗲𝘃𝗲𝗹𝗼𝗽𝗺𝗲𝗻𝘁
» 💬 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽:
» ☎️ +8801789138157
───────────────
» ❤️ ধন্যবাদ, আমাদের 
» 🛸 বট ব্যবহার করার জন্য।
» 🌸 আশা করি ব্যবহার করে
» 🫶 আনন্দ পাবেন।
» 📢 কোনো সমস্যা বা পরামর্শ
» 🏆 থাকলে যোগাযোগ করুন।
» 🤝 আপনাদের ভালোবাসাই  
» 📿 আমাদের অনুপ্রেরণা।
───────────────
» 🌐 𝗚𝗶𝘁𝗛𝘂𝗯: https://github.com/official-siyam/siyam-bpot-V2-V3-V5-`;

function extractData(args) {
    let data = args.join(" ").trim();
    if (!data) {
        data = profileInfo;
    }
    return data;
}

module.exports = {
  config: {
    name: "qrgen",
    aliases: ["qrcode"],
    version: "1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    longDescription: "» 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝗮 𝗤𝗥 𝗰𝗼𝗱𝗲 𝗳𝗿𝗼𝗺 𝘁𝗲𝘅𝘁, 𝗹𝗶𝗻𝗸, 𝗼𝗿 𝗮𝗻𝘆 𝗶𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻.",
    category: "utility",
    guide: {
      en: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📌 𝗨𝗦𝗔𝗚𝗘 𝗚𝗨𝗜𝗗𝗘\n» 𝗧𝘆𝗽𝗲 {pn} [𝘁𝗲𝘅𝘁 𝗼𝗿 𝗹𝗶𝗻𝗸]\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
    }
  },

  onStart: async function({ message, args, event, api }) {
    const qrData = extractData(args);

    message.reaction("⏳", event.messageID);
    let tempFilePath;

    try {
      const cacheDir = path.join(__dirname, 'cache');
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
      
      tempFilePath = path.join(cacheDir, `qr_code_${Date.now()}.png`);

      await QRCode.toFile(tempFilePath, qrData, {
        color: {
          dark: '#000',  
          light: '#FFF'  
        },
        scale: 8  
      });

      message.reaction("✅", event.messageID);
      
      const sentInfo = await api.sendMessage({
        body: "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦\n» 𝗬𝗼𝘂𝗿 𝗤𝗥 𝗖𝗼𝗱𝗲 𝗛𝗮𝘀 𝗕𝗲𝗲𝗻 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲𝗱\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
        attachment: fs.createReadStream(tempFilePath)
      }, event.threadID);

      if (sentInfo && sentInfo.messageID) {
        global.GoatBot.onReply.set(sentInfo.messageID, {
          type: "qrScanReply",
          commandName: this.config.name,
          author: event.senderID,
          messageID: sentInfo.messageID,
          qrData: qrData
        });
      }

    } catch (error) {
      message.reaction("❌", event.messageID);
      console.error("QRGen Command Error:", error);
      api.sendMessage("» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ 𝗘𝗥𝗥𝗢𝗥\n» 𝗔𝗻 𝗘𝗿𝗿𝗼𝗿 𝗢𝗰𝗰𝘂𝗿𝗿𝗲𝗱 𝗗𝘂𝗿𝗶𝗻𝗴 𝗤𝗥 𝗖𝗼𝗱𝗲 𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗶𝗼𝗻\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧", event.threadID, event.messageID);
    } finally {
      if (tempFilePath && fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
      }
    }
  },

  onReply: async function({ event, api, Reply }) {
    if (Reply.type !== "qrScanReply") return;
    
    const userReply = event.body.trim().toLowerCase();
    if (userReply === "scan" || userReply === "স্ক্যান") {
      try {
        const loadingMsg = await api.sendMessage("» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⏳ 𝗟𝗢𝗔𝗗𝗜𝗡𝗚\n» স্ক্যান হচ্ছে দয়া করে অপেক্ষা করুন...\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧", event.threadID);

        setTimeout(async () => {
          if (loadingMsg && loadingMsg.messageID) {
            await api.unsendMessage(loadingMsg.messageID);
          }
          await api.sendMessage(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📌 𝗤𝗥 𝗦𝗖𝗔𝗡 𝗥𝗘𝗦𝗨𝗟𝗧\n${Reply.qrData}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`, event.threadID, event.messageID);
        }, 3000);
      } catch (e) {
        console.error(e);
      }
    }
  }
};
