const fs = require("fs-extra");
const path = require("path");

// Database file location
const DATA_FILE = path.join(process.cwd(), "database", "json", "warn.json");

// Fast in-memory cache for warnings database
let dbCache = null;

// Load database into memory
function loadData() {
    if (dbCache) return dbCache;
    try {
        if (!fs.existsSync(DATA_FILE)) {
            fs.ensureFileSync(DATA_FILE);
            fs.writeJsonSync(DATA_FILE, { settings: {}, users: {} }, { spaces: 4 });
        }
        dbCache = fs.readJsonSync(DATA_FILE);
    } catch (e) {
        dbCache = { settings: {}, users: {} };
    }
    return dbCache;
}

// Debounced async write to disk for high performance
let saveTimeout = null;
function saveData() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        try {
            fs.ensureFileSync(DATA_FILE);
            fs.writeJsonSync(DATA_FILE, dbCache, { spaces: 4 });
        } catch (e) {
            console.error("Error saving warn.json:", e);
        }
    }, 1000);
}

// Editable BAD_WORDS array (Bangla & English)
const BAD_WORDS = [
    "বাল", "বালের", "চোদ", "চুদ", "চুদা", "চুদি", "চুদিনা", "চুদবি", 
    "মাগি", "মাগীর", "মাগির", "খানকি", "খানকির", "ভোদা", "ভোদাই", 
    "শুয়োর", "শুয়োরের", "হারামি", "কুত্তা", "নষ্ট", "লুচ্চা",
    "fuck", "fucking", "motherfucker", "bitch", "shit", "asshole", 
    "bastard", "cunt", "dick", "slut", "whore", "idiot"
];

// Memory tracker for spam, floods, and duplicate detection
const userMessageTracker = new Map();

