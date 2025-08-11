module.exports = {
  config: {
    name: ".",
    aliases: [],
    version: "2.0",
    author: "deepam",
    role: 1, 
    shortDescription: "Edit bot messages",
    longDescription: "Reply to a bot message and use this command to edit its content.",
    category: "message",
    guide: "(must reply to bot's message)"
  },

  onStart: async function ({ api, event, args }) {
    const { messageReply, threadID, messageID, senderID } = event;
    const newContent = args.join(" ");

    if (!messageReply || !messageReply.messageID) {
      return api.sendMessage("❌ | You must reply to a bot message to edit it.", threadID, messageID);
    }

    if (!newContent) {
      return api.sendMessage("❌ | Please provide new content for the message.", threadID, messageID);
    }

    try {
      // Only allow editing messages sent by the bot
      const botID = api.getCurrentUserID();
      if (messageReply.senderID !== botID) {
        return api.sendMessage("❌ | You can only edit messages sent by the bot.", threadID, messageID);
      }

      await api.editMessage(newContent, messageReply.messageID, threadID);
      api.setMessageReaction("", messageID, () => {}, true);
    } catch (error) {
      console.error("Edit Error:", error);
      api.sendMessage("❌ | Failed to edit the message.", threadID, messageID);
    }
  }
};
