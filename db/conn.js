const mongoose = require("mongoose");
require('dotenv').config();


mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ri4ol.mongodb.net/Quotes?retryWrites=true&w=majority&appName=Cluster0`);

 const dbConnection = mongoose.connection;

dbConnection.on("connected", ()=>{
    console.log("Connected")
})

dbConnection.on("Error", (err)=>{
    console.log("Mongo DB Connection Error", err)
})

dbConnection.on("Dis Connected", ()=>{
    console.log("Disconnected")
})

module.exports = { mongoose, dbConnection };