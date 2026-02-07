const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const { Player } = require("../schemas.js");

module.exports = {
	name: "remaining",
	description: "Shows the remaining players in the game.",
	data: new SlashCommandBuilder()
		.setName("remaining")
		.setDescription("Shows the remaining players in the game."),
	async execute(interaction) {
		const remainingPlayers = await Player.find({
			"status.attendance": true,
			"status.eliminated": false,
		}).exec();
		if (remainingPlayers.length === 0) return await interaction.reply({ content: "There are no remaining players in the game.", flags: MessageFlags.Ephemeral });
		let embedString = "";
		for (let i = 0; i < remainingPlayers.length; i++) {
			const player = remainingPlayers[i];
			embedString += `${player.info.lastName}, ${player.info.firstName} **#${player.info.playerNumber}** ${player.info.medical.needed ? "⛑️" : ""}\n`;
		}
		const embed = new EmbedBuilder()
			.setTitle(`Remaining Players (${remainingPlayers.length})`)
			.setDescription(embedString)
			.setColor(0x00FFFF)
			.setTimestamp();
		await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
	},
};