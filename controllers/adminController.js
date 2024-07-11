const { resources, requests } = require('../models/resourceModel')
const { users } = require('../models/userModel');
const { createToken } = require('../utils/utilities');

const resourceUpload = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized Access" });
        }
        const {
            name,
            description,
            author,
            publisher
        } = req.body;
        if (!req.files) {
            return res.status(400).json({ error: "Please upload a file" });
        }
        const resource = await resources.create({
            name,
            description,
            author,
            publisher,
            filePath: req.files.resourceFile[0].originalname,
            fileFront: req.files.resourceFrontImage[0].originalname
        });
        res.status(201).json({ message: "Resource uploaded successfully", resource });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const signup = async (req, res) => {

    try {
        const { name, email, password, contact } = req.body;
        const existUser = await users.findOne({ where: { email } });
        if (existUser) {
            return res.status(409).json({ error: "User Already Registered" });
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await users.create({ name, email, password: hashPassword, role: 'admin', contact });

        const token = createToken(user.email);

        res.cookie('token', token, { httpOnly: true });
        res.json({ message: "Signup Successfull", user, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const adminApprove = async (req, res) => {
    try {
        const { reqId } = req.params
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized Access" });
        }
        const request = await requests.findById(reqId);

        await users.updateOne(request.userId, {
            allowedResources: [...request.allowedResources, request.resourceId]
        })
        await request.updateOne({
            status: 'approved'
        })
        if (!request) {
            return res.status(404).json({ error: "Request Not Found" });
        }
        request.save()
        res.json({ message: "Request Approved Successfully", result: request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllRequest = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized Access" });
        }
        const requests = await requests.find({});
        res.json({ requests });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getOneRequest = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Unauthorized Access" });
        }
        const { reqId } = req.params
        const request = await requests.findById(reqId);
        if (!request) {
            return res.status(404).json({ error: "Request Not Found" });
        }
        res.json({ request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const getOneUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await users.findById({ userId: id });
        if (!user) {
            return res.status(404).json({ error: "User Not Found" });
        }
        res.status(200).json({ result: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const getAllUser = async (req, res) => {
    try {
        const users = await users.find({});
        res.status(200).json({ result: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { resourceUpload, signup, adminApprove, getAllRequest, getOneRequest, getOneUser, getAllUser }