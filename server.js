const express = require("express");
const app = express();
const db = require("./db")
// Uncomment if using environment variables
// require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const port = process.env.PORT || 3000; // Fallback to port 3000 if PORT is not defined

const {jwtAuthMiddleware} = require("./middleware/jwt")

const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes")
const voteRoute = require("./routes/voteRoutes")

app.use("/user", userRoutes);
app.use("/candidate",jwtAuthMiddleware,candidateRoutes)
app.use(voteRoute)

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
