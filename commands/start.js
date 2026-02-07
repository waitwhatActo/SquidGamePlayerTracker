const { EmbedBuilder, MessageFlags } = require("discord.js");
const { Player, Game } = require("../schemas.js");

module.exports = {
    name: "start",
    description: "Starts the game. This will allow players to be marked as present and eliminated.",
    async execute(interaction) {
        if (interaction.member.id !== "844370394781712384") return await interaction.reply({ content: "You do not have permission to start the game.", flags: MessageFlags.Ephemeral });
        const game = await Game.findOne({ active: true });
        if (game) return await interaction.reply({ content: "A game is already active. Please end the current game before starting a new one.", flags: MessageFlags.Ephemeral });
        const now = Date.now();
        const newGame = new Game({
            active: true,
            game: "redLightGreenLight",
            redLightGreenLight: {
                startTime: now,
            },
        });
        await newGame.save();
        await Player.collection.createIndex({ "info.studentNumber": 1 }, { unique: true });
        await Player.collection.createIndex({ "info.playerNumber": 1 }, { unique: true });
        const embed = new EmbedBuilder()
            .setDescription(`Game Started at <t:${Math.floor(now / 1000)}:F> with ${await Player.countDocuments({ "status.attendance": true })} players present.`)
            .setColor(0x00FF00)
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
};