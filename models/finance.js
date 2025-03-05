const mongoose = require('mongoose')
require('../db/conn')

const financeSchema = new mongoose.Schema({
    newAmount:{
        type: Number,
        default: 0
    },
    currentbal:{
        type: Number
    },
    username:{
        type: String,
        required: true
    },
    expenseType:{
        type:String,
        enum:['Food','Travel','Shopping','Entertainment', 'others','Salary','Rent'],
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    transcationType:{
        type: String,
        enum:['Credit', 'Debit'],
        required: true
    }
})

module.exports = mongoose.model("Finance", financeSchema);