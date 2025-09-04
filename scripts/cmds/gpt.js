const axios = require('axios');

async function askGPT(query, uid) {
  try {
    const { data } = await axios.get('https://daikyu-api.up.railway.app/api/gpt-4o', {
      params: { query, uid }
    });
    return data.response;
  } catch (error) {
    throw error;
  }
}

async function describeImage(prompt, photoUrl) {
  try {
    const { data } = await axios.get('https://daikyu-api.up.railway.app/api/gemini-flash-vision', {
      params: { prompt, imageUrl: photoUrl }
    });
    return data.response;
  } catch (error) {
    throw error;
  }
}

async function l({ api, message, event, args }) {
  try {
    const uid = event.senderID;
    let prompt = "";

    if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
      const photoUrl = event.messageReply.attachments[0].url;
      prompt = args.join(" ").trim() || "Describe this image";
      const description = await describeImage(prompt, photoUrl);
      return message.reply(description);
    } else {
      prompt = args.join(" ").trim();
    }

    if (!prompt) {
      return message.reply("Please provide a prompt.");
    }

    const response = await askGPT(prompt, uid);
    message.reply(response, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: a.name,
        uid
      });
    });
  } catch (error) {
    console.error("Error:", error.message);
    message.reply("An error occurred while processing the request.");
  }
}

const a = {
  name: "gpt",
  aliases: ["chatgpt"],
  version: "5.1",
  author: "deepam",
  countDown: 5,
  role: 0,
  longDescription: "Chat with GPT-4o or describe images with Gemini Vision",
  category: "ai",
  guide: {
    en: "{p}gpt {prompt}"
  }
};

module.exports = {
  config: a,
  handleCommand: l,
  onStart: function ({ api, message, event, args }) {
    return l({ api, message, event, args });
  },
  onReply: function ({ api, message, event, args }) {
    return l({ api, message, event, args });
  }
};
