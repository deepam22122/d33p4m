const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "1.7",
    author: "MahMUD",
    countDown: 10,
    role: 0,
    category: "game",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, event, usersData, args }) {
    try {
      const input = args.join("").toLowerCase() || "bn";
      const category = input === "en" || input === "english" ? "english" : "bangla";

      const apiUrl = await mahmud();
      const res = await axios.get(`${apiUrl}/api/quiz?category=${category}`);
      const quiz = res.data;

      if (!quiz) {
        return api.sendMessage("❌ No quiz available for this category.", event.threadID, event.messageID);
      }

      const { question, correctAnswer, options } = quiz;
      const { a, b, c, d } = options;
      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ 𝗔) ${a}\n├‣ 𝗕) ${b}\n├‣ 𝗖) ${c}\n├‣ 𝗗) ${d}\n╰──────────────────‣\n𝐑𝐞𝐩𝐥𝐲 𝐰𝐢𝐭𝐡 𝐲𝐨𝐮𝐫 𝐚𝐧𝐬𝐰𝐞𝐫.`,
      };

      api.sendMessage(quizMsg, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          type: "reply",
          commandName: this.config.name,
          author: event.senderID,
          messageID: info.messageID,
          correctAnswer
        });

        setTimeout(() => {
          api.unsendMessage(info.messageID);
        }, 40000);
      }, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("❌ Failed to fetch quiz. Please try again later.", event.threadID, event.messageID);
    }
  },

  onReply: async function ({ event, api, Reply, usersData }) {
    const { correctAnswer, author } = Reply;
    if (event.senderID !== author) return api.sendMessage("This is not your question.", event.threadID, event.messageID);

    await api.unsendMessage(Reply.messageID);
    const userReply = event.body.trim().toLowerCase();

    if (userReply === correctAnswer.toLowerCase()) {
      const rewardCoins = 500;
      const rewardExp = 121;
      const userData = await usersData.get(author);
      await usersData.set(author, {
        money: userData.money + rewardCoins,
        exp: userData.exp + rewardExp,
        data: userData.data
      });
      api.sendMessage(`✅ | Correct answer\nYou earned ${rewardCoins} coins & ${rewardExp} exp.`, event.threadID, event.messageID);
    } else {
      api.sendMessage(`❌ | Wrong answer\nThe correct answer was: ${correctAnswer}`, event.threadID, event.messageID);
    }
  }
};
