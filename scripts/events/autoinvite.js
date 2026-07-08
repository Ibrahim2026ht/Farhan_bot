const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports = {
    config: {
        name: "leave",
        eventType: ["log:unsubscribe"],
        version: "1.0.0",
        credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
        description: "Notify when someone leaves or gets kicked from the group with a random online video link"
    },

    onStart: async function ({ api, event, Users, Threads }) {
        // যদি বট নিজে লিভ নেয় বা তাকে কিক দেওয়া হয়, তবে কোড রান হবে না
        if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

        const { threadID } = event;

        // আপনার দেওয়া ক্যাটবক্স (catbox) ভিডিও লিংকগুলো এখানে যুক্ত করা হয়েছে
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

        try {
            // সময় এবং সেশন সেটআপ (বাংলাদেশ টাইমজোন)
            const time = moment.tz("Asia/Dhaka").format("DD/MM/YYYY || HH:mm:ss");
            const hours = parseInt(moment.tz("Asia/Dhaka").format("HH"));
            
            let session = "𝙉𝙞𝙜𝙝𝙩";
            if (hours >= 5 && hours < 12) session = "𝙈𝙤𝙧𝙣𝙞𝙣𝙜";
            else if (hours >= 12 && hours < 16) session = "𝘼𝙛𝙩𝙚𝙧𝙉𝙤𝙤𝙣";
            else if (hours >= 16 && hours < 19) session = "𝙀𝙫𝙚𝙣𝙞𝙣𝙜";

            // মেম্বার ও থ্রেডের ডাটা সংগ্রহ
            const threadData = global.data.threadData.get(parseInt(threadID)) || (await Threads.getData(threadID)).data || {};
            const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
            
            // নিজে লিভ নিয়েছে নাকি কিক খেয়েছে তা নির্ধারণ
            const type = (event.author == event.logMessageData.leftParticipantFbId) ? "নিজে চলে গেছে" : "তাড়িয়ে দেওয়া হয়েছে";

            // মেসেজ ডিজাইন
            let msg = "";
            if (typeof threadData.customLeave == "undefined" || threadData.customLeave == null) {
                msg = `╭═════⊹⊱✫⊰⊹═════╮ \n ⚠️ গুরুতর ঘোষণা ⚠️\n╰═════⊹⊱✫⊰⊹═════╯\n\n${session} || ${name} ভাই/বোন...\nএই মাত্র গ্রুপ থেকে নিখোঁজ হয়েছেন!\nগ্রুপবাসীদের পক্ষ থেকে গভীর উদ্বেগ ও\nচাপা কান্নার মাধ্যমে জানানো যাচ্ছে...\n\n— উনি আর নেই... মানে গ্রুপে নেই!\nকিন্তু হৃদয়ে থেকে যাবেন, এক্টিভ মেম্বার হিসেবে।\n\n⏰ তারিখ ও সময়: ${time}\n⚙️ স্ট্যাটাস: ${type}\n✍️ মন্তব্য করে জানাও: তোমার কী ফিলিংস হইছে এই বিচ্ছেদে?`;
            } else {
                msg = threadData.customLeave
                    .replace(/{name}/g, name)
                    .replace(/{type}/g, type)
                    .replace(/{session}/g, session)
                    .replace(/{time}/g, time);
            }

            // ভিডিও ডাউনলোডের জন্য টেম্পোরারি পাথ তৈরি
            const cacheFolder = path.join(__dirname, "cache");
            if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder, { recursive: true });
            
            const videoPath = path.join(cacheFolder, `leave_${event.logMessageData.leftParticipantFbId}.mp4`);
            
            // লিস্ট থেকে যেকোনো একটি ভিডিও লিংক র‍্যান্ডমলি সিলেক্ট করা
            const randomVideoUrl = videoLinks[Math.floor(Math.random() * videoLinks.length)];

            // ভিডিওটি ডাউনলোড করা হচ্ছে
            const response = await axios({
                method: 'get',
                url: randomVideoUrl,
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(videoPath);
            response.data.pipe(writer);

            writer.on('finish', async () => {
                const formPush = {
                    body: msg,
                    attachment: fs.createReadStream(videoPath)
                };
                
                // সফলভাবে মেসেজ ও ভিডিও চলে যাওয়ার পর ফাইল ডিলিট হবে যেন বটের স্টোরেজ ফুল না হয়
                await api.sendMessage(formPush, threadID, () => {
                    if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
                });
            });

            writer.on('error', async (err) => {
                console.error("Video download error:", err);
                
                await api.sendMessage({ body: msg }, threadID);
            });

        } catch (error) {
            console.error("Error in leave event:", error);
        }
    }
};
