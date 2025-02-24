const { Client, Collection, Events, IntentsBitField } = require("discord.js");
const { token } = require("./config.json");

const bot = new Client({ Intents: new IntentsBitField(32767) });

bot.on(Events.ClientReady, async function() {
  console.log("Bot is ready");
});

bot.on(Events.MessageCreate, async function(message) {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.author.equals(bot.user)) return;
    const args = message.content.toLowerCase().split(" ");
    if (args.length > 1) return;


});

async function eliminatePlayer(number, game) {

}

async function registerPlayer(number, name, grade, studentNumber, medical) {

}

bot.login(token);
