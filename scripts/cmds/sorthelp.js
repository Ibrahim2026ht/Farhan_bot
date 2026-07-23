module.exports = {
  config: {
    name: "sorthelp",
    version: "1.3",
    author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
    countDown: 5,
    role: 0,
    description: {
      vi: "Sắp xếp danh sách help",
      en: "Sort help list"
    },
    category: "config",
    guide: {
      en: "{pn} [name | category]"
    }
  },

  langs: {
    vi: {
      savedName: "Đã lưu cài đặt sắp xếp danh sách help theo thứ tự chữ cái",
      savedCategory: "Đã lưu cài đặt sắp xếp danh sách help theo thứ tự thể loại"
    },
    en: {
      savedName: "Saved sort help list by name",
      savedCategory: "Saved sort help list by category"
    }
  },

  onStart: async function ({ message, event, args, threadsData, getLang, prefix }) {
    const p = prefix || "!";

    if (args[0] === "name") {
      await threadsData.set(event.threadID, "name", "settings.sortHelp");
      return message.reply(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n` +
        `───────────────\n` +
        `» 📑 𝐒𝐨𝐫𝐭 𝐒𝐞𝐭𝐭𝐢𝐧𝐠: 𝐍𝐚𝐦𝐞\n` +
        `» 💬 ${getLang("savedName")}\n` +
        `───────────────\n` +
        `» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    } 
    else if (args[0] === "category") {
      await threadsData.set(event.threadID, "category", "settings.sortHelp");
      return message.reply(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n` +
        `───────────────\n` +
        `» 📑 𝐒𝐨𝐫𝐭 𝐒𝐞𝐭𝐭𝐢𝐧𝐠: 𝐂𝐚𝐭𝐞𝐠𝐨𝐫𝐲\n` +
        `» 💬 ${getLang("savedCategory")}\n` +
        `───────────────\n` +
        `» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    } 
    else {
      return message.reply(
        `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n` +
        `───────────────\n` +
        `» ❌ ভুল ব্যবহার!\n` +
        `» 📖 নিয়ম:\n` +
        `» ⚡ ${p}sorthelp 𝗻𝗮𝗺𝗲\n` +
        `» 📂 অথবা\n` +
        `» ⚡ ${p}sorthelp 𝗰𝗮𝘁𝗲𝗴𝗼𝗿𝘆\n` +
        `───────────────\n` +
        `» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`
      );
    }
  }
};
