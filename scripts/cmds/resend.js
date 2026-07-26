const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "resend",
    version: "2.2.0",
    role: 0,
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 0,
    shortDescription: "Auto resend removed messages and media files",
    longDescription: "Automatically sends deleted text messages, photos, videos, audios, and files. Control per group (resend on/off) or globally by bot admin (resendall on/off).",
    category: "general",
    guide: {
      en: "resend on / resend off\nresendall on / resendall off (Bot Admin only)",
      bn: "resend on / resend off\nresendall on / resendall off (বট এডমিন মাত্র)"
    }
  },

  onLoad: function () {
    if (!global.logMessage) global.logMessage = new Map();
  },

  handleEvent: async function ({ event, api, usersData, threadsData }) {
    const { threadID, messageID, senderID, body, attachments, type } = event;

    if (!global.logMessage) global.logMessage = new Map();

    try {
      // ১. গ্লোবাল রিসেন্ড স্ট্যাটাস চেক
      let globalStatus = true;
      try {
        const globalData = await threadsData.get("global_resend_status");
        if (globalData && globalData.status === false) {
          globalStatus = false;
        }
      } catch (e) {}

      if (!globalStatus) return;

      // ২. নির্দিষ্ট গ্রুপের স্ট্যাটাস চেক
      let threadData = {};
      try {
        threadData = (await threadsData.get(threadID)) || {};
      } catch (e) {}

      const isResendOff = threadData.resend === false;
      if (isResendOff) return;

      // ৩. সাধারণ মেসেজ বা মিডিয়া ক্যাশ করা (message_unsend ছাড়া যেকোনো নরমাল মেসেজ)
      if (type !== "message_unsend") {
        if (body || (attachments && attachments.length > 0)) {
          global.logMessage.set(messageID, {
            msgBody: body || "",
            attachment: attachments || [],
            senderID: senderID
          });
        }
        return;
      }

      // ৪. মেসেজ বা মিডিয়া আনসেন্ট (message_unsend) হলে হ্যান্ডেল করা
      if (type === "message_unsend") {
        const msg = global.logMessage.get(messageID);
        if (!msg) return;

        // বট নিজের ডিলিট করা মেসেজ রিসেন্ড করবে না
        if (msg.senderID === api.getCurrentUserID()) return;

        let userName = "Member";
        try {
          if (usersData && typeof usersData.get === "function") {
            const userData = await usersData.get(msg.senderID);
            userName = userData?.name || "Member";
          }
        } catch (e) {}

        // যদি কোনো অ্যাটাচমেন্ট না থাকে, শুধু টেক্সট পাঠাবে
        if (!msg.attachment || msg.attachment.length === 0) {
          api.sendMessage(
            `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱!\n» 👤 𝗡𝗮𝗺𝗲: ${userName}\n» 🗑️ 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${msg.msgBody || "Empty Message"}\n───────────────\n» 🛑 𝗕𝗮𝗻𝗱𝗵𝗼 𝗸𝗼𝗿𝘁𝗲 𝗹𝗶𝗸𝗵𝘂𝗻: resend off\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
            threadID
          );
          global.logMessage.delete(messageID);
          return;
        }

        // যদি ছবি, ভিডিও, অডিও বা যেকোনো মিডিয়া ফাইল থাকে
        let attachmentsList = [];
        let filePaths = [];
        let count = 0;

        for (const file of msg.attachment) {
          try {
            count++;
            const fileUrl = file.url || file.previewUrl || file.playableUrl;
            if (!fileUrl) continue;

            // ফাইল এক্সটেনশন ঠিক করা
            let ext = "jpg";
            if (file.type === "photo") ext = "jpg";
            else if (file.type === "video") ext = "mp4";
            else if (file.type === "audio") ext = "mp3";
            else if (file.type === "animated_image") ext = "gif";
            else {
              const urlExt = fileUrl.split(".").pop().split("?")[0];
              if (urlExt && urlExt.length <= 4) ext = urlExt;
            }

            const cacheDir = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

            const filePath = path.join(cacheDir, `resend_${Date.now()}_${count}.${ext}`);
            const response = await axios.get(fileUrl, { responseType: "arraybuffer", timeout: 15000 });
            fs.writeFileSync(filePath, Buffer.from(response.data));

            attachmentsList.push(fs.createReadStream(filePath));
            filePaths.push(filePath);
          } catch (err) {}
        }

        // ক্যাশ ফাইল মুছে ফেলার হেল্পার ফাংশন
        const cleanUpFiles = () => {
          filePaths.forEach((p) => {
            try {
              if (fs.existsSync(p)) fs.unlinkSync(p);
            } catch (e) {}
          });
        };

        // মিডিয়া ডাউনলোড ব্যর্থ হলে শুধু মেসেজ টেক্সট পাঠাবে
        if (attachmentsList.length === 0) {
          api.sendMessage(
            `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗗𝗲𝘁𝗲𝗰𝘁𝗲𝗱!\n» 👤 𝗡𝗮𝗺𝗲: ${userName}\n» 🗑️ 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${msg.msgBody || "Media File"}\n───────────────\n» 🛑 𝗕𝗮𝗻𝗱𝗵𝗼 𝗸𝗼𝗿𝘁𝗲 𝗹𝗶𝗸𝗵𝘂𝗻: resend off\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
            threadID
          );
          global.logMessage.delete(messageID);
          return;
        }

        // মিডিয়া ফাইলসহ মেসেজ রিসেন্ড করা
        api.sendMessage(
          {
            body: `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗗𝗲𝗹𝗲𝘁𝗲𝗱 𝗠𝗲𝘀𝘀𝗮𝗴𝗲 & 𝗙𝗶𝗹𝗲𝘀!\n» 👤 𝗡𝗮𝗺𝗲: ${userName}\n» 🗑️ 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗖𝗼𝗻𝘁𝗲𝗻𝘁: ${msg.msgBody || "Media File"}\n───────────────\n» 🛑 𝗕𝗮𝗻𝗱𝗵𝗼 𝗸𝗼𝗿𝘁𝗲 𝗹𝗶𝗸𝗵𝘂𝗻: resend off\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
            attachment: attachmentsList
          },
          threadID,
          (err) => {
            cleanUpFiles();
            global.logMessage.delete(messageID);
          }
        );
      }
    } catch (err) {
      console.error("Resend Error:", err);
    }
  },

  onStart: async function ({ api, event, args, threadsData }) {
    const { threadID, messageID, senderID } = event;
    const action = args[0] ? args[0].toLowerCase() : "";

    // ৫. বট এডমিন কমান্ড চেক (resendall on / off)
    if (action === "resendall") {
      const subAction = args[1] ? args[1].toLowerCase() : "";
      if (subAction !== "on" && subAction !== "off") {
        return api.sendMessage(
          `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ ভুল কমান্ড ফরম্যাট!\n» 📖 ব্যবহার করুন: resendall on অথবা resendall off\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          threadID,
          messageID
        );
      }

      // বট এডমিন আইডি লিস্ট চেক
      const adminList = global.config.ADMINBOT || global.config.NDH || [];
      if (!adminList.includes(senderID)) {
        return api.sendMessage(
          `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ❌ এই কমান্ডটি শুধু বট এডমিনের জন্য!\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          threadID,
          messageID
        );
      }

      const turnOn = subAction === "on";
      try {
        await threadsData.set("global_resend_status", { status: turnOn });
      } catch (e) {}

      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✅ সফলভাবে সমস্ত গ্রুপের রিসেন্ড মোড ${turnOn ? "অন" : "অফ"} করা হয়েছে!\n» 🔄 𝗥𝗲𝘀𝗲𝗻𝗱 𝗠𝗼𝗱𝗲: ${turnOn ? "𝗢𝗡 🟢" : "𝗢𝗙𝗙 🔴"}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        messageID
      );
    }

    // ৬. নির্দিষ্ট গ্রুপ কন্ট্রোল (resend on / resend off)
    if (action === "on" || action === "off") {
      let threadData = {};
      try {
        threadData = (await threadsData.get(threadID)) || {};
      } catch (e) {}

      const turnOn = action === "on";
      threadData.resend = turnOn;

      try {
        await threadsData.set(threadID, threadData);
      } catch (e) {}

      return api.sendMessage(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🔄 এই গ্রুপের 𝗥𝗲𝘀𝗲𝗻𝗱 𝗠𝗼𝗱𝗲: ${turnOn ? "𝗢𝗡 🟢" : "𝗢𝗙𝗙 🔴"}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
        threadID,
        messageID
      );
    }

  
   let currentThreadData = {};
    try {
      currentThreadData = (await threadsData.get(threadID)) || {};
    } catch (e) {}

    const groupStatus = currentThreadData.resend !== false ? "𝗢𝗡 🟢" : "𝗢𝗙𝗙 🔴";

    return api.sendMessage(
      `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 📖 𝗥𝗲𝘀𝗲𝗻𝗱 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗚𝘂𝗶𝗱𝗲:\n» ⚡ resend on (গ্রুপে অন করতে)\n» ⚡ resend off (গ্রুপে অফ করতে)\n» ⚡ resendall on (সব গ্রুপে অন - এডমিন)\n» ⚡ resendall off (সব গ্রুপে অফ - এডমিন)\n» 📊 বর্তমান গ্রুপ স্ট্যাটাস: ${groupStatus}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
      threadID,
      messageID
    );
  }
};
