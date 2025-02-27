const { Events } = require("discord.js");
const mongoose = require("mongoose");
const { dbtoken } = require("../config.json");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(bot) {
		await mongoose.connect(dbtoken, {})
			.then(() => {
				console.log("Database is now connected");
			}).catch((err) => {
				console.log(err);
				console.log("Failed to connect to database. Exiting...");
				process.exit();
			});

		console.log("Bot is ready");
	},
};