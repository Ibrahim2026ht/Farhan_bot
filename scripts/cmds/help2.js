const axios = require("axios");
const { getPrefix, getStreamFromURL } = global.utils;
const { commands } = global.GoatBot;
const fs = require("fs");
const path = require("path");

let xfont = null;
let yfont = null;
let categoryEmoji = null;

const HELP_VIDEOS = [
  "https://files.catbox.moe/0wx30s.mp4",
  "https://files.catbox.moe/rjdbb9.mp4"
];

const videoCountFile = path.join(__dirname, "help_video_count.json");

function getNextHelpVideo() {
  let index = 0;
  try {
    if (fs.existsSync(videoCountFile)) {
      const data = JSON.parse(fs.readFileSync(videoCountFile, "utf8"));
      index = data.index || 0;
    }
  } catch (e) {
    console.log("Video count read error:", e.message);
  }
  const selectedVideo = HELP_VIDEOS[index];
  const nextIndex = (index + 1) % HELP_VIDEOS.length;
  try {
    fs.writeFileSync(videoCountFile, JSON.stringify({ index: nextIndex }));
  } catch (e) {
    console.log("Video count write error:", e.message);
  }
  return selectedVideo;
}

const AUTHOR_NAME = "FARHAN-KHAN";
const FILE_PATH = __filename;

function checkAuthorLock() {
  try {
    const fileData = fs.readFileSync(FILE_PATH, "utf-8");
    if (!fileData.includes(`author: "${AUTHOR_NAME}"`)) {
      console.log("❌ AUTHOR CHANGED! FILE LOCKED.");
      return false;
    }
    return true;
  } catch (e) {
    console.log("❌ ERROR CHECKING AUTHOR LOCK");
    return false;
  }
}

async function loadResources() {
  try {
    const [x, y, c] = await Promise.all([
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/xfont.json"),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/yfont.json"),
      axios.get("https://raw.githubusercontent.com/Saim-x69x/sakura/main/category.json")
    ]);
    xfont = x.data;
    yfont = y.data;
    categoryEmoji = c.data;
  } catch (e) {
    console.error("[HELP] Resource load failed", e);
    xfont = {};
    yfont = {};
    categoryEmoji = {};
  }
}

function fontConvert(text, type = "command") {
  const map = type === "category" ? xfont : yfont;
  if (!map) return text;
  return text.split("").map(c => map[c] || c).join("");
}

// Style 2 Font: Old English/Serif Type
const fancyFont = (str) =>
  str.replace(/[A-Za-z0-9]/g, (c) => {
    const map = {
      A:"𝔄",B:"𝔅",C:"𝔆",D:"𝔇",E:"𝔈",F:"𝔉",G:"𝔊",H:"ℌ",I:"ℑ",J:"𝔍",K:"𝔎",L:"𝔏",M:"𝔐",N:"𝔑",O:"𝔒",P:"𝔓",Q:"𝔔",R:"ℜ",S:"𝔖",T:"𝔗",U:"𝔘",V:"𝔙",W:"𝔚",X:"𝔛",Y:"𝔜",Z:"ℨ",
      a:"𝔞",b:"𝔟",c:"𝔠",d:"𝔡",e:"𝔢",f:"𝔣",g:"𝔤",h:"𝔥",i:"𝔦",j:"𝔧",k:"𝔨",l:"𝔩",m:"𝔪",n:"𝔫",o:"𝔬",p:"𝔭",q:"𝔮",r:"𝔯",s:"𝔰",t:"𝔱",u:"𝔲",v:"𝔳",w:"𝔴",x:"𝔵",y:"𝔶",z:"𝔷",
      "0":"0","1":"1","2":"2","3":"3","4":"4","5":"5","6":"6","7":"7","8":"8","9":"9"
    };
    return map[c] || c;
  });

function getCategoryEmoji(cat) {
  return categoryEmoji?.[cat.toLowerCase()] || "🗂️";
}

function roleText(role) {
  const roles = { 0: "All Users", 1: "Group Admins", 2: "Bot Admin" };
  return roles[role] || "Unknown";
}

function findCommand(name) {
  name = name.toLowerCase();
  for (const [, cmd] of commands) {
    const a = cmd.config?.aliases;
    if (cmd.config?.name === name) return cmd;
    if (Array.isArray(a) && a.includes(name)) return cmd;
    if (typeof a === "string" && a === name) return cmd;
  }
  return null;
}

