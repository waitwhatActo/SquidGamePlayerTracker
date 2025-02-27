const mongoose = require("mongoose");
const { Schema } = mongoose;

const playerSchema = new Schema({
	name: String,
	playerNumber: {
		type: Number,
		required: true,
	},
	studentNumber: {
		type: Number,
		required: true,
	},
	grade: String,
	medical: {
		needed: {
			type: Boolean,
			required: true,
			default: false,
		},
		description: String,
	},
	status: {
		attendance: {
			type: Boolean,
			required: true,
			default: false,
		},
		redLightGreenLight: {
			timeAlive: Number,
			passes: {
				type: Number,
				required: true,
				default: 0,
			},
			eliminated: {
				type: Boolean,
				required: true,
				default: false,
			},
		},
		dalgona: {
			shape: String,
			timeSpent: Number,
			broke: {
				type: Boolean,
				required: true,
				default: false,
			},
		},
		tugOfWar: {
			team: Number,
			lost: {
				type: Boolean,
				required: true,
				default: false,
			},
		},
		mingle: {
			timeAlive: Number,
			eliminated: {
				type: Boolean,
				required: true,
				default: false,
			},
		},
		eliminated: {
			type: Boolean,
			required: true,
			default: false,
		},
		eliminatedBy: String,
		eliminatedAt: Number,
		eliminatedIn: String,
	},
});

const gameSchema = new Schema({
	game: String,
	redLightGreenLight: {
		active: {
			type: Boolean,
			default: false,
			required: true,
		},
		startTime: Number,
		endTime: Number,
		startPlayerCount: Number,
		eliminated: Number,
		passed: Number,
	},
	dalgona: {
		active: {
			type: Boolean,
			default: false,
			required: true,
		},
		startTime: Number,
		endTime: Number,
		startPlayerCount: Number,
		eliminated: Number,
		passed: Number,
	},
	tugOfWar: {
		active: {
			type: Boolean,
			default: false,
			required: true,
		},
		startTime: Number,
		endTime: Number,
		startPlayerCount: Number,
		eliminated: Number,
		passed: Number,
		team1: Array,
		team2: Array,
	},
	mingle: {
		active: {
			type: Boolean,
			default: false,
			required: true,
		},
		startTime: Number,
		endTime: Number,
		startPlayerCount: Number,
		eliminated: Number,
		passed: Number,
	},
});


const Player = mongoose.model("Player", playerSchema);
const Game = mongoose.model("Game", gameSchema);
module.exports = { Player, Game };