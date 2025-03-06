const express = require('express');
const route = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const multer = require('multer');
const path = require('path');
const Finance = require('../models/finance'); 
const { body, validationResult } = require('express-validator');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        return cb(null, true);
    } else {
        return cb(new Error('Only images are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: fileFilter
});

route.post('/register', [
    body('username').notEmpty().withMessage("Username cannot be empty").isLength({min:5}).withMessage("Username must be atleast more than 5 characters long")
    .custom(async (value) => {
        const existingUser = await User.findOne({ username: value });
                if (existingUser) {
                    throw new Error('Username already exists');
                }
                return true;
            }),
    body('password').notEmpty().withMessage("Password Cannot be empty").isLength({min:8}).withMessage("Password must be atleast 8 characters long"),
    body('confirmPassword').notEmpty().withMessage("Confirm password cannot be empty")
    .custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('Passwords do not match');
        }
        return true;
    })
],async(req,res)=>{
    const errors = validationResult(req); 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); 
    }

    try{
        const{username, password, confirmPassword} = req.body;
        if(!username || !password || !confirmPassword){
            return res.status(400).json({message:"All details are mandatory"});
        }
        else if(password !== confirmPassword){
            return res.status(400).json({message:"Passwords do not match"});
        }
        const hashPassword = bcrypt.hashSync(password, 10);
        const user = new User({
            username: username,
            password: hashPassword
        })
        await user.save();
        return res.status(201).json({message:"User Created"});
    }
    catch(e){
        return res.status(500).json({message:"Internal Server Error", error:e})
    }
})


route.post(
    '/login',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { username, password } = req.body;

            const checkUser = await User.findOne({ username });
            if (!checkUser) {
                return res.status(404).json({ message: "User not found" });
            }

            const passwordMatch = await bcrypt.compare(password, checkUser.password);

            if (passwordMatch) {
                const token = jwt.sign({ username: username }, process.env.JWT_TOKEN, { expiresIn: "1h" });
                return res.status(200).json({ message: "User logged in", token: token });
            }

            return res.status(400).json({ message: "Invalid Credentials" });
        } catch (e) {
            return res.status(500).json({ message: "Internal server error", error: e });
        }
    }
);


route.put('/profilepicture/:username', authenticateToken,upload.single('image'), async (req, res) => {
    try {
        const { username } = req.params;

        if (!username || !req.file) {
            return res.status(400).json({ message: "The username and file both are required." });
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        const updateUser = await User.findOneAndUpdate(
            { username: username },
            { profilePic: fileUrl },
            { new: true } 
        );

        if (!updateUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User profile updated successfully", user: updateUser });
    } catch (e) {
        return res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
});


route.delete('/:username', authenticateToken, async(req,res)=>{
    try{
        const {username} = req.params;
        if(!username){
            return res.status(400).json({message:"Username is required to delete the user"});
        }
        await Finance.deleteMany({username:username});
        const deleteUser = await User.findOneAndDelete({username:username});
        if(!deleteUser){
            return res.status(404).json("Username not found");
        }
        return res.status(200).json({message:"User Deleted from the database"});
    }
    catch(e){
        return res.status(500).json({message:"Internal server error", error:e});
    }
})

module.exports = route;