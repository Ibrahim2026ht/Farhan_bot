module.exports.config = {
  name: "alluser",
  version: "1.0.7",
  permission: 0,
  prefix: false,
  credits: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
  description: "Get all uid and names in Group.",
  category: "without prefix",
  cooldowns: 2
};

module.exports.onStart = async function ({ api, event, Users }) {
  const ep = event.participantIDs || [];

  let header =
    "━━━━━━━━━━━━━━━━\n" +
    "👥 ALL GROUP USERS\n" +
    "━━━━━━━━━━━━━━━━\n\n" +
    `📊 Total Members: ${ep.length}\n\n`;

  let footer =
    "\n━━━━━━━━━━━━━━━━\n" +
    "👑 BOT OWNER\n" +
    "𝆠፝𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍\n" +
    "━━━━━━━━━━━━━━━━";

  let chunks = [];
  let msg = header;

  let count = 0;

  for (let i = 0; i < ep.length; i++) {
    const uid = ep[i];
    count++;

    let name = "Unknown";

    try {
      if (Users && typeof Users.getNameUser === "function") {
        name = await Users.getNameUser(uid);
      } else {
        const info = await api.getUserInfo(uid);
        name = info?.[uid]?.name || "Unknown";
      }
    } catch (e) {
      name = "Unknown";
    }

    let line =
      `╭─❖👤 USER #${count}\n` +
      `│ ✦ Name: ${name}\n` +
      `│ 🆔 UID: ${uid}\n` +
      `│ 🔗 Link: https://facebook.com/${uid}\n` +
      `╰───────────────\n\n`;

    // যদি বেশি বড় হয়ে যায় তাহলে নতুন chunk
    if ((msg + line).length > 1800) {
      chunks.push(msg);
      msg = "";
    }

    msg += line;
  }

  msg += footer;
  chunks.push(msg);

  // একে একে সব মেসেজ পাঠাবে
  for (let i = 0; i < chunks.length; i++) {
    await api.sendMessage(chunks[i], event.threadID);
  }
};

module.exports.run = module.exports.onStart;
