const axios = require("axios");
const { getPrefix, getStreamFromURL } = global.utils;
const { commands } = global.GoatBot;
const fs = require("fs");
const path = require("path");

let xfont = null;
let yfont = null;
let categoryEmoji = null;

const HELP_VIDEOS = [
    "https://files.catbox.moe/4wkxxe.mp4",
    "https://files.catbox.moe/0wx30s.mp4"
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

const boldFont = (str) =>
    str.replace(/[A-Za-z0-9]/g, (c) => {
        const map = {
            A:"𝐀",B:"𝐁",C:"𝐂",D:"𝐃",E:"𝐄",F:"𝐅",G:"𝐆",H:"𝐇",I:"𝐈",J:"𝐉",K:"𝐊",L:"𝐋",M:"𝐌",N:"𝐍",O:"𝐎",P:"𝐏",Q:"𝐐",R:"𝐑",S:"𝐒",T:"𝐓",U:"𝐔",V:"𝐕",W:"𝐖",X:"𝐗",Y:"𝐘",Z:"𝐙",
            a:"𝐚",b:"𝐛",c:"𝐜",d:"𝐝",e:"𝐞",f:"𝐟",g:"𝐠",h:"𝐡",i:"𝐢",j:"𝐣",k:"𝐤",l:"𝐥",m:"𝐦",n:"𝐧",o:"𝐨",p:"𝐩",q:"𝐪",r:"𝐫",s:"𝐬",t:"𝐭",u:"𝐮",v:"𝐯",w:"𝐰",x:"𝐱",y:"𝐲",z:"𝐳",
            "0":"𝟎","1":"𝟏","2":"𝟐","3":"𝟑","4":"𝟒","5":"𝟓","6":"𝟔","7":"𝟕","8":"𝟖","9":"𝟗"
        };
        return map[c] || c;
    });

function getCategoryEmoji(cat) {
    return categoryEmoji?.[cat.toLowerCase()] || "🔱";
}

function roleText(role) {
    const roles = { 0: "All Users", 1: "Group Admins", 2: "Bot Admin" };
    return roles[role] || "Unknown";
}

function parseText(input) {
    if (!input) return "No description";
    if (typeof input === "string") return input;
    if (typeof input === "object") {
        return input.en || input.vi || Object.values(input)[0] || "No description";
    }
    return String(input);
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
        version: "3.2",
        author: "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍",
        role: 0,
        category: "info",
        shortDescription: "Show all commands with video and premium style",
        guide: "{pn} | {pn} <command> | {pn} -c <category>"
    },

    onStart: async function ({ message, args, event, role }) {
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
            if (!categories[cat]) return message.reply(`» ⚠️ Category "${cat}" not found!`);

            let msg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n`;
            msg += `───────────────\n`;
            msg += `» ${getCategoryEmoji(cat)} 𝐒𝐄𝐂𝐓𝐈𝐎𝐍: ${boldFont(cat)}\n`;
            msg += `───────────────\n\n`;
            for (const c of categories[cat].sort()) {
                msg += `» ✦ ${fontConvert(c)}\n`;
            }
            msg += `\n───────────────\n`;
            msg += `» 📊 ${boldFont("Total")}: [ ${boldFont(String(categories[cat].length))} ]\n`;
            msg += `» 👑 ${boldFont("Prefix")}: [ ${prefix} ]\n`;
            msg += `───────────────\n`;
            msg += `» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

            return message.reply({ body: msg, attachment: await getStreamFromURL(HELP_GIF) });
        }

        if (!input) {
            let msg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n`;
            msg += `───────────────\n\n`;

            for (const cat of Object.keys(categories).sort()) {
                msg += `» ◈ ${getCategoryEmoji(cat)} ━ 『 ${boldFont(cat)} 』\n`;
                for (const c of categories[cat].sort()) {
                    msg += `»   👑 ${fontConvert(c)}\n`;
                }
                msg += `───────────────\n`;
            }
            const total = Object.values(categories).reduce((a, b) => a + b.length, 0);

            msg += `» 📊 ⊱ ${boldFont("Total Commands")}: [ ${total} ]\n`;
            msg += `» 👑 ⊱ ${boldFont("Find Info")}: [ ${prefix}\n`;
            msg += `» 🔗 ⊱ ${boldFont("Facebook")}: https://www.facebook.com/share/1LDy7c49aK/\n`;
            msg += `───────────────\n`;
            msg += `» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

            return message.reply({ body: msg, attachment: await getStreamFromURL(HELP_GIF) });
        }

        const cmd = findCommand(input);
        if (!cmd) return message.reply(`» ⚠️ Command "${input}" not found!`);

        const c = cmd.config;
        const aliasText = Array.isArray(c.aliases) ? c.aliases.join(", ") : c.aliases || "None";
        let usage = "No usage";
        if (c.guide) {
            if (typeof c.guide === "string") usage = c.guide;
            else if (typeof c.guide === "object") usage = c.guide.en || Object.values(c.guide)[0] || "No usage";
            usage = usage.replace(/{pn}/g, `${prefix}${c.name}`);
        }

        const descriptionText = parseText(c.shortDescription || c.description);

        let infoMsg = `» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑\n`;
        infoMsg += `───────────────\n`;
        infoMsg += `» 👑 ${boldFont("COMMAND DETAILS")}\n`;
        infoMsg += `───────────────\n`;
        infoMsg += `» 📌 ${boldFont("Name")} ↬ ${boldFont(c.name)}\n`;
        infoMsg += `» 📂 ${boldFont("Category")} ↬ ${boldFont(parseText(c.category))}\n`;
        infoMsg += `» 🔑 ${boldFont("Aliases")} ↬ ${boldFont(aliasText)}\n`;
        infoMsg += `» 🛡️ ${boldFont("Role")} ↬ ${boldFont(roleText(c.role))}\n`;
        infoMsg += `» 📝 ${boldFont("Description")} ↬ ${descriptionText}\n`;
        infoMsg += `» 📖 ${boldFont("Usage")} ↬ ${usage}\n`;
        infoMsg += `───────────────\n`;
        infoMsg += `» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

        return message.reply({ body: infoMsg, attachment: await getStreamFromURL(HELP_GIF) });
    }
};
