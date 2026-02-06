const { EmbedBuilder, MessageFlags } = require("discord.js");
const { Player } = require("../schemas.js");

module.exports = {
    name: "list",
    description: "Lists all players that are present in the game.",
    async execute(interaction) {
        const presentPlayers = await Player.find({
            "status.attendance": true
        }).exec();
        if (presentPlayers.length === 0) return await interaction.reply({ content: "There are no players present in the game.", flags: MessageFlags.Ephemeral });
        let embedString = ["", "", "", "", "", "", "", "", "", ""];
        for (let i = 0; i < presentPlayers.length; i++) {
            const player = presentPlayers[i];
            const playerInfo = `${player.info.lastName}, ${player.info.firstName} (**#${player.info.playerNumber}**) - ${player.status.eliminated ? `🟢 ${player.status.location}` : `🔴 ${player.status.eliminatedIn}`}\n`;
            for (let j = 0; j < embedString.length; j++) {
                if (embedString[j].length + playerInfo.length < 4000) {
                    embedString[j] += playerInfo;
                    break;
                }
            }
        }
        const embedArray = [];
        for (let i = 0; i < embedString.length; i++) {
            if (embedString[i].length > 0) {
                const embed = new EmbedBuilder()
                    .setTitle(`Present Players (Part ${i + 1})`)
                    .setDescription(embedString[i])
                    .setColor(0x00FF00)
                    .setTimestamp();
                embedArray.push(embed);
            }
        }
        await interaction.reply({ embeds: embedArray, flags: MessageFlags.Ephemeral });
    }
};