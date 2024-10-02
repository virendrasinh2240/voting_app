const express = require("express")
const router = express.Router()
const User = require("../models/user")
const {jwtAuthMiddleware,generateToken} = require("../middleware/jwt")

router.post("/signup", async (req, res) => {
    try {
        const data = req.body;

        // Check if an admin exists
        const admin = await User.findOne({ role: "admin" });

        // If an admin exists and the new user is also trying to be an admin, block the signup
        if (admin && data.role === "admin") {
            return res.status(403).json({ message: "An admin already exists" });
        }

        // Proceed to create a new user (admin or regular user)
        const newUser = new User(data);
        const response = await newUser.save();
        console.log("User data saved");

        // Generate JWT token for the new user
        const payload = {
            id: response._id
        };

        const token = generateToken(payload);
        console.log("Token generated:", token);

        res.status(200).json({
            response: response,
            token: token
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body

        const user = await User.findOne({ aadharCardNumber: aadharCardNumber })

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "invalid username or password" })
        }

        const payload = {
            id: user.id
        }
        const token = await generateToken(payload)

        res.json(token)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
})

router.get("/profile", jwtAuthMiddleware, async (req, res) => {
    try {
        const userData = req.user
        const userId = userData.id
        const user = await User.findById(userId)

        res.status(200).json({ user })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
})

router.put("/profile/password", jwtAuthMiddleware, async (req, res) => {
    try {

        const userId = req.user
        const { currentPassword, newPassword } = req.body

        const user = await User.findById(userId)

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: "invalid username or password" })
        }
        user.password = newPassword
        await user.save()

        console.log("password updated")
        res.status(200).json({ message: "password updated" })

    } catch (err) {
        console.log(err)
        req.status(500).json({ error: "internal server Error" })
    }
})

module.exports = router