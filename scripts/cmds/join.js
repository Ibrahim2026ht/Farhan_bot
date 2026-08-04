// 😼 Author: 𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 😼
// ⚠️ নাম চেঞ্জ করলে ফাইল নষ্ট হয়ে যাবে ভাই 😾

const AUTHOR_LOCK = "𝆠፝𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍";
const VISIBLE_AUTHOR = "𝆠፝𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍";

let designIndex = 0;

module.exports = {
config: {
name: "join",
version: "1.2.0",
author: VISIBLE_AUTHOR,
countDown: 5,
role: 2,
description: "Get all group list and join by serial number",
category: "System",
guide: {
en: "{pn}"
}
},

/* --- [ 🔐 FILE_CREATOR_INFORMATION ] ---

🤖 BOT NAME: SIYAM BOT
👤 OWNER: 𝆠፝𝐇𝐓-𝐅𝐀𝐑𝐇𝐀𝐍
📍 LOCATION: BANGLADESH

--------------------------------------- */

onStart: async function ({ api, event }) {

if (VISIBLE_AUTHOR !== AUTHOR_LOCK) {
return api.sendMessage("⚠️ Author Lock Changed! File Locked.", event.threadID);
}

const { threadID, messageID } = event;

try {

const allThreads = await api.getThreadList(20, null, ["INBOX"]) || [];
const groupList = allThreads.filter(t => t.isGroup && t.isSubscribed);

if (!groupList || groupList.length === 0) {
return api.sendMessage("❌ মামা, বটের কাছে কোনো সচল গ্রুপের তথ্য পাওয়া যায়নি।", threadID, messageID);
}

const designs = [

(groupList) => {
let text = `📜 𝐆𝐫𝐨𝐮𝐩 𝐋𝐢𝐬𝐭 📜
━━━━━━━━━━━━━━━━━\n`;

groupList.forEach((group, index) => {
text += `${index + 1}. ${group.name || "Unknown Group"}\n`;
});

text += `\n━━━━━━━━━━━━━━━━━
👉 যে গ্রুপে জয়েন হতে চান, সেই সিরিয়াল নাম্বারটি লিখে রিপ্লাই দিন。`;

return text;
},

(groupList) => {
let text = `╭─❖𝐕𝐈𝐏 𝐆𝐑𝐎𝐔𝐏 𝐋𝐈𝐒𝐓 ❖─╮\n\n`;

groupList.forEach((group, index) => {
text += `┃ ${index + 1} ➤ ${group.name || "Unknown Group"}\n`;
});

text += `\n╰────────❖────────╯
👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 👑
👑 ${VISIBLE_AUTHOR} 👑

🪬 যে গ্রুপে জয়েন হতে চান,
🔢 সেই নাম্বারটি রিপ্লাই দিন।
╰────────❖────────╯`;

return text;
},

(groupList) => {
let text = `┏❖💠𝐆𝐑𝐎𝐔𝐏 𝐏𝐀𝐍𝐄𝐋 💠❖┓\n`;

groupList.forEach((group, index) => {
text += ` 〔 ${index + 1} 〕${group.name || "Unknown Group"}\n`;
});

text += `\n┗━━❖━━━━━━━━━❖━━┛
👑𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 👑
👑 ${VISIBLE_AUTHOR} 👑

👉যে গ্রুপে জয়েন হতে চান, সেই নাম্বারটি রিপ্লাই দিন।
┗━━❖━━━ ━━━ ━━━❖━━┛`;

return text;
}

];

const msg = designs[designIndex](groupList);

designIndex++;
if (designIndex >= designs.length) {
designIndex = 0;
}

return api.sendMessage(msg, threadID, (err, info) => {

if (err) return console.log(err);

global.GoatBot.onReply.set(info.messageID, {
commandName: this.config.name,
messageID: info.messageID,
author: event.senderID,
groupList
});

}, messageID);

} catch (e) {

return api.sendMessage(
"❌ এরর: গ্রুপের লিস্ট পাওয়া যাচ্ছে না। কিছুক্ষণ পর ট্রাই করো।",
threadID,
messageID
);

}

},

onReply: async function ({ api, event, Reply }) {

const { threadID, messageID, body, senderID } = event;
const { author, groupList } = Reply;

if (author !== senderID) return;

const index = parseInt(body) - 1;

if (isNaN(body) || index < 0 || !groupList[index]) {
return api.sendMessage(
"❌ মামা, ভুল সিরিয়াল নাম্বার দিয়েছেন। সঠিক নাম্বার লিখে রিপ্লাই দিন।",
threadID,
messageID
);
}

const targetGroup = groupList[index];
const targetThreadID = targetGroup.threadID;

try {

await api.addUserToGroup(senderID, targetThreadID);

api.sendMessage(
`✅ সাকসেস! আপনাকে "${targetGroup.name || "ঐ গ্রুপে"}" অ্যাড করা হয়েছে।`,
threadID,
messageID
);

api.sendMessage(
`🔔 ${VISIBLE_AUTHOR} এই গ্রুপে জয়েন করেছেন।`,
targetThreadID
);

} catch (err) {

api.sendMessage(
`❌ মামা অ্যাড করা যাচ্ছে না। হয়তো আপনি অলরেডি গ্রুপে আছেন বা বট এডমিন না।\nGroup ID: ${targetThreadID}`,
threadID,
messageID
);

}

global.GoatBot.onReply.delete(Reply.messageID);

}

};
