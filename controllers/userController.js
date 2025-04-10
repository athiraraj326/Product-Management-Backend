const users = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// register
exports.registerController = async (req, res) => {
    const { username, email, password, userID } = req.body
    try {        
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            res.status(406).json("Already existing user... Please Login!!!")
        } else {
            const encrypted = await bcrypt.hash(password, 10)
            const newUser = new users({
                username, email, password:encrypted, userID
            })
            await newUser.save()
            res.status(200).json(newUser)            
        }
    } catch (err) {
        res.status(401).json(err)
    }
}

// login
exports.loginController = async (req, res) => {
    const { email, password } = req.body
    console.log(email, password);
    try {
        const existingUser = await users.findOne({ email })
        if (existingUser) {
            const decrypted = await bcrypt.compare(password, existingUser.password)
            console.log(decrypted);

            if (decrypted || existingUser.password) {
                // token generation
                const token = jwt.sign({ userId: existingUser._id }, process.env.JWTPASSWORD)
                res.status(200).json({
                    user: existingUser, token
                })
            } else {
                res.status(404).json("Invalid Password")
            }
        } else {
            res.status(404).json("Invalid Email")
        }
    } catch (err) {
        res.status(401).json(err)
    }
}