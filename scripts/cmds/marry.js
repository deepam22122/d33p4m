const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs")


module.exports = {
    config: {
        name: "marry",
        aliases: [],
        version: "1.0",
        author: "deepam",
        countDown: 5,
        role: 0,
        shortDescription: "get a wife",
        longDescription: "mention your love❗",
        category: "fun",
        guide: "{pn}"
    },



    onStart: async function ({ message, event, args }) {
        const mention = Object.keys(event.mentions);
      if(mention.length == 0) return message.reply("Please mention someone❗");
else if(mention.length == 1){
const one = event.senderID, two = mention[0];
                bal(one, two).then(ptth => { message.reply({ body: "got married 😍", attachment: fs.createReadStream(ptth) }) })
} else{
 const one = mention[1], two = mention[0];
            bal(one, two).then(ptth => { message.reply({ body: "got married 😍", attachment: fs.createReadStream(ptth) }) })
}
    }


};

async function bal(one, two) {//credit akash #_#

    let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    avone.circle()
    let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)
    avtwo.circle()
    let pth = "marryv4.png"
    let img = await jimp.read("https://i.postimg.cc/XN1TcH3L/tumblr-mm9nfpt7w-H1s490t5o1-1280.jpg")

    img.resize(1024, 684).composite(avone.resize(85, 85), 204, 160).composite(avtwo.resize(80, 80), 315, 105);//don't change the credit X-------D

    await img.writeAsync(pth)
    return pth
                                                        }
