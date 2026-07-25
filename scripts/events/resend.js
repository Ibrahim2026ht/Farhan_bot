const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "resend",
    version: "2.1.0",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "Resends un-sent messages with toggle options",
      bn: "আনসেন্ড করা মেসেজ পুনরায় পাঠায়"
    },
    longDescription: {
      en: "Detects un-sent/deleted messages and resends them with attachment support. Includes group and global toggles.",
      bn: "কেউ মেসেজ আনসেন্ড করলে তা চিহ্নিত করে পিকচার/ভিডিও সহ আবার চ্যাটে পাঠিয়ে দেয়।"
    },
    category: "events",
    guide: {
      en: "{p}resend [on/off]\n{p}resend [on/off] all (Only Bot Admin)\n{p}resend [অন/অফ]\n{p}resend [অন/অফ] অল (শুধুমাত্র বট এডমিন)"
    }
  },

  languages: {
    vi: {},
    en: {},
    bn: {}
  },

  onLoad: async function () {
    if (!global.resendMessageCache) {
      global.resendMessageCache = new Map();
    }
  },

  onStart: async function ({ api, event, args, role, threadsData, message }) {
    const threadID = event.threadID;

    if (!args[0]) {
      return message.reply(
        "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n" +
        "───────────────\n" +
        "» ⚠️ 𝗨𝗦𝗔𝗚𝗘\n" +
        "» 📌 /resend on / off\n" +
        "» 📌 /resend অন / অফ\n" +
        "» 📌 /resend on all (Bot Admin)\n" +
        "» 📌 /resend অন অল (Bot Admin)\n" +
        "───────────────\n" +
        "» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
      );
    }

    const subCommand = args[0].toLowerCase();
    const isAll = args[1] ? args[1].toLowerCase() : "";

    try {
      // Global / All Toggle (On or Off for all threads)
      if (isAll === "all" || isAll === "অল") {
        if (role < 2) {
          return message.reply(
            "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n" +
            "───────────────\n" +
            "» ⚠️ 𝗔𝗖𝗖𝗘𝗦𝗦 𝗗𝗘𝗡𝗜𝗘𝗗\n" +
            "» ⛔ সব গ্রুপে একসাথে অন/অফ করার ক্ষমতা শুধুমাত্র বট এডমিনের আছে!\n" +
            "───────────────\n" +
            "» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
          );
        }

        if (subCommand === "on" || subCommand === "অন") {
          const allThreads = await threadsData.getAll();
          for (const thread of allThreads) {
            await threadsData.set(thread.threadID, true, "data.resendStatus");
          }
          return message.reply(
            "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n" +
            "───────────────\n" +
            "» 🛡️ 𝗥𝗘𝗦𝗘𝗡𝗗 𝗔𝗟𝗟 𝗘𝗡𝗔𝗕𝗟𝗘𝗗\n" +
            "» 🚀 বটের সমস্ত গ্রুপে রিসেন্ড সার্ভিস অন করা হলো!\n" +
            "───────────────\n" +
            "» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
          );
        } else if (subCommand === "off" || subCommand === "অফ") {
          const allThreads = await threadsData.getAll();
          for (const thread of allThreads) {
            await threadsData.set(thread.threadID, false, "data.resendStatus");
          }
          return message.reply(
            "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n" +
            "───────────────\n" +
            "» 🔓 𝗥𝗘𝗦𝗘𝗡𝗗 𝗔𝗟𝗟 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗\n" +
            "» 🚫 বটের সমস্ত গ্রুপে রিসেন্ড সার্ভিস অফ করা হলো!\n" +
            "───────────────\n" +
            "» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
          );
        }
      }

      // Specific Thread Toggle (On or Off)
      if (subCommand === "on" || subCommand === "অন") {
        await threadsData.set(threadID, true, "data.resendStatus");
        return message.reply(
          "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n" +
          "───────────────\n" +
          "» 🛡️ 𝗥𝗘𝗦𝗘𝗡𝗗 𝗘𝗡𝗔𝗕𝗟𝗘𝗗\n" +
          "» ✨ এই গ্রুপের জন্য রিসেন্ড সার্ভিস অন করা হয়েছে!\n" +
          "───────────────\n" +
          "» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
        );
      } else if (subCommand === "off" || subCommand === "অফ") {
        await threadsData.set(threadID, false, "data.resendStatus");
        return message.reply(
          "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n" +
          "───────────────\n" +
          "» 🔓 𝗥𝗘𝗦𝗘𝗡𝗗 𝗗𝗜𝗦𝗔𝗕𝗟𝗘𝗗\n" +
          "» 🚫 এই গ্রুপের জন্য রিসেন্ড সার্ভিস অফ করা হয়েছে!\n" +
          "───────────────\n" +
          "» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
        );
      } else {
        return message.reply(
          "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n" +
          "───────────────\n" +
          "» ⚠️ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗢𝗣𝗧𝗜𝗢𝗡\n" +
          "» 📌 অনুগ্রহ করে 'on'/'off' অথবা 'অন'/'অফ' টাইপ করুন।\n" +
          "───────────────\n" +
          "» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
        );
      }
    } catch (err) {
      return message.reply(`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ অন/অফ করতে সমস্যা হয়েছে: ${err.message}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`);
    }
  },

  onChat: async function ({ event }) {
    if (!global.resendMessageCache) {
      global.resendMessageCache = new Map();
    }

    if (event.type === "message" || event.type === "message_reply") {
      global.resendMessageCache.set(event.messageID, {
        body: event.body || "",
        attachments: event.attachments || [],
        senderID: event.senderID
      });

      // ১ ঘণ্টা পর মেমোরি ক্লিয়ারেন্স
      setTimeout(() => {
        if (global.resendMessageCache && global.resendMessageCache.has(event.messageID)) {
          global.resendMessageCache.delete(event.messageID);
        }
      }, 60 * 60 * 1000);
    }
  },

  onEvent: async function ({ event, api, usersData, threadsData }) {
    if (!global.resendMessageCache) return;

    if (event.type === "message_unsend") {
      try {
        // চেক করবে resendStatus অফ করা আছে কিনা (ডিফল্ট অন থাকবে যদি সেট না থাকে)
        const resendStatus = await threadsData.get(event.threadID, "data.resendStatus");
        if (resendStatus === false) return;

        const deletedMsg = global.resendMessageCache.get(event.messageID);

        // যদি ক্যাশে মেসেজ না পাওয়া যায়
        if (!deletedMsg) {
          return api.sendMessage(
            "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n" +
            "───────────────\n" +
            "» ⚠️ 𝗥𝗘𝗦𝗘𝗡𝗗 𝗡𝗢𝗧𝗜𝗖𝗘\n" +
            "» ❌ একটি মেসেজ আনসেন্ড করা হয়েছে, কিন্তু তা বটের ক্যাশ মেমোরিতে পাওয়া যায়নি (বট রিস্টার্ট দেওয়া হয়ে থাকতে পারে)।\n" +
            "───────────────\n" +
            "» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧",
            event.threadID
          );
        }

        let name = "একজন ইউজার";
        try {
          if (usersData && typeof usersData.getName === "function") {
            name = await usersData.getName(deletedMsg.senderID);
          } else if (api.getUserInfo) {
            const userInfo = await api.getUserInfo(deletedMsg.senderID);
            if (userInfo && userInfo[deletedMsg.senderID]) {
              name = userInfo[deletedMsg.senderID].name || name;
            }
          }
        } catch (e) {
          // নাম ফেস করতে না পারলে ডিফল্ট থাকবে
        }

        const msgText = 
          `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n` +
          `───────────────\n` +
          `» ⚠️ 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗨𝗡𝗦𝗘𝗡𝗗\n` +
          `» 👤 𝗡𝗮𝗺𝗲: ${name}\n` +
          `» 💬 𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${deletedMsg.body || "কোনো টেক্সট ছিল না (শুধু মিডিয়া ছিল)"}\n` +
          `───────────────\n` +
          `» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        const cacheDir = path.join(__dirname, "cache");
        await fs.ensureDir(cacheDir);

        if (deletedMsg.attachments && deletedMsg.attachments.length > 0) {
          const temporaryPaths = [];

          for (let index = 0; index < deletedMsg.attachments.length; index++) {
            const item = deletedMsg.attachments[index];
            let ext = "png";

            if (item.type === "photo") ext = "jpg";
            else if (item.type === "video") ext = "mp4";
            else if (item.type === "audio") ext = "mp3";

            const filePath = path.join(cacheDir, `resend_${event.messageID}_${index}.${ext}`);

            try {
              const getStream = await axios.get(item.url, { responseType: "arraybuffer" });
              await fs.outputFile(filePath, getStream.data);
              temporaryPaths.push(filePath);
            } catch (e) {
              console.error("[RESEND] Attachment download failed:", e.message);
            }
          }

          try {
            const attachmentsStreams = temporaryPaths.map(p => fs.createReadStream(p));

            await api.sendMessage({
              body: msgText,
              attachment: attachmentsStreams
            }, event.threadID);
          } catch (err) {
            api.sendMessage(
              `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ আনসেন্ড মিডিয়া পাঠাতে ব্যর্থ হয়েছে: ${err.message}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
              event.threadID
            );
          } finally {
            setTimeout(() => {
              for (const filePath of temporaryPaths) {
                if (fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
                }
              }
            }, 5000);
          }

        } else {
          try {
            await api.sendMessage(msgText, event.threadID);
          } catch (err) {
            api.sendMessage(
              `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ আনসেন্ড টেক্সট মেসেজ পাঠাতে ব্যর্থ হয়েছে: ${err.message}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
              event.threadID
            );
          }
        }

        global.resendMessageCache.delete(event.messageID);

      } catch (mainErr) {
        api.sendMessage(
          `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗘𝗥𝗥𝗢𝗥\n» ❌ রিসেন্ড ইভেন্টে বড় কোনো প্রবলেম হয়েছে: ${mainErr.message}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`,
          event.threadID
        );
      }
    }
  }
};
