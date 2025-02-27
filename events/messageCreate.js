const { Events, EmbedBuilder } = require("discord.js");
const { Player } = require("../schemas.js");

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
		if (message.author.bot) return;
		if (!message.guild) return;
		const args = message.content.split(" ");

		switch (message.channelId) {
		    case "1344137617725329408": { // #import
			    if (args.length < 4 || isNaN(args[2]) || isNaN(args[3])) return message.reply("There was an error while     registering the player. Please try again. \nAre you sure that the message is in the proper format? `{First  Name} {Last Name} {Student Number} {Grade} [Medical Condition]`\nIf this keeps happening, please notify  Acton immediately.");
			        await registerPlayer(`${args[0]} ${args[1]}`, args[2], args[3], args.slice(4).join(" "), message);
			    break;
		}
		    case "1344137627690860646": {// #registration
			    if (args.length < 1) return message.reply("Please provide a student number.");
			    if (args[0].length < 6 || args[0].length > 8 || isNaN(args[0])) return message.reply("Please provide a valid student number.");
			    const player = await Player.findOne({ studentNumber: args[0] });
			    if (!player) return message.reply("There is no player with that student number. Please validate the student number and try again. If this keeps happening, please notify a supervisor.");
			    player.status.attendance = true;
			    await player.save();
			    const embed = new EmbedBuilder()
			    	.setTitle("Player marked Present!")
			    	.setDescription(`Please welcome ${player.name} to Hounds Game! Make sure to collect their fee.`)
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
		    case "":
		    	break;
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

async function eliminatePlayer(number, game, time, guard) {

}

async function eliminatedPlayers() {

}

async function remainingPlayers() {

}

async function allPlayers() {

}