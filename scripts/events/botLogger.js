const moment = require("moment-timezone");

const TARGET_THREAD_ID = "2060810454480041";

module.exports = {
    config: {
        name: "botLogger",
        version: "2.0",
        author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        category: "events"
    },
    onStart: async ({ event, api, threadsData, usersData }) => {
        const botID = api.getCurrentUserID();
        const date = moment().tz("Asia/Dhaka").format("DD/MM/YYYY");
        const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A");

        if (event.logMessageType === "log:subscribe") {
            const addedParticipants = event.logMessageData.addedParticipants || [];
            const isBotAdded = addedParticipants.some(p => p.userFbId === botID);

            if (isBotAdded) {
                const threadID = event.threadID;
                const authorID = event.author;
                const threadInfo = await threadsData.get(threadID) || {};
                const threadName = threadInfo.threadName || "Unknown Group";
                const adderName = await usersData.getName(authorID) || "Unknown User";

                const logMessage = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» 🚨 𝗕𝗢𝗧 𝗔𝗗𝗗𝗘𝗗 𝗟𝗢𝗚\n» 📌 𝗚𝗿𝐨𝐮𝗽: ${threadName}\n» 🆔 𝗚𝗿𝐨𝐮𝗽 𝗜𝗗: ${threadID}\n» 👤 𝗔𝗱𝗱𝗲𝗱 𝗕𝘆: ${adderName}\n» 🆔 𝗔𝗱𝗱𝗲𝗿 𝗜𝗗: ${authorID}\n» 📅 𝗗𝗮𝘁𝗲: ${date}\n» ⏰ 𝗧𝗶𝗺𝗲: ${time}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

                try {
                    await api.sendMessage(logMessage, TARGET_THREAD_ID);
                } catch (err) {
                    console.error("[BotLogger Error]:", err);
                }
            }
        }

        if (event.logMessageType === "log:unsubscribe") {
            const leftParticipantId = event.logMessageData.leftParticipantFbId;
            if (leftParticipantId === botID) {
                const threadID = event.threadID;
                const authorID = event.author;
                const threadInfo = await threadsData.get(threadID) || {};
                const threadName = threadInfo.threadName || "Unknown Group";
                const kickerName = authorID ? await usersData.getName(authorID) || "Unknown User" : "System / Self";

                const logMessage = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ⚠️ 𝗕𝗢𝗧 𝗞𝗜𝗖𝗞𝗘𝗗 / 𝗟𝗘𝗙𝗧\n» 📌 𝗚𝗿𝐨𝐮𝗽: ${threadName}\n» 🆔 𝗚𝗿𝐨𝐮𝗽 𝗜𝗗: ${threadID}\n» 👤 𝗥𝗲𝗺𝗼𝘃𝗲𝗱/𝗟𝗲𝗳𝘁: ${kickerName}\n» 📅 𝗗𝗮𝘁𝗲: ${date}\n» ⏰ 𝗧𝗶𝗺𝗲: ${time}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

                try {
                    await api.sendMessage(logMessage, TARGET_THREAD_ID);
                } catch (err) {
                    console.error("[BotLogger Error]:", err);
                }
            }
        }

        if (event.logMessageType === "log:user-nickname") {
            const participantId = event.logMessageData.participant_id;
            if (participantId === botID) {
                const threadID = event.threadID;
                const newNickname = event.logMessageData.nickname || "None";
                const authorID = event.author;
                const threadInfo = await threadsData.get(threadID) || {};
                const threadName = threadInfo.threadName || "Unknown Group";
                const changerName = await usersData.getName(authorID) || "Unknown User";

                const logMessage = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n───────────────\n» ✏️ 𝗕𝗢𝗧 𝗡𝗜𝗖𝗞𝗡𝗔𝗠𝗘 𝗖𝗛𝗔𝗡𝗚𝗘𝗗\n» 📌 𝗚𝗿𝐨𝐮𝗽: ${threadName}\n» 🆔 𝗚𝗿𝐨𝐮𝗽 𝗜𝗗: ${threadID}\n» 👤 𝗖𝗵𝗮𝗻𝗴𝗲𝗱 𝗕𝘆: ${changerName}\n» 🏷️ 𝗡𝗲𝘄 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲:\n» 🫶 ${newNickname}\n» 📅 𝗗𝗮𝘁𝗲: ${date}\n» ⏰ 𝗧𝗶𝗺𝗲: ${time}\n───────────────\n» 🧚‍♀️𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

                try {
                    await api.sendMessage(logMessage, TARGET_THREAD_ID);
                } catch (err) {
                    console.error("[BotLogger Error]:", err);
                }
            }
        }
    }
};
