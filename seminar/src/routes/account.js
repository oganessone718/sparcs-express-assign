const express = require('express');
const authMiddleware = require('../middleware/auth');
var BankModel = require('../models/account');

const router = express.Router();

class BankDB {
    static _inst_;
    static getInst = () => {
        if ( !BankDB._inst_ ) BankDB._inst_ = new BankDB();
        return BankDB._inst_;
    }

    #total = 10000;

    constructor() { console.log("[Bank-DB] DB Init Completed"); }


    getBalance = async () => {
        try {
            const newItem = new BankModel({success: true, amount: this.#total});
            const save = newItem.save();
            const res = await BankModel.findOne({success: true});
            return {success: res.success, amount: res.amount};
        } catch (e) {
            console.log(`[Feed-DB] Insert Error: ${ e }`);
            const newItem = new BankModel({success: false});
            const save = newItem.save();
            const res = await BankModel.findOne({success: false});
            return {success: res.success, amount: res.amount};
        }
    }

    transaction = async ( amount ) => {
        this.#total += amount;
        const update = await BankModel.updateOne({success:true},{$set:{amount:this.#total}});
        const res = await BankModel.findOne({success:true});
        console.log(res.amount);
        return {success: res.success, amount: res.amount};
    }

}

const bankDBInst = BankDB.getInst();

router.post('/getInfo', authMiddleware, async(req, res) => {
    try {
        const bank = await bankDBInst.getBalance();
        if (bank.success) return res.status(200).json({balance: bank.amount});
        else return res.status(500).json({ error: data });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.post('/transaction', authMiddleware, async(req, res) => {
    try {
        const { amount } = req.body;
        const bank = await bankDBInst.transaction( parseInt(amount) );
        console.log(bank);
        console.log(bank.amount);
        if (bank.success) res.status(200).json({ success: bank.success, balance: bank.amount, msg: "Transaction success" });
        else res.status(500).json({ error: data })
    } catch (e) {
        return res.status(500).json({ error: e });
    }
})

module.exports = router;