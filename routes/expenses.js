const express = require('express'); 
const Finance = require('../models/finance'); 
const route = express.Router(); 
const mongoose = require('mongoose');
const authenticateToken = require('../authentication/authenticateToken');
const { body, validationResult } = require('express-validator');

route.get('/myfinances', authenticateToken, async (req, res) => {
    try {
        const {username} = req.body;
        if(!username){
            return res.status(400).json({message:"No user Provided"});
        }
        const findUser = await Finance.find({username});
        const lastBalance = await Finance.findOne({username}).sort({createdAt: -1}).select("currentbal");
        console.log(lastBalance);
        return res.status(200).json({user: findUser, lastBalance: lastBalance});
    } catch (e) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});


route.post('/credit', authenticateToken,[
    body('amount').notEmpty().withMessage("Amount cannot be empty"),
    body('username').notEmpty().withMessage("Username cannot be empty"),
    body('expenseType').notEmpty().withMessage("Expense Type cannot be empty")
],async (req, res) => {
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    try {
        const { amount, username, expenseType} = req.body;
        const transcationType = "Credit"
        let lastBalance;
        lastBalance = await Finance.findOne({ username }).sort({ createdAt: -1 }).select("currentbal");
        let previousBalance = lastBalance && lastBalance.currentbal !== undefined ? parseFloat(lastBalance.currentbal) : 0;
        let currentBalance;
        if(previousBalance === 0){
            currentBalance = amount;
        }
        currentBalance = previousBalance + amount;

        const finance = new Finance({
            newAmount: amount,
            username: username,
            currentbal: currentBalance,
            transcationType: transcationType,
            expenseType: expenseType
        })

        await finance.save();
        return res.status(201).json({message:"Saved transaction", body:finance});

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal Server Error", error:e });
    }
});

route.post('/debit', authenticateToken,[
    body('amount').notEmpty().withMessage("Amount Cannot be Empty"),
    body('username').notEmpty().withMessage("Username Cannot be Empty"),
    body('expenseType').notEmpty().withMessage("Expense Type Cannot be Empty")
],async(req,res)=>{
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    try{
        const {amount, username,expenseType} = req.body;
        const transcationType = "Debit";
        lastBalance = await Finance.findOne({ username }).sort({ createdAt: -1 }).select("currentbal");
        let previousBalance = lastBalance && lastBalance.currentbal !== undefined ? parseFloat(lastBalance.currentbal) : 0;
        let currentBalance;
        if(previousBalance === 0){
            return res.status(400).json({message:"Current account balance is 0"});
        }
        else if(previousBalance <= amount){
            return res.status(400).json({message:"Current account balance is too low"});
        }
        currentBalance = previousBalance - amount;
        const finance = new Finance({
            newAmount: amount,
            username: username,
            currentbal: currentBalance,
            transcationType: transcationType,
            expenseType: expenseType
        })

        await finance.save();
        return res.status(201).json({message:"Saved transaction", body:finance});
    }
    catch(e){
        return res.status(500).json({message:"Internal server Error", error:e})
    }
})

module.exports = route;
