const mongoose = require('mongoose')

const wishlistSchema = new mongoose.Schema({
    user_ID:{
        type:String,
        required:true
    },
    allProduct: {
        type: Array,
        required:true
    }
})

const wishlists = mongoose.model("wishlists",wishlistSchema)

module.exports = wishlists