const mongoose = require("mongoose")
require("dotenv").config()

const mongosURL = process.env.MONGODB_URL

mongoose.connect(mongosURL)

const db = mongoose.connection

db.on("connected",()=>{
    console.log("connected to mongodb server")
})

db.on("error",(err)=>{
    console.error("mongodb connection error",err)
})