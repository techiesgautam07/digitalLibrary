const mongoose = require('mongoose');
require("dotenv").config();


const dbConnect = async (req, res) => {

    try {
        await mongoose.connect(process.env.DB_URL)

        console.log("DB connection successful")
    }
    catch (error) {
        console.error(error);
    }
}

module.exports = { dbConnect };