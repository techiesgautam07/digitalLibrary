const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes')
const adminRoutes = require('./routes/adminRoutes')
const { dbConnect } = require('./config/DB');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', express.static('./uploads'));
app.use('/', userRoutes);
app.use('/', adminRoutes);

dbConnect();



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});