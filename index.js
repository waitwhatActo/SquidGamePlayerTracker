const { Client, Collection, Events, IntentsBitField } = require("discord.js");
const { token, dbtoken } = require("./config.json");
const fs = require("node:fs");
const path = require("node:path");
const schemas = require("./schemas.js");
const mongoose = require("mongoose");

const bot = new Client({ intents: new IntentsBitField(53608447) });
//@ts-ignore
bot.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) { //@ts-ignore
      bot.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}

bot.once(Events.ClientReady, async function() {
    console.log("Bot is ready");
    await mongoose.connect(dbtoken, {})
      .then(() => {
        console.log("Database is now connected");
      }).catch((err) => {
        console.log(err);
        console.log("Failed to connect to database. Exiting...");
        process.exit();
      });
});

bot.on(Events.MessageCreate, async function(message) {
    if (message.author.bot) return;
    if (!message.guild) return;
    if (message.author.equals(bot.user)) return;
    const args = message.content.split(" ");
    
    switch (message.channelId) {
        case "1343762181002493983":
            if (args[0].length <= 3 && args[0].length > 0 && !Number.isNaN(args[0])) {
                eliminatePlayer(args[0], "Red Light Green Light", Date.now(), message.author.id);
            }
            break;
          case "1343762570464460861":
              if (args[0].length <= 3 && args[0].length > 0 && !Number.isNaN(args[0])) {
                  eliminatePlayer(args[0], "Dalgona", Date.now(), message.author.id);
              }
              break;
          case "1343762778883620895":
              if (args[0].length <= 3 && args[0].length > 0 && !Number.isNaN(args[0])) {
                  eliminatePlayer(args[0], "Mingle", Date.now(), message.author.id);
              }
              break;
          case 
    }
});

bot.on(Events.InteractionCreate, async function(interaction) {
    if (!interaction.isChatInputCommand()) return;
    console.log(interaction);
});

async function eliminatePlayer(number, game, time, guard) {

}

async function registerPlayer(number, name, grade, studentNumber, medical) {

}

async function eliminatedPlayers() {

}

async function remainingPlayers() {

}

async function allPlayers() {

}

bot.login(token);