module.exports = {
    config: {
        name: "warn",
        aliases: ["warnings", "warning", "warnlist", "check"],
        version: "2.5.0",
        author: "GoatBot Developer",
        countDown: 2,
        role: 0,
        shortDescription: "বাংলা অটো-মডারেশন ও ওয়ার্নিং সিস্টেম",
        longDescription: "ইউজারদের ওয়ার্নিং দেওয়া, অটো-মডারেশন (স্প্যাম, গালি, ফেসবুক/টিকটক লিংক, রিপিট মেসেজ, অতিরিক্ত মেনশন) এবং ৩/৩ ওয়ার্নিং হলে অটো-কিক ফিচার।",
        category: "group",
        guide: {
            bn: "📌 **ওয়ার্নিং কমান্ড সাহায্য নির্দেশিকা:**\n" +
                "───────────────────────────\n" +
                "• /warn @user [কারণ] - সদস্যকে ম্যানুয়ালি ওয়ার্নিং দিন\n" +
                "• /warnings [@user] - নিজের বা উল্লেখ করা সদস্যের ওয়ার্নিং দেখুন\n" +
                "• /warning [@user] - ওয়ার্নিং স্ট্যাটাস চেক করুন\n" +
                "• /warnlist [@user] - সদস্যের ওয়ার্নিং তালিকা দেখুন\n" +
                "• /check [@user] - সদস্যের ওয়ার্নিং রেকর্ড চেক করুন\n" +
                "• /unwarn @user - সদস্যের ১টি ওয়ার্নিং কমিয়ে দিন\n" +
                "• /warn on - গ্রুপে অটো-মডারেশন চালুকরণ\n" +
                "• /warn off - গ্রুপে অটো-মডারেশন বন্ধকরণ\n" +
                "───────────────────────────\n" +
                "📌 **সম্ভাব্য ম্যানুয়াল বাংলা কারণসমূহ:**\n" +
                "- গ্রুপে স্প্যাম করার কারণে\n" +
                "- অশালীন ভাষা ব্যবহারের কারণে\n" +
                "- অনুমতি ছাড়া Facebook/TikTok লিংক শেয়ার করার কারণে\n" +
                "- বারবার একই মেসেজ পাঠানোর কারণে\n" +
                "- সদস্যদের হয়রানি করার কারণে\n" +
                "- অতিরিক্ত মেনশন করার কারণে\n" +
                "- গ্রুপের নিয়ম ভঙ্গ করার কারণে\n" +
                "- আপত্তিকর ছবি বা ভিডিও শেয়ার করার কারণে\n" +
                "- গ্রুপে অশান্তি সৃষ্টি করার কারণে\n" +
                "- অ্যাডমিনের নির্দেশ অমান্য করার কারণে"
        }
    },

    onStart: async function ({ api, event, args, message, role, usersData, threadsData }) {
        const { threadID, senderID, mentions, body } = event;
        const db = loadData();

        if (!db.settings) db.settings = {};
        if (!db.users) db.users = {};
        if (db.settings[threadID] === undefined) db.settings[threadID] = true;

        const commandUsed = (body || "").trim().split(/\s+/)[0].replace(/^[/!.$]/, "").toLowerCase();
        const subCommand = args[0] ? args[0].toLowerCase() : "";

        // Check if command is /unwarn (Handled separately)
        if (commandUsed === "unwarn") {
            return this.handleUnwarn({ api, event, args, message, role, usersData, db });
        }

        // Check if command is /warnings, /warning, /warnlist, /check
        if (["warnings", "warning", "warnlist", "check"].includes(commandUsed)) {
            return this.handleCheck({ event, message, usersData, db });
        }

        // Subcommand: /warn on
        if (subCommand === "on") {
            if (role < 1) return message.reply("⚠️ শুধুমাত্র গ্রুপ অ্যাডমিন বা বট অ্যাডমিন অটো-মডারেশন চালু করতে পারবেন।");
            db.settings[threadID] = true;
            saveData();
            return message.reply("🛡️ **অটো-মডারেশন সিস্টেম সক্রিয় করা হয়েছে**\n───────────────\nএখন থেকে স্প্যাম, গালিগালাজ, লিংক, বারবার একই মেসেজ ও অতিরিক্ত মেনশন করা স্বয়ংক্রিয়ভাবে চেক করা হবে।");
        }

        // Subcommand: /warn off
        if (subCommand === "off") {
            if (role < 1) return message.reply("⚠️ শুধুমাত্র গ্রুপ অ্যাডমিন বা বট অ্যাডমিন অটো-মডারেশন বন্ধ করতে পারবেন।");
            db.settings[threadID] = false;
            saveData();
            return message.reply("⚠️ **অটো-মডারেশন সিস্টেম নিষ্ক্রিয় করা হয়েছে**\n───────────────\nএই গ্রুপের জন্য স্বয়ংক্রিয় নজরদারি বন্ধ করা হলো।");
        }

        // Subcommand: /warn unwarn @user
        if (subCommand === "unwarn") {
            return this.handleUnwarn({ api, event, args, message, role, usersData, db });
        }

        // Subcommand: /warn ings / ing / list / check / warning
        if (["ings", "ing", "list", "check", "warning"].includes(subCommand)) {
            return this.handleCheck({ event, message, usersData, db });
        }

        // Subcommand: Manual Warn -> /warn @user <reason>
        if (role < 1) return message.reply("⚠️ শুধুমাত্র গ্রুপ অ্যাডমিনরা কাউকে ম্যানুয়ালি ওয়ার্নিং দিতে পারবেন।");

        const mentionIDs = Object.keys(mentions || {});
        if (mentionIDs.length === 0) {
            return message.reply(
                "⚠️ **ওয়ার্নিং কম্যান্ড ব্যবহার পদ্ধতি:**\n───────────────\n" +
                "• /warn @user [কারণ] - সদস্যকে ওয়ার্নিং দিন\n" +
                "• /warnings / /check [@user] - ওয়ার্নিং চেক করুন\n" +
                "• /unwarn @user - ওয়ার্নিং কমিয়ে দিন\n" +
                "• /warn on | off - অটো-মডারেশন চালু/বন্ধ করুন"
            );
        }

        const targetID = mentionIDs[0];
        if (targetID === senderID) return message.reply("❌ আপনি নিজেকে ওয়ার্নিং দিতে পারবেন না।");

        // Immunity Verification (Group Admin, Bot Admin, Bot Owner)
        const isTargetImmune = await this.checkImmunity(api, threadID, targetID, threadsData);
        if (isTargetImmune) {
            return message.reply("🛡️ গ্রুপের অ্যাডমিন, বট অ্যাডমিন বা বট ওনারদের ওয়ার্নিং দেওয়া সম্ভব নয়।");
        }

        let customReason = args.join(" ").replace(mentions[targetID] || "", "").replace(args[0], "").trim();
        if (!customReason) customReason = "গ্রুপের নিয়ম ভঙ্গ করার কারণে";

        return await issueWarning(api, message, threadID, targetID, customReason, usersData, body);
    },

    onChat: async function ({ api, event, message, role, usersData, threadsData }) {
        const { threadID, senderID, body, mentions, messageID } = event;
        if (!body || senderID === api.getCurrentUserID()) return;

        const db = loadData();
        if (db.settings && db.settings[threadID] === false) return; // Disabled in thread

        // Global Bot Admin / Bot Owner Immunity via GoatBot Role system
        if (role >= 1) return;

        // Group Admin Immunity Check
        const isSenderImmune = await this.checkImmunity(api, threadID, senderID, threadsData);
        if (isSenderImmune) return;

        const now = Date.now();
        const trackerKey = `${threadID}_${senderID}`;
        if (!userMessageTracker.has(trackerKey)) {
            userMessageTracker.set(trackerKey, { timestamps: [], lastMsg: "" });
        }
        const userTrack = userMessageTracker.get(trackerKey);

        let detectedReason = null;

        // 1. Facebook & TikTok & HTTP/HTTPS Link Detection
        const linkRegex = /(https?:\/\/[^\s]+)|(facebook\.com\/[^\s]+)|(fb\.com\/[^\s]+)|(fb\.watch\/[^\s]+)|(m\.me\/[^\s]+)|(tiktok\.com\/[^\s]+)|(vm\.tiktok\.com\/[^\s]+)|(vt\.tiktok\.com\/[^\s]+)/i;
        if (linkRegex.test(body)) {
            detectedReason = "অনুমতি ছাড়া Facebook/TikTok লিংক শেয়ার করার কারণে";
        }

        // 2. Bad Words Detection (Bangla & English)
        if (!detectedReason) {
            const normalizedBody = body.toLowerCase();
            const hasBadWord = BAD_WORDS.some(word => {
                const regex = new RegExp(`(?:^|\\s|\\b)${word}(?:$|\\s|\\b)`, "i");
                return regex.test(normalizedBody) || normalizedBody.includes(word);
            });

            if (hasBadWord) {
                detectedReason = "অশালীন ভাষা ব্যবহারের কারণে";
            }
        }

        // 3. Mention Spam (5 or more mentions in one message)
        if (!detectedReason && mentions && Object.keys(mentions).length >= 5) {
            detectedReason = "অতিরিক্ত মেনশন করার কারণে";
        }

        // 4. Repeated Message Detection
        if (!detectedReason) {
            if (userTrack.lastMsg === body.trim() && body.trim().length > 3) {
                detectedReason = "বারবার একই মেসেজ পাঠানোর কারণে";
            }
            userTrack.lastMsg = body.trim();
        }

        // 5. Spam / Flood Message Detection (5 or more messages in 4 seconds)
        if (!detectedReason) {
            userTrack.timestamps.push(now);
            userTrack.timestamps = userTrack.timestamps.filter(t => now - t < 4000);
            if (userTrack.timestamps.length >= 5) {
                detectedReason = "গ্রুপে স্প্যাম করার কারণে";
                userTrack.timestamps = [];
            }
        }

        // If violation is detected
        if (detectedReason) {
            // Delete offending message if possible
            try {
                if (messageID) api.unsendMessage(messageID);
            } catch (e) {}

            await issueWarning(api, message, threadID, senderID, detectedReason, usersData, body);
        }
    },

    // Unwarn Functionality
    handleUnwarn: async function ({ api, event, args, message, role, usersData, db }) {
        const { threadID, mentions } = event;
        if (role < 1) return message.reply("⚠️ শুধুমাত্র গ্রুপ অ্যাডমিন বা বট অ্যাডমিন ওয়ার্নিং সরাতে পারবেন।");

        const targetID = Object.keys(mentions || {})[0] || args[1];
        if (!targetID) return message.reply("⚠️ অনুগ্রহ করে যাকে unwarn করতে চান তাকে মেনশন (@user) করুন।");

        const key = `${threadID}_${targetID}`;
        if (!db.users || !db.users[key] || db.users[key].count <= 0) {
            const name = await usersData.getName(targetID);
            return message.reply(`ℹ️ **${name}** এর কোনো সক্রিয় ওয়ার্নিং নেই।`);
        }

        db.users[key].count -= 1;
        if (db.users[key].reasons && db.users[key].reasons.length > 0) {
            db.users[key].reasons.pop();
        }

        if (db.users[key].count <= 0) {
            delete db.users[key];
        }
        saveData();

        const name = await usersData.getName(targetID);
        const remaining = db.users[key] ? db.users[key].count : 0;
        return message.reply(`✅ **ওয়ার্নিং কমানো হয়েছে**\n───────────────\n👤 সদস্য: **${name}**\n📊 বর্তমান ওয়ার্নিং: **${remaining}/3**`);
    },

    // Check Warning History Logic
    handleCheck: async function ({ event, message, usersData, db }) {
        const { threadID, senderID, mentions } = event;
        let targetID = Object.keys(mentions || {})[0] || senderID;
        const key = `${threadID}_${targetID}`;
        const name = await usersData.getName(targetID);
        const record = (db.users && db.users[key]) ? db.users[key] : { count: 0, reasons: [] };

        let text = `📜 **ওয়ার্নিং ইতিহাস**\n───────────────\n👤 সদস্য: **${name}**\n⚠️ বর্তমান অবস্থান: **${record.count}/3**\n`;
        if (record.reasons && record.reasons.length > 0) {
            text += `\n📌 **কারণসমূহ:**\n` + record.reasons.map((r, i) => ` ${i + 1}. ${r}`).join("\n");
        } else {
            text += `\n✨ এই সদস্যের কোনো ওয়ার্নিং রেকর্ড নেই!`;
        }
        return message.reply(text);
    },

    // Complete Immunity Verification (Group Admin, Bot Admin, Bot Owner)
    checkImmunity: async function (api, threadID, targetID, threadsData) {
        try {
            const globalConfig = global.GoatBot?.config || {};
            const adminBot = globalConfig.adminBot || [];
            const ownerID = globalConfig.ownerID;

            // Check if Bot Owner
            if (Array.isArray(ownerID) ? ownerID.includes(targetID) : ownerID === targetID) {
                return true;
            }

            // Check if Bot Admin
            if (adminBot.includes(targetID)) {
                return true;
            }

            // Check if Group Admin
            const threadInfo = await threadsData.get(threadID);
            const adminIDs = (threadInfo.adminIDs || []).map(item => item.id || item);
            return adminIDs.includes(targetID);
        } catch (e) {
            return false;
        }
    }
};