module.exports = {
  config: {
    name: "help2",
    aliases: ["menu"],
    version: "2.1",
    author: "FARHAN-KHAN",
    role: 0,
    category: "info",
    shortDescription: "Show all commands",
    guide: "{pn} | {pn} <command> | {pn} -c <category>"
  },

  onStart: async function ({ message, args, event, role }) {
    if (!checkAuthorLock()) return message.reply("❌ FILE LOCKED! DON'T CHANGE AUTHOR.");
    if (!xfont || !yfont || !categoryEmoji) await loadResources();

    const prefix = getPrefix(event.threadID);
    const input = args.join(" ").trim();
    const HELP_GIF = getNextHelpVideo();

    const categories = {};
    for (const [name, cmd] of commands) {
      if (!cmd?.config || cmd.config.role > role) continue;
      const cat = (cmd.config.category || "UNCATEGORIZED").toUpperCase();
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(name);
    }

    if (args[0] === "-c" && args[1]) {
      const cat = args[1].toUpperCase();
      if (!categories[cat]) return message.reply(`❌ Category "${cat}" not found`);

      let msg = `✧═════•❁❀❁•═════✧\n`;
      msg += `  ${getCategoryEmoji(cat)} 𝔖𝔢𝔠𝔱𝔦𝔬𝔫: ${fontConvert(cat, "category")}\n`;
      msg += `✧═════•❁❀❁•═════✧\n`;
      for (const c of categories[cat].sort()) msg += `  ✦ ${fontConvert(c)}\n`;
      msg += `✧═════•❁❀❁•═════✧\n`;
      msg += ` ⊱ ${fancyFont("Total")}: ${fancyFont(String(categories[cat].length))} | ${fancyFont("Prefix")}: ${prefix}`;

      return message.reply({ body: msg, attachment: await getStreamFromURL(HELP_GIF) });
    }

    if (!input) {
      let msg = ` 👑 𝐒𝐈𝐘𝐀𝐌 𝐇𝐄𝐋𝐏 𝐋𝐈𝐒𝐓 👑 \n\n`;
      for (const cat of Object.keys(categories).sort()) {
        msg += ` ✥『 ${getCategoryEmoji(cat)} ${fontConvert(cat, "category")} 』✥\n`;
        for (const c of categories[cat].sort()) msg += ` ╰┈➤ ${fontConvert(c)}\n`;
        msg += ` ══════════════\n`;
      }
      const total = Object.values(categories).reduce((a, b) => a + b.length, 0);

      msg += `\n 🌟 ⊱ ${fancyFont("Total Commands")}: [ ${total} ]\n`;
      msg += ` 🔱 ⊱ ${fancyFont("Find Info")}: [ ${prefix}${fancyFont("help <cmd>")} ]\n`;
      msg += ` 🔗 ⊱ ${fancyFont("Facebook")}: https://www.facebook.com/share/1LDy7c49aK/\n`;
      msg += `👑══════════════👑\n`;
      msg += ` 🐲 ‿𝐍𝐈𝐉𝐇𝐔𝐌-𝗕𝗢𝗧 🐲`;

      return message.reply({ body: msg, attachment: await getStreamFromURL(HELP_GIF) });
    }

    const cmd = findCommand(input);
    if (!cmd) return message.reply(`❌ Command "${input}" not found`);

    const c = cmd.config;
    const aliasText = Array.isArray(c.aliases) ? c.aliases.join(", ") : c.aliases || "None";
    let usage = "No usage";
    if (c.guide) {
      if (typeof c.guide === "string") usage = c.guide;
      else if (typeof c.guide === "object") usage = c.guide.en || Object.values(c.guide)[0] || "No usage";
      usage = usage.replace(/{pn}/g, `${prefix}${c.name}`);
    }

    const infoMsg = `
 📜 ═══${fancyFont("INFO SYSTEM")} ══ 📜
 🔔 ${fancyFont("Cmd Name")} ↬ ${fancyFont(c.name)}
 📂 ${fancyFont("Category")} ↬ ${fancyFont(c.category || "UNCATEGORIZED")}
 🔑 ${fancyFont("Aliases")} ↬ ${fancyFont(aliasText)}
 👥 ${fancyFont("Role")} ↬ ${fancyFont(roleText(c.role))}
 📝 ${fancyFont("About")} ↬ ${fancyFont(c.shortDescription || "No description")}
 📖 ${fancyFont("Guide")} ↬ ${usage}
 📜 ══════════════════ 📜`;

    return message.reply({ body: infoMsg, attachment: await getStreamFromURL(HELP_GIF) });
  }
};
