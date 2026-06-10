// it is data adding code for mongoose ust like Mysql query
const mongoose = require("mongoose");

const consentSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  website: String,
  email: { type: String, required: true },
  dataShared: [String],
  purpose: String,
  consentGiven: Boolean,
  date: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Consent", consentSchema);
