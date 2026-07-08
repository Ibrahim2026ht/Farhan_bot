const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

const videoLinks = [
    "https://files.catbox.moe/35fr7l.mp4",
    "https://files.catbox.moe/k6nbwh.mp4",
    "https://files.catbox.moe/lwbpjm.mp4",
    "https://files.catbox.moe/c1ocuq.mp4",
    "https://files.catbox.moe/9pqhkn.mp4",
    "https://files.catbox.moe/fgrsla.mp4",
    "https://files.catbox.moe/x0704i.mp4",
    "https://files.catbox.moe/40tdpp.mp4",
    "https://files.catbox.moe/h03zkw.mp4"
];

// ভিডিও ডাউনলোডার হেল্পার ফাংশন
async function downloadVideo(url, outputPath) {
    const response = await axios({ method: 'get', url, responseType: 'stream' });
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

module.exports = {
    config: {
        name: "leave",
        version: "2.0.0",
        author: "GoatBot Conversion",
        category: "events"
    },

    // 🟢 ১. বট চালু হওয়ার সাথে সাথে কনসোল/লগে মেসেজ ও ভিডিওর স্টেটাস টেস্ট করা
    onLoad: async function ({ api }) {
        console.log("====================================");
        console.log("⚙️ [LEAVE EVENT]: NIJHUM CHATBOT - LEAVE FILE LOADED SUCCESSFULLY!");
        console.log("⚡️ ফ্রেমওয়ার্ক: GoatBot সামঞ্জস্যপূর্ণ");
        
        // বট ওনারকে বা সিস্টেম টেস্টের জন্য র‍্যান্ডমলি একটি ভিডিও চেক করা হচ্ছে
        const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
        console.log(`🎥 টেস্ট অনলাইন ভিডিও লিংক: ${randomVideo}`);
        console.log("====================================");
    },

    // 🔴 ২. কেউ লিভ নিলে বা কিক দিলে এই ইভেন্টটি নিখুঁতভাবে কাজ করবে
    onEvent: async function ({ api, event, threadsData, usersData }) {
        if (event.logMessageType !== "log:unsubscribe") return;

        const { threadID, logMessageData, author } = event;
        const leftID = logMessageData.leftParticipantFbId;

        // যদি বট নিজে লিভ নেয় বা তাকে তাড়িয়ে দেওয়া হয়, তবে রেসপন্স করবে না
        if (leftID == api.getCurrentUserID()) return;

        try {
            // সময় এবং সেশন সেটআপ (বাংলাদেশ টাইমজোন)
            const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
            const hours = parseInt(moment.tz("Asia/Dhaka").format("HH"));

            let session = "𝙉𝙞𝙜𝙝𝙩";
            if (hours >= 5 && hours < 12) session = "𝙈𝙤𝙧𝙣𝙞𝙣𝙜";
            else if (hours >= 12 && hours < 16) session = "𝘼𝙛𝙩𝙚𝙧𝙉𝙤𝙤𝙣";
            else if (hours >= 16 && hours < 19) session = "𝙀𝙫𝙚𝙣𝙞𝙣𝙜";

            // রিয়েল-টাইম ইউজার নাম সংগ্রহ (GoatBot ডাটাবেস হ্যান্ডলার অনুযায়ী)
            let name = "User";
            try {
                name = await usersData.getNameUser(leftID);
            } catch (e) {
                const userInfo = await api.getUserInfo(leftID);
                name = userInfo[leftID]?.name || "User";
            }

            // নিজে লিভ নিয়েছে নাকি কিক খেয়েছে তা নির্ধারণ
            const type = (author == leftID) ? "নিজে চলে গেছে" : "তাড়িয়ে দেওয়া হয়েছে";

            // মেসেজ লেআউট ডিজাইন
            let msg = `╭═════⊹⊱✫⊰⊹═════╮ \n ⚠️ গুরুতর ঘোষণা ⚠️\n╰═════⊹⊱✫⊰⊹═════╯\n\n${session} || ${name} ভাই/বোন...\nএই মাত্র গ্রুপ থেকে নিখোঁজ হয়েছেন!\nগ্রুপবাসীদের পক্ষ থেকে গভীর উদ্বেগ ও\nচাপা কান্নার মাধ্যমে জানানো যাচ্ছে...\n\n— উনি আর নেই... মানে গ্রুপে নেই!\nকিন্তু হৃদয়ে থেকে যাবেন, এক্টিভ মেম্বার হিসেবে।\n\n⏰ তারিখ ও সময়: ${time}\n⚙️ স্ট্যাটাস: ${type}\n✍️ মন্তব্য করে জানাও: তোমার কী ফিলিংস হইছে এই বিচ্ছেদে?`;

            // GoatBot কাস্টম লিভ মেসেজ চেক (যদি গ্রুপে সেভ করা থাকে)
            if (threadsData) {
                const threadData = await threadsData.get(threadID);
                if (threadData?.data?.customLeave) {
                    msg = threadData.data.customLeave
                        .replace(/{name}/g, name)
                        .replace(/{type}/g, type)
                        .replace(/{session}/g, session)
                        .replace(/{time}/g, time);
                }
            }

            // ভিডিও ডাউনলোডের জন্য ক্যাশ পাথ নির্ধারণ
            const cacheFolder = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder, { recursive: true });
            const videoPath = path.join(cacheFolder, `leave_${leftID}.mp4`);

            // র‍্যান্ডম অনলাইন ক্যাটবক্স ভিডিও সিলেক্ট ও ডাউনলোড
            const randomVideoUrl = videoLinks[Math.floor(Math.random() * videoLinks.length)];
            
            await downloadVideo(randomVideoUrl, videoPath);

            const formPush = {
                body: msg,
                attachment: fs.createReadStream(videoPath)
            };

            // মেসেজ ও ভিডিও সফলভাবে পাঠিয়ে ফাইল ডিলিট করার লজিক
            await api.sendMessage(formPush, threadID, (err) => {
                if (!err && fs.existsSync(videoPath)) {
                    fs.unlinkSync(videoPath);
                }
            });

        } catch (error) {
            console.error("Error in leave event execution:", error);
        }
    }
};
