const mongoose = require("mongoose");


const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const contacts = mongoose.model("contacts", contactSchema);

module.exports = { contacts };