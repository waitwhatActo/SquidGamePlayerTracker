const { EmbedBuilder, MessageFlags } = require("discord.js");
const { Player } = require("../schemas.js");

module.exports = {
    name: "eliminated",
    description: "Lists players that are present and have been marked eliminated.",
    async execute(interaction) {
        const eliminatedPlayers = await Player.find({
            "status.attendance": true,
            "status.eliminated": true,
        }).exec();
        if (eliminatedPlayers.length === 0) return await interaction.reply({ content: "There are no eliminated players in the game.", flags: MessageFlags.Ephemeral });
        let embedPages = ["", "", "", "", "", "", "", "", "", ""];
        for (let i = 0; i < eliminatedPlayers.length; i++) {
            const player = eliminatedPlayers[i];
            const playerInfo = `${player.info.lastName}, ${player.info.firstName} (**#${player.info.playerNumber}**) - Eliminated by: ${player.status.eliminatedBy.firstName} ${player.status.eliminatedBy.lastName} <@${player.status.eliminatedBy.discordId}>\n`;
            for (let j = 0; j < embedPages.length; j++) {
                if (embedPages[j].length + playerInfo.length < 4000) {
                    embedPages[j] += playerInfo;
                    break;
                }
            }

        }
        const embedArray = [];
        for (let i = 0; i < embedPages.length; i++) {
            if (embedPages[i].length > 0) {
                const embed = new EmbedBuilder()
                    .setTitle(`Eliminated Players (Part ${i + 1})`)
                    .setDescription(embedPages[i])
                    .setColor(0xFF0000)
                    .setTimestamp();
                embedArray.push(embed);
            }
        }
        await interaction.reply({ embeds: embedArray, flags: MessageFlags.Ephemeral });
    }
};

