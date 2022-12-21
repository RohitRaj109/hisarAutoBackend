const mongoose = require('mongoose')
const contactUsSchema =mongoose.Schema({
    name:String,
    emailId:String,
    contactNo:Number,
    message:String,
    createdAt:Number
})
const Subscribe = mongoose.model('ContactUs',contactUsSchema)
module.exports = Subscribe