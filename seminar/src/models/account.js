var mongoose = require("mongoose");

var OSchemaDefinition = {
  success:{
    type: Boolean,
  },
  amount:{
      type: Number,
      default: 10000
  }
};

var OSchemaOptions = { timestamps: true };

var schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

var BankModel = mongoose.model("bank", schema);

module.exports = BankModel;