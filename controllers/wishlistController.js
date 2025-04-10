const wishlists = require('../models/wishlistModel')
const products = require('../models/productsModel')
const users = require('../models/userModel')

// add to wishlist
exports.addToWishlistController = async (req, res) => {
    const id = req.userId
    const productId = req.params.id
    const productDetails = await products.findOne({ _id: productId })
    const userDetails = await users.findOne({ _id: id })
    const { userID, role } = userDetails

    try {
        if (role == 'user') {
            const existingUser = await wishlists.findOne({ user_ID: userID })
            if (existingUser) {
                const userWishlist = existingUser.allProduct
                const matchingId = userWishlist.some(product => product._id == productId)
                if (matchingId) {
                    res.status(406).json("Product already exist in wishlist")
                } else {                   
                    existingUser.allProduct.push(productDetails)
                    await existingUser.save()
                    res.status(200).json("Product added successfully")
                }

            } else {
                const newWishlist = new wishlists({
                    user_ID: userID, allProduct: productDetails
                })
                await newWishlist.save()
                res.status(200).json(newWishlist)
            }
        }else{
            res.status(406).json("Only user can add product to wishlist")
        }
    }
    catch (err) {
        res.status(401).json(err)
    }
}

// remove from wishlist
exports.removeFromWishlistController = async (req,res)=>{
    const id = req.userId
    const productId = req.params.id
    const userDetails = await users.findOne({ _id: id })
    const { userID,role } = userDetails
    try{                       
        if(role == 'user'){
            const existingUser = await wishlists.findOne({ user_ID: userID })
            if(existingUser){
                const matchingId = existingUser.allProduct.some(product => product._id == productId)                
                if (matchingId) {
                    existingUser.allProduct = existingUser.allProduct.filter(product => product._id.toString() !== productId);
                    await existingUser.save();
                    res.status(200).json("Product removed successfully")
                } else {                   
                    res.status(200).json("Product doesn't exists")
                }
            }else{
                res.status(406).json("User doesn't exists")
            }
        }else{
            res.status(406).json("Only user can delete product from wishlist")
        }
    }catch(err){
        res.status(401).json(err)
    }
}

// get user wishlist
exports.userWishlistController = async (req,res)=>{
    const id = req.userId
    const userDetails = await users.findOne({ _id: id })
    const {userID} = userDetails
    try{
        const alluserWishlists = await wishlists.find({ user_ID: userID })
        res.status(200).json(alluserWishlists)
    }
    catch(err){
        res.status(401).json(err)        
    }
}