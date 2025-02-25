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
        eliminated: {
            type: Boolean,
            required: true,
            default: false,
        },
        eliminatedBy: String,
        eliminatedAt: String,
        eliminatedIn: String
    }
});



const Player = mongoose.model("Player", playerSchema);
module.exports = { Player };