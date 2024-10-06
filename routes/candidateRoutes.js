const express = require("express")
const router = express.Router()
const Candidate = require("../models/candidate")
const jwtAuthMiddleware = require("../middleware/jwt")
const User = require("../models/user")
const { stubTrue } = require("lodash")

const checkAdminRole = async (userId) => {
    try {
        const user = await User.findById(userId)
        console.log(user)
        if (user.role === "admin") {
            return true
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({error:"internal server error"})
    }
}
router.post("/", async (req, res) => {

    try {

        if (! await checkAdminRole(req.user.id))
            return res.status(403).json({ message: "user has not admin role" })

        const data = req.body

        const newCandidate = await new Candidate(data)

        const response = await newCandidate.save()

        console.log("data saved");

        res.status(200).json({ response: response })

    } catch (err) {

        console.log(err)

        res.status(500).json({ message: "internal server error" })
    }
})
router.put("/:candidateId", async (req, res) => {
    try {

        if (!checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "user has not admin role" })
        }

        const candidateId = req.params.candidateId
        const updateCandidateData = req.body

        const response = await Candidate.findByIdAndUpdate(candidateId, updateCandidateData, {
            new: true,
            runValidators: true
        })
        if (!response) {
            return res.status(404).json({ error: "candidate not found" });
        }
        console.log("candidate data updated")
        res.status(200).json(response)

    } catch (err) {
        res.status(500).json({ err: "internal server error" })
    }
})
router.delete("/:candidateId", async (req, res) => {
    try {
        if (!checkAdminRole(req.user.id)) {
            return res.status(403).json({ meassage: "User has not admin role" })
        }

        const candidateId = req.params.candidateId

        const response = await Candidate.findByIdAndDelete(candidateId)

        if (!response) {
            throw new Error("User has not found")
        }
        console.log("candidate deleted")
        res.status(200).json({ response: response, message: "candidate deleted" })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "internal server error" })
    }
})

router.post("/vote/:candidateId", async (req, res) => {
    try {

        const userId = req.user.id
        const candidateId = req.params.candidateId

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ meassage: "user not found" })
        }
        const candidate = await Candidate.findById(candidateId)
        if (!candidate) {
            return res.status(404).json({ message: "candidate not found" })
        }
        if (user.isVoted) {
            return res.status(400).json({ message: "you have already voted" })
        }
        if (user.role == "admin") {
            res.status(403).json({ message: "admin is not allowed" })
        }

        candidate.votes.push({ user: userId })
        candidate.voteCount++
        await candidate.save()

        user.isVoted = true;
        await user.save();
        res.status(200).json({ message: "vote recorded successfully" })



    } catch (err) {
        res.status(500).json({ err: "internal server error" })
    }

})

module.exports = router