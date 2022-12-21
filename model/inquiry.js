const mongoose = require('mongoose')
const inquirySchema =mongoose.Schema({
    name:String,
    emailId:String,
    contactNo:Number,
    message:String,
    productDetails:[{
    images:Array,
    productTitle:String,
    productId:String,
    richDescription:String,
    brand:String,
    price:Number,
    rating:Number,
    }],
    countInStock:{
        type:Number,
        required:true
    },
    createdAt:Number
})
const Inquiry = mongoose.model('Inquiry',inquirySchema)
module.exports = Inquiry