const { users } = require('../models/userModel');
const { requests, resources } = require("../models/resourceModel")
const { createToken } = require('../utils/utilities');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {

    try {
        const { name, email, password, contact } = req.body;
        const { originalname } = req.file
        const existUser = await users.findOne({ where: { email } });
        if (existUser) {
            return res.status(409).json({ error: "User Already Registered" });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await users.create({ name, email, password: hashPassword, role: 'user', contact, profilePic: originalname });

        const token = createToken(user.email);
        return res.cookie('token', token, { httpOnly: true }).status(200).json({ message: "Signup Successfull", user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        const token = createToken(user.email, user.role);
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: "Signin Successfull", user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const sendResourceRequest = async (req, res) => {
    try {
        const { userId, resourceId } = req.body
        const user = await users.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }

        if (user.allowedResources.includes(resourceId)) {
            return res.status(409).json({ error: "You already have access to this resource" });
        }

        if (await requests.find({ resourceId, userId })) {
            return res.status(409).json({ error: "User Already Requested Resource" });
        }

        await requests.create({
            resourceId,
            userId
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getResources = async (req, res) => {
    try {
        const { email } = req.user
        const result = await resources.find();
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }
        const final = result.map(key => {
            return {
                id: key._id,
                name: key.name,
                description: key.description,
                author: key.author,
                publisher: key.publisher,
                filePath: user.allowedResources.includes(key._id) ? key.filePath : undefined,
                fileFront: key.fileFront
            }
        })
        res.json({ result: final });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getOneResource = async (req, res) => {
    try {
        const { email } = req.user
        const { id } = req.params
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }
        const resource = await resources.findById(id)
        const result = {
            id: resource._id,
            name: resource.name,
            description: resource.description,
            author: resource.author,
            publisher: resource.publisher,
            filePath: user.allowedResources.includes(resource._id) ? resource.filePath : undefined,
            fileFront: resource.fileFront
        }

        res.status(200).json({ result })
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllowedResources = async (req, res) => {
    try {
        const { email } = req.user
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }



        const allowedResources = await resources.find({ _id: { $in: user.allowedResources } });


        res.status(200).json({ result: allowedResources });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}






module.exports = { signup, signin, sendResourceRequest, getResources, getOneResource, getAllowedResources }