// Core Warning Handler (Ensures Strict Per-User Tracking via Unique Key)
async function issueWarning(api, message, threadID, targetID, reason, usersData, body = "N/A") {
    const db = loadData();
    if (!db.users) db.users = {};

    // Unique key per thread and per user
    const userKey = `${threadID}_${targetID}`;

    if (!db.users[userKey]) {
        db.users[userKey] = { count: 0, reasons: [] };
    }

    db.users[userKey].count += 1;
    if (!Array.isArray(db.users[userKey].reasons)) {
        db.users[userKey].reasons = [];
    }
    db.users[userKey].reasons.push(reason);

    const count = db.users[userKey].count;
    saveData();

    const name = await usersData.getName(targetID);

    if (count >= 3) {
        // Warning 3/3 notice before auto-kick
        const kickMsg = 
`╔════════════════════════════════════╗
          👑 HT FARHAN 👑
╚════════════════════════════════════╝

╔════════════════════════════════════╗
║        🚫 অটো কিক সিস্টেম 🚫
╠════════════════════════════════════╣
║ 👤 সদস্য : ${name}
║ 📌 কারণ : ${reason}
║ ⚠️ ওয়ার্নিং : 3/3
╠════════════════════════════════════╣
║ ✅ সদস্যকে স্বয়ংক্রিয়ভাবে
║ গ্রুপ থেকে সরিয়ে দেওয়া হয়েছে।
╚════════════════════════════════════╝`;

        await message.reply({
            body: kickMsg,
            mentions: [{ tag: name, id: targetID }]
        });

        // Clear warning history for this target user after auto kick
        delete db.users[userKey];
        saveData();

        // Perform auto kick
        return api.removeUserFromGroup(targetID, threadID, (err) => {
            if (err) {
                message.reply("❌ সদস্যকে গ্রুপ থেকে সরানো যায়নি।\nঅনুগ্রহ করে বটকে গ্রুপ অ্যাডমিন করুন।");
            }
        });
    } else {
        const warnMsg = 
`╔════════════════════════════════════╗
          👑 HT FARHAN 👑
╚════════════════════════════════════╝

╔════════════════════════════════════╗
║        ⚠️ গ্রুপ ওয়ার্নিং ⚠️
╠════════════════════════════════════╣
║ 👤 সদস্য : ${name}
║ 📌 কারণ : ${reason}
║ 📊 ওয়ার্নিং : ${count}/3
╠════════════════════════════════════╣
║ 🚨 ৩/৩ ওয়ার্নিং পূর্ণ হলে
║ সদস্যকে স্বয়ংক্রিয়ভাবে
║ গ্রুপ থেকে সরিয়ে দেওয়া হবে।
╚════════════════════════════════════╝`;

        return message.reply({
            body: warnMsg,
            mentions: [{ tag: name, id: targetID }]
        });
    }
}
