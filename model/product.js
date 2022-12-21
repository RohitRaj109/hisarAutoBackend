const mongoose = require('mongoose')
const productSchema =mongoose.Schema({
    image:String,
    images:Array,
    title:String,
    contactNo:Number,
    emailId:String,
    description:String,
    richDescription:String,
    brand:String,
    price:Number,
    rating:Number,
    countInStock:{
        type:Number,
        required:true
    },
    createdAt:Number
})
const Product = mongoose.model('Product',productSchema)
module.exports = Product