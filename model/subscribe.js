const mongoose = require('mongoose')
const subscribeSchema =mongoose.Schema({
    emailId:String,
    createdAt:Number
})
const Subscribe = mongoose.model('Subscribe',subscribeSchema)
module.exports = Subscribe