var mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

quizSchema = new Schema({
    title: {
        type: String,
        required:true,
    },
    questions: [{
        questionText: String,
        options: [String],
        correctOptionIndex:Number,
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;