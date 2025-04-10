const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        minlength:3    
    },
    description:{
        type:String,
        required:true,
        minlength:3,
        maxlength:50
    },
    price:{
        type:Number,
        required:true,
    },
    productImage:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        lowercase:true
    },
    productID:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type:String,
        required:true
    }
})

const products = mongoose.model("products",productSchema)

module.exports = products