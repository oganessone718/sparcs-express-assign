var mongoose = require("mongoose");

var OSchemaDefinition = {
    title: String,
    content: {
        type: String,
        default: "Input Content...",
    },
    itemViewCnt: {
        type: Number,
        default: 0,
    }
};
var OSchemaOptions = { timestamps: true };

var schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

var FeedModel = mongoose.model("account", schema);

module.exports = FeedModel;

