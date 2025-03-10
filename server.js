const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('./db/conn');
const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

app.use("/api/", limiter);
app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("working")
})

app.use('/finance', require('./routes/expenses'));
app.use('/user',require('./routes/users'));

module.exports = app;

if (require.main === module) {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`http://localhost:${port}`);
    });
  }