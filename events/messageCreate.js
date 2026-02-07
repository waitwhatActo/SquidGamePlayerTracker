const { Events, EmbedBuilder } = require("discord.js");
const { Player, Game, Guard } = require("../schemas.js");

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;
		if (!message.guild) return;
		const args = message.content.split(" ");

		switch (message.channelId) {
		    case "1344137617725329408": { // #import
            // import format: {First Name} {Last Name} {Student Number} {Grade} [Medical Condition]
            // import args number: 0            1               2           3           4+
                if (!isNaN(args[2])) {
                    args[1] = args[1] + " " + args[2];
                    args = args.slice(0, 2).concat(args.slice(3));
                }
			    if (args.length < 4 || Number.isNaN(Number(args[2])) || Number.isNaN(Number(args[3]))) return message.reply("There was an error while registering the player. Please try again. \nAre you sure that the message is in the proper format? `{First Name} {Last Name} {Student Number} {Grade} [Medical Condition]`\nIf this keeps happening, please notify Acton immediately.");
                if (args[2].length < 6 || args[2].length > 8 || Number(args[2]) > 3000000 || Number(args[2]) < 500000) return message.reply("Please provide a valid student number.");
                if (args[3].length < 1 || args[3].length > 2 || Number(args[3]) < 8 || Number(args[3]) > 12) return message.reply("Please provide a valid grade (8-12).");
				await registerPlayer(args[0], args[1], args[2], args[3], args.slice(4).join(" "), message);
			    break;
		    }
		    case "1344137627690860646": // registration 1
		    case "1363667117735674146": // registration 2
		    case "1363667154762862592": { // registration 3
		    	if (args.length !== 1 || !(args[0].length >= 6 && args[0].length <= 8) || isNaN(args[0])) return message.reply("Please provide a valid student number.");
		    	    await checkInPlayer(args[0], message);
		    	    break;
		    }

		    case "1343762181002493983": // elimination 1
		    case "1363666928375300176": // elimination 2
		    case "1363666944976355528": // elimination 3
		    case "1438967949972213800": // elimination 4
		    case "1438967983853539418": // elimination 5
		    case "1438968010072133815": { // elimination 6
		    	    if (args.length < 1) return message.reply("Please provide a player number, and ONLY a player number.");
		    	    if (isNaN(args[0])) return message.reply("Please provide a valid player number.");
		    	    await eliminatePlayer(args[0], message.author.id, message);
		    	    break;
		        }
	        }
	},
};

async function registerPlayer(firstName, lastName, studentNumber, grade, medical, message) {
	const playerSearched = await Player.findOne({ "info.studentNumber": studentNumber });
	if (playerSearched) {
		const embed = new EmbedBuilder()
			.setTitle("Player Already Imported!")
			.setColor(0xFF0000)
			.addFields(
				{ name: "Name", value: `${playerSearched.info.firstName} ${playerSearched.info.lastName}`, inline: true },
				{ name: "Student Number", value: `${playerSearched.info.studentNumber}`, inline: true },
				{ name: "Grade", value: `${playerSearched.info.grade}`, inline: true },
				{ name: "Player Number", value: `${playerSearched.info.playerNumber}`, inline: true },
				{ name: "Medical Attention", value: playerSearched.info.medical.needed ? playerSearched.info.medical.description : "None", inline: true },
			);
		message.reply({ embeds: [embed] });
		return;
	}

	let player;
	try {
		player = await new Player({
			info: {
				firstName: firstName,
				lastName: lastName,
				playerNumber: await Player.countDocuments() + 1,
				studentNumber: studentNumber,
				grade: grade,
				medical: {
					needed: !!medical,
					description: medical || "",
				},
			},
		});
		await player.save();
	}
	catch (err) {
		return message.reply(`There was an error while registering the player. Please try again. \nAre you sure that the message is in the proper format? \`{First Name} {Last Name} {Student Number} {Grade} [Medical Condition]\`\nIf this keeps happening, please notify Acton immediately.\`\`\`${err}\`\`\``);
	}
	const embed = new EmbedBuilder()
		.setTitle("Player Imported!")
		.setColor(0x00FF00)
		.addFields(
			{ name: "Name", value: `${player.info.firstName} ${player.info.lastName}`, inline: true },
			{ name: "Student Number", value: `${player.info.studentNumber}`, inline: true },
			{ name: "Grade", value: `${player.info.grade}`, inline: true },
			{ name: "Player Number", value: `${player.info.playerNumber}`, inline: true },
			{ name: "Medical Attention", value: player.info.medical.needed ? player.info.medical.description : "None", inline: true },
		);
	message.reply({ embeds: [embed] });
}

async function checkInPlayer(studentNumber, message) {
	const player = await Player.findOne({ "info.studentNumber": studentNumber });
	if (!player) return message.reply("⚠️ No player found with that student number.");
    if (player.status.attendance) return message.reply("⚠️ This player has already been marked present.");
	player.status.attendance = true;
	player.status.location = "Small Gym";
	await player.save();
	const embed = new EmbedBuilder()
		.setTitle("Player marked Present!")
		.setDescription(`Please welcome ${player.info.firstName} to Hounds Game! Make sure to collect their entry fee.`)
		.setColor(player.info.medical.needed ? 0x00FFFF : 0x00FF00)
		.addFields(
			{ name: "Name", value: `${player.info.firstName} ${player.info.lastName}`, inline: true },
			{ name: "Student Number", value: `**${player.info.studentNumber}**`, inline: true },
			{ name: "Grade", value: `${player.info.grade}`, inline: true },
			{ name: "Player Number", value: `**__${player.info.playerNumber}__**`, inline: true },
			{ name: "Medical Attention", value: player.info.medical.needed ? player.info.medical.description : "None", inline: true },
		);
	message.reply({ embeds: [embed] });
}

async function eliminatePlayer(number, guardDiscordId, message) {
	const player = await Player.findOne({ "info.playerNumber": number });
    const guard = await Guard.findOne({ "discordId": guardDiscordId });
	if (!player) return message.reply("There is no player with that player number. Please validate the player number and try again. If this keeps happening, please notify a supervisor.");
	else if (!player.status.attendance) return message.reply("This player has not been marked present. Please validate the player number and try again. If this keeps happening, please notify a supervisor.");
	else if (player.status.eliminated) return message.reply("❗**This player has already been eliminated from this game.**❗\nPlease pull them from the game immediately.");
	player.status.eliminated = true;
	player.status.eliminatedBy = guard;
	player.status.eliminatedAt = Date.now();
    const game = await Game.findOne({ active: true });
	switch (game.game) {
	    case "redLightGreenLight":
            player.games.redLightGreenLight.timeAlive = Date.now() - game.redLightGreenLight.startTime;
		    player.games.redLightGreenLight.eliminated = true;
	    	break;
	    case "dalgona":
	    	player.games.dalgona.timeSpent = Date.now() - game.dalgona.startTime;
	    	player.games.dalgona.broke = true;
	    	break;
	    case "tugOfWar":
	    	player.games.tugOfWar.lost = true;
	    	break;
	    case "mingle":
	    	player.games.mingle.timeAlive = Date.now() - game.mingle.startTime;
	    	player.games.mingle.eliminated = true;
	    	break;
	}
	await player.save()
		.then(() => {
			message.react("✅");
		})
		.catch((err) => {
			message.react("❌");
			message.reply({ content: `**Record not updated**\nThere was an error while eliminating the player. **Please try again.** \nIf this keeps happening, please notify Acton immediately.\`\`\`${err}\`\`\`` });
		});
}