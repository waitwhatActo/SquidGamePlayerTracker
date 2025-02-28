const { SlashCommandBuilder, EmbedBuilder, MessageFlags, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const { Game, Player } = require("../schemas.js");

module.exports = {
	name: "newgame",
	type: "slash",
	date: new SlashCommandBuilder()
		.setName("newgame")
		.setDescription("Start a new game."),
	async execute(interaction) {
		if (interaction.member.id !== "844370394781712384") return interaction.reply({ content: "You do not have permission to use this command.", flags: MessageFlags.Ephemeral });
		const game = await Game.findOne({ game: "game" });
		const players = await Player.find({ status: { attendance: true } });
		if (!game) {
			const newgame = new Game({
				startTime: Date.now(),
				startPlayerCount: players.length,
			});
			await newgame.save();
			await resetPlayerEliminationStatus();
		}
		else {
			const embed = new EmbedBuilder()
				.setTitle("Are you sure??")
				.setDescription("There is already a game in progress. \n\nAre you sure you want to restart the game?\n**__This will also reset the player elimination status, and it is IRREVERSIBLE!__**")
				.setColor(0xFF0000);
			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId("confirm")
						.setLabel("Yes")
						.setStyle(ButtonStyle.Danger)
						.setEmoji("✅"),
					new ButtonBuilder()
						.setCustomId("cancel")
						.setLabel("No")
						.setStyle(ButtonStyle.Secondary)
						.setEmoji("❌"),
				);
			const response = await interaction.reply({ embeds: [embed], components: [row], withResponse: true });

			const collectorFilter = i => i.user.id === interaction.user.id;

			try {
				const confirmation = await response.resource.message.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

				if (confirmation.customId === "confirm") {
					await Game.deleteOne({ game: "game" });
					const newgame = new Game({
						startTime: Date.now(),
						startPlayerCount: players.length,
					});
					await resetPlayerEliminationStatus();
					await newgame.save();
					await confirmation.editReply({ content: "Game restarted", components: [], flags: MessageFlags.Ephemeral });
				}
				else {
					await confirmation.editReply({ content: "Game not restarted", components: [], flags: MessageFlags.Ephemeral });
				}
			}
			catch {
				await interaction.editReply({ content: "Confirmation not received within 1 minute, cancelling", components: [], flags: MessageFlags.Ephemeral });
			}
		}
	},
};

async function resetPlayerEliminationStatus() {
	const players = await Player.find({ status: { attendance: true } });
	for (const player of players) {
		player.status.eliminated = false;
		await player.save();
	}
}