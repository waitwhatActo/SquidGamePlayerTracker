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


const Player = mongoose.model("Player", playerSchema);
module.exports = { Player };