const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

messageSchema = new Schema({
    content: {
        type: 'String',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;