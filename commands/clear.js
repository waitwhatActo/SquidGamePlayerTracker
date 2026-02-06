const { SlashCommandBuilder, MessageFlags } = require("discord.js");

module.exports = {
	name: "clear",
    description: "Clears the chat.",
	data: new SlashCommandBuilder()
		.setName("clear")
		.setDescription("Clears the chat.")
		.setDefaultMemberPermissions(4)
		.addIntegerOption(option =>
			option.setName("amount")
				.setDescription("The amount of messages to clear.")
				.setRequired(true)),
	async execute(interaction) {
		let amount = interaction.options.getInteger("amount");
		if (amount > 100) amount = 99;
		else if (amount < 1) return interaction.reply({ content: "You must delete at least one message.", ephemeral: true });
		await interaction.channel.bulkDelete(amount, true)
			.then(messages => interaction.reply({ content: `Deleted ${messages.size} messages.`, ephemeral: true }))
			.catch(error => {
				console.error(error);
				interaction.reply({ content: "There was an error while trying to delete messages in this channel.", flags: MessageFlags.Ephemeral });
			});
	},
};