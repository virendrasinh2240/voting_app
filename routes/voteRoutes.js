const express = require("express")
const router = express.Router()
const Candidate = require("../models/candidate")
const User = require("../models/user")

router.get("/vote/count", async (req, res) => {
    try {
        const candidate = await Candidate.find().sort({ voteCount: "desc" })

        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        })
        return res.status(200).json({ voteRecord })

    } catch (err) {
        console.log(err)
        res.status(501).json({ message: "internal server error" })
    }
})

router.get("/list/candidates",async(req,res)=>{
    try{
        const candidates = await Candidate.find()

        res.status(200).json({candidates})

    }catch(err){
        console.log(err)
        res.status(501).json({err:"internal server error"})
    }
})



module.exports = router