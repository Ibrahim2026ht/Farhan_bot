const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "resend",
    version: "1.4.0",
    role: 0,
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 0,
    shortDescription: "Auto resend removed messages",
    longDescription: "Automatically sends deleted or unsent messages in the group.",
    category: "general",
    guide: {
      en: "{pn}",
      bn: "{pn}"
    }
  },

  onLoad: function () {
    if (!global.logMessage) global.logMessage = new Map();
  },

  handleEvent: async function ({ event, api, usersData }) {
    const { threadID, messageID, senderID, body, attachments, type, logMessageType } = event;

    if (!global.logMessage) global.logMessage = new Map();

    try {
      // সাধারণ মেসেজ ক্যাশ করা
      if (type !== "message_unsend" && logMessageType !== "log:unsubscribe") {
        if (body || (attachments && attachments.length > 0)) {
          global.logMessage.set(messageID, { 
            msgBody: body || "", 
            attachment: attachments || [],
            senderID: senderID 
          });
        }
        return;
      }

      // মেসেজ আনসেন্ট হলে হ্যান্ডেল করা
      if (type === "message_unsend" || logMessageType === "log:unsubscribe") {
        const msg = global.logMessage.get(messageID);
        if (!msg) return;

        if (msg.senderID === api.getCurrentUserID()) return;

        let userName = "Member";
        try {
          if (usersData && typeof usersData.get === "function") {
            const userData = await usersData.get(msg.senderID);
            userName = userData?.name || "Member";
          }
        } catch (e) {}

        const prefix = global.config.PREFIX || "/";

        // যদি কোনো অ্যাটাচমেন্ট না থাকে
        if (!msg.attachment || msg.attachment.length === 0) {
          return api.sendMessage(
            `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱!\n» 👤 𝗡𝗮𝗺𝗲: ${userName}\n» 🗑️ 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${msg.msgBody || "Empty Message"}\n───────────────\n» 🛑 𝗕𝗮𝗻𝗱𝗵𝗼 𝗸𝗼𝗿𝘁𝗲 𝗹𝗶𝗸𝗵𝘂𝗻: ${prefix}resend\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
            threadID
          );
        }

        // যদি ছবি বা ফাইল থাকে
        let attachmentsList = [];
        let count = 0;

        for (const file of msg.attachment) {
          try {
            count++;
            const fileUrl = file.url || file.previewUrl;
            if (!fileUrl) continue;

            const ext = fileUrl.split(".").pop().split("?")[0] || "jpg";
            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
            
            const filePath = path.join(cacheDir, `resend_${Date.now()}_${count}.${ext}`);
            const fileData = (await axios.get(fileUrl, { responseType: "arraybuffer", timeout: 10000 })).data;
            fs.writeFileSync(filePath, Buffer.from(fileData));
            attachmentsList.push(fs.createReadStream(filePath));
          } catch (err) {}
        }

        if (attachmentsList.length === 0) {
          return api.sendMessage(
            `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱!\n» 👤 𝗡𝗮𝗺𝗲: ${userName}\n» 🗑️ 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${msg.msgBody || "Media File"}\n───────────────\n» 🛑 𝗕𝗮𝗻𝗱𝗵𝗼 𝗸𝗼𝗿𝘁𝗲 𝗹𝗶𝗸𝗵𝘂𝗻: ${prefix}resend\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
            threadID
          );
        }

        return api.sendMessage(
          {
            body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 & 𝗙𝗶𝗹𝗲𝘀!\n» 👤 𝗡𝗮𝗺𝗲: ${userName}\n» 🗑️ 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗖𝗼𝗻𝘁𝗲𝗻𝘁\n───────────────\n» 🛑 𝗕𝗮𝗻𝗱𝗵𝗼 𝗸𝗼𝗿𝘁𝗲 𝗹𝗶𝗸𝗵𝘂𝗻: ${prefix}resend\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
            attachment: attachmentsList
          },
          threadID,
          () => {
            attachmentsList.forEach(stream => {
              try {
                if (stream.path && fs.existsSync(stream.path)) {
                  fs.unlinkSync(stream.path);
                }
              } catch (e) {}
            });
          }
        );
      }
    } catch (err) {
      console.error("Resend Error:", err);
    }
  },

  onStart: async function ({ api, event, threadsData }) {
    const { threadID, messageID } = event;
    let threadData = {};
    try {
      if (threadsData && typeof threadsData.get === "function") {
        threadData = await threadsData.get(threadID) || {};
      }
    } catch (e) {}
    
    threadData.resend = (threadData.resend === false) ? true : false;
    
    try {
      if (threadsData && typeof threadsData.set === "function") {
        await threadsData.set(threadID, threadData);
      }
    } catch (e) {}

    return api.sendMessage(
      `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🔄 𝗥𝗲𝘀𝗲𝗻𝗱 𝗠𝗼𝗱𝗲: ${threadData.resend !== false ? "𝗢𝗡 🟢" : "𝗢𝗙𝗙 🔴"}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      threadID,
      messageID
    );
  }
};
