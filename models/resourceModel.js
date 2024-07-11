const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: false
        },
        publisher: {
            type: String,
            required: false
        },
        filePath: {
            type: String,
            required: true,
        },
        fileFront: {
            type: String,
            required: true,
        }
    }
);

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "resources",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    }
})

const resources = mongoose.model("resources", resourceSchema);
const requests = mongoose.model("requests", requestSchema);

module.exports = { resources, requests };
