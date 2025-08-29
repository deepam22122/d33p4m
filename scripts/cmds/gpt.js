const axios = require('axios');

module.exports.config = {
  name: 'gpt',
  version: '1.0.0',
  hasPermission: 0,
  category: "ai",
  usePrefix: false,
  aliases: ['gpt', 'openai', 'chatgpt', 'ai'],
  description: "AI command powered by GPT-4o & Gemini Vision",
  credits: 'deepam',
  cooldowns: 0,
  dependencies: {
    "axios": ""
  }
};

// Function to handle the command
module.exports.onStart = async function({ api, event, args }) {
  const input = args.join(' ');

  // If no input, just send a blank message or small note
  if (!input) {
    return api.sendMessage(
      `Send me a question or reply with a photo.`,
      event.threadID,
      event.messageID
    );
  }

  // If message is a reply with a photo
  const isPhoto = event.type === "message_reply" && event.messageReply.attachments[0]?.type === "photo";
  if (isPhoto) {
    const photoUrl = event.messageReply.attachments[0].url;

    try {
      const { data } = await axios.get('https://daikyu-api.up.railway.app/api/gemini-flash-vision', {
        params: {
          prompt: input,
          imageUrl: photoUrl
        }
      });

      if (data && data.response) {
        return api.sendMessage(
          data.response,
          event.threadID,
          event.messageID
        );
      }
    } catch (error) {
      console.error("Error processing photo analysis:", error.message || error);
    }
    return;
  }

  // Normal text response
  try {
    const { data } = await axios.get('https://daikyu-api.up.railway.app/api/gpt-4o', {
      params: {
        query: input,
        uid: event.senderID
      }
    });

    if (data && data.response) {
      return api.sendMessage(
        data.response,
        event.threadID,
        event.messageID
      );
    }

  } catch (error) {
    console.error("Error processing request:", error.message || error);
  }
};
