const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["admin", "user"],
            default: "user"
        },
        contact: {
            type: String,
            required: true,
            unique: true,
        },
        allowedResources: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "resources",
            default: []
        }
    }
);

const users = mongoose.model("users", userSchema);

module.exports = { users };
