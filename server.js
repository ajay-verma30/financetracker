const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('./db/conn');

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