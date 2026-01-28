const { Events, EmbedBuilder } = require("discord.js");
const { Player } = require("../schemas.js");

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;
		if (!message.guild) return;
		const args = message.content.split(" ");

		switch (message.channelId) {
		    case "1344137617725329408": { // import
			    if (typeof args[2] == "string") {
			    	args[1] = args[1] + " " + args[2];
			    	args = args.slice(0, 2).concat(args.slice(3));
			}

			    if (args.length < 4 || isNaN(args[2]) || isNaN(args[3])) return message.reply("There was an error while registering the player. Please try again. \nAre you sure that the message is in the proper format? `{First Name} {Last Name} {Student Number} {Grade} [Medical Condition]`\nIf this keeps happening, please notify Acton immediately.");
			    if (isNaN(args[2]) && (args[3].length > 5 && args[3].length < 8) && (args[3] >= 50000 && args[3] <= 3000000)) {
				    await registerPlayer(`${args[0]} ${args[1]} ${args[2]}`, args[3], args[4], args.slice(5).join(" "), message);
			    }
			    else if ((args[2].length > 5 && args[2].length < 8) && (args[2] >= 50000 && args[2] <= 3000000)) {
				    await registerPlayer(`${args[0]} ${args[1]}`, args[2], args[3], args.slice(4).join(" "), message);
			    }
			    else {
				    return message.reply("There was an error while registering the player. Please try again. \nAre you sure that the message is in the proper format? `{First Name} {Last Name} {Student Number} {Grade} [Medical Condition]`\nIf this keeps happening, please notify Acton immediately.");
			    }
			    break;
		    }
		case "1344137627690860646": // registration 1
		case "1363667117735674146": // registration 2
		case "1363667154762862592": { // registration 3
			    if (args.length < 1) return message.reply("Please provide a student number.");
			    if (args[0].length < 6 || args[0].length > 8 || isNaN(args[0])) return message.reply("Please provide a valid student number.");
			    const player = await Player.findOne({ studentNumber: args[0] });
			    if (!player) return message.reply("There is no player with that student number. Please validate the student number and try again. If this keeps happening, please notify a supervisor.");
			    player.status.attendance = true;
			    await player.save();
			    const embed = new EmbedBuilder()
			    	.setTitle("Player marked Present!")
			    	.setDescription(`Please welcome ${player.name} to Hounds Game! Make sure to collect their entry fee.`)
			    	.setColor(0x00FF00)
			    	.addFields(
			    		{ name: "Name", value: player.name, inline: true },
			    		{ name: "Student Number", value: `**${player.studentNumber}**`, inline: true },
			    		{ name: "Grade", value: `${player.grade}`, inline: true },
			    		{ name: "Player Number", value: `**__${player.playerNumber}__**`, inline: true },
			    		{ name: "Medical Attention", value: player.medical.needed ? player.medical.description : "None", inline: true },
			    	);
			    message.reply({ embeds: [embed] });
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

async function registerPlayer(name, studentNumber, grade, medical, message) {
	if (await Player.findOne({ studentNumber: studentNumber })) {
		const player = await Player.findOne({ studentNumber: studentNumber });
		const embed = new EmbedBuilder()
			.setTitle("Player Already Imported!")
			.setColor(0xFF0000)
			.addFields(
				{ name: "Name", value: player.name, inline: true },
				{ name: "Student Number", value: `${player.studentNumber}`, inline: true },
				{ name: "Grade", value: `${player.grade}`, inline: true },
				{ name: "Player Number", value: `${player.playerNumber}`, inline: true },
				{ name: "Medical Attention", value: player.medical.needed ? player.medical.description : "None", inline: true },
			);
		message.reply({ embeds: [embed] });
		return;
	}

	let player;
	try {
		player = await new Player({
			name: name,
			studentNumber: studentNumber,
			grade: grade,
			medical: {
				needed: medical ? true : false,
				description: medical ? medical : "",
			},
			playerNumber: await Player.countDocuments() + 1,
		});
		await player.save();
	}
	catch (err) {
		return message.reply(`There was an error while registering the player. Please try again. \nAre you sure that the message is in the proper format? \`{First Name} {Last Name} {Student Number} {Grade} [Medical Condition]\`\nIf this keeps happening, please notify Acton immediately.\`\`\`${err}\`\`\``);
	}
	const playerSearched = await Player.findOne({ studentNumber: studentNumber });
	const embed = new EmbedBuilder()
		.setTitle("Player Imported!")
		.setColor(0x00FF00)
		.addFields(
			{ name: "Name", value: playerSearched.name, inline: true },
			{ name: "Student Number", value: `${playerSearched.studentNumber}`, inline: true },
			{ name: "Grade", value: `${playerSearched.grade}`, inline: true },
			{ name: "Player Number", value: `${playerSearched.playerNumber}`, inline: true },
			{ name: "Medical Attention", value: playerSearched.medical.needed ? playerSearched.medical.description : "None", inline: true },
		);
	message.reply({ embeds: [embed] });
}

async function eliminatePlayer(number, guard, message) {
	const player = await Player.findOne({ playerNumber: number });
	if (!player) return message.reply("There is no player with that player number. Please validate the player number and try again. If this keeps happening, please notify a supervisor.");
	else if (!player.status.attendance) return message.reply("This player has not been marked present. Please validate the player number and try again. If this keeps happening, please notify a supervisor.");
	else if (player.status.eliminated) return message.reply("❗**This player has already been eliminated from this game.**❗\nPlease pull them from the game immediately.");
	player.status.eliminated = true;
	player.status.eliminatedBy = guard;
	player.status.eliminatedAt = Date.now();
	/* switch (game.game) {
	    case "redLightGreenLight":
	    	player.status.redLightGreenLight.timeAlive = Date.now() - game.redLightGreenLight.startTime;
		    player.status.redLightGreenLight.eliminated = true;
	    	break;
	    case "dalgona":
	    	player.status.dalgona.timeSpent = Date.now() - game.dalgona.startTime;
	    	player.status.dalgona.broke = true;
	    	break;
	    case "tugOfWar":
	    	player.status.tugOfWar.lost = true;
	    	break;
	    case "mingle":
	    	player.status.mingle.timeAlive = Date.now() - game.mingle.startTime;
	    	player.status.mingle.eliminated = true;
	    	break;
	}*/
	await player.save()
		.then(() => {
			message.react("✅");
		})
		.catch((err) => {
			message.react("❌");
			message.reply({ content: `**Record not updated**\nThere was an error while eliminating the player. **Please try again.** \nIf this keeps happening, please notify Acton immediately.\`\`\`${err}\`\`\`` });
		});
}