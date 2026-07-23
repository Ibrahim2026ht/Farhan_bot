module.exports = {
  config: {
    name: "sk",
    aliases: ["ইসকেন", "nature", "vondo"],
    version: "1.0.5",
    author: "Mr.King",
    countDown: 5,
    role: 0,
    shortDescription: { bn: "গ্রুপ মেম্বারদের আসল চরিত্র ফাঁস করা" },
    category: "fun",
    guide: { bn: "{pn} @tag বা রিপ্লাই দিন" }
  },

  onStart: async function ({ api, event, message }) {
    const { threadID, messageID, senderID, mentions, type, messageReply } = event;

    try {
      let targetID, targetName;

      
      if (Object.keys(mentions).length > 0) {
        targetID = Object.keys(mentions)[0];
        const info = await api.getUserInfo(targetID);
        targetName = info[targetID].name;
      } 
      
      else if (type === "message_reply") {
        targetID = messageReply.senderID;
        const info = await api.getUserInfo(targetID);
        targetName = info[targetID].name;
      } 
      
      else {
        targetID = senderID;
        const info = await api.getUserInfo(targetID);
        targetName = info[targetID].name;
      }

      const characters = [
        "এই লোকটা বাইরে খুব ভাব দেখায় কিন্তু রাতে একা ঘুমাতে ভয় পায়। 👻🤣",
        "চরিত্র বিশ্লেষণ: ১০০% ভণ্ড, ০% সিরিয়াসনেস। সে একটা আস্ত চশমখোর! 🤡😂",
        "সাবধান! এই ব্যক্তি ইনবক্সে খুব মিষ্টি কথা বলে কিন্তু আসলে সে একটা বড় মাপের চিটার। 🐍🤣",
        "এর চরিত্রের সবচেয়ে বড় গুণ হলো সে অন্যের খাওয়া দেখলে অটোমেটিক ক্ষুধা অনুভব করে। 🍛🤤😂",
        "সে নিজেকে হিরো ভাবে কিন্তু আয়নার সামনে দাঁড়ালে আয়না নিজেই ফেটে যায়। 🪞💥🤣",
        "এই ব্যক্তি হলো গ্রুপের সবচেয়ে বড় কামলা, যে সবসময় সুযোগ খোঁজে কার থেকে টাকা মারা যায়। 💸🏃‍♂️😂",
        "চরিত্রের রিপোর্ট: সে দেখতে মানুষের মতো হলেও আসলে সে একটা কিউট শয়তান। 😈✨🤣",
        "এর প্রধান বৈশিষ্ট্য হলো সে পড়ার সময় ছাড়া বাকি সব সময় এক্টিভ থাকে। 📚😴😂",
        "এই লোকটা খুব শীঘ্রই প্রেম করবে বলে ভাবছে, কিন্তু কেউ তাকে পাত্তাই দিচ্ছে না। 🚫💔🤣",
        "চরিত্রের আপডেট: সে গত ৩ দিন ধরে একই মোজা পরে আছে! 🤢🧦😂",
        "এই ব্যক্তি হলো সেই পাবলিক যে নিজের গার্লফ্রেন্ডকে নাম দেয় 'কাজের বুয়া' যাতে কেউ না বুঝে। 📱🤫🤣",
        "এর চরিত্র পুরাই গোলমেলে, সে হাসলে চারপাশের মানুষ কাঁদতে শুরু করে। 🔊👹😂",
        "সে মনে করে সে সবার ক্রাশ কিন্তু আসলে সে গ্রুপের মশা মারার ব্যাট। 🦟🏸🤣",
        "চরিত্র বিশ্লেষণ: সে দিনে ৫ বার ক্রাশ খায় আর ১০ বার ছ্যাঁকা খায়। 🥀💔😂",
        "এই লোকটা ফ্রি তে বিরিয়ানি পাইলে নিজের গার্লফ্রেন্ডকেও চিনবে না। 🍖🕺🤣",
        "এর চরিত্রের কোনো মা-বাপ নাই, সে সকালে ভালো তো বিকেলে পাগল! 🤪🔥😂",
        "সে ভাবে সে অনেক চালাক কিন্তু আসলে সে একটা আস্ত বলদ। 🐂🤣",
        "সবাই যখন সিরিয়াস আলোচনা করে তখন সে পচা জোকস বলে পরিবেশ নষ্ট করে। 🤡🔇😂",
        "চরিত্রের রিপোর্ট: সে মনে মনে ভাবে সে অনেক স্মার্ট, আসলে সে একটা আস্ত আবুল! 🥴🤣",
        "এর প্রধান কাজ হলো গ্রুপে এসে হা-হা রিয়াক্ট দেওয়া আর ঝগড়া লাগানো। 🤺😂"
      ];

      const randomChar = characters[Math.floor(Math.random() * characters.length)];

      api.setMessageReaction("🔍", messageID, () => {}, true);

      return message.reply({
        body: `🔍 স্ক্যান রিপোর্ট 🔍\n\n👤 নাম: ${targetName}\n📝 রিপোর্ট: ${randomChar}\n\n😂👏`,
        mentions: [{
          tag: targetName,
          id: targetID
        }]
      });

    } catch (err) {
      console.error(err);
      return message.reply("স্ক্যানার মেশিন একটু জ্যাম হয়ে গেছে ভাই! আবার ট্রাই কর। 🛠️🤣");
    }
  }
};
