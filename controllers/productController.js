const products = require('../models/productsModel')
const users = require('../models/userModel')

// add products
exports.addProductController = async (req,res)=>{
    const userId = req.userId
    const {productName,description,price,category,productID} = req.body
    const productImage = req.file.filename
    
    try{
        const existingProduct = await products.findOne({productID})
        if(existingProduct){
            res.status(406).json("Product already exist in our collection... Please upload another!!!")
        }else{
            const newProduct = new products({
                productName,description,price,productImage,category,productID,userId
            })
            await newProduct.save()
            res.status(200).json(newProduct)
        }
    }
    catch(err){
        res.status(401).json(err)
    }
}

// update products
exports.updateProductController = async (req,res)=>{
    const id = req.params.id
    const user_ID = req.userId
    const {productName,description,price,productImage,category,productID} = req.body
    const reUploadProductImage = req.file?req.file.filename:productImage
    try{
        const getUserDetails = await users.findOne({_id:user_ID})
        const role = getUserDetails.role
        const productDetails = await products.findOne({_id:id})                        
        const userId = productDetails.userId
        
        if(role == 'admin'){
            const updateProduct = await products.findByIdAndUpdate({_id:id},{
                productName,description,price,productImage:reUploadProductImage,category,productID,userId
            },{new:true})
            await updateProduct.save()
            res.status(200).json(updateProduct)
        } else{
            if(user_ID == userId){
                const updateProduct = await products.findByIdAndUpdate({_id:id},{
                    productName,description,price,productImage:reUploadProductImage,category,productID,userId
                },{new:true})
                await updateProduct.save()
                res.status(200).json(updateProduct)
            }else{
                res.status(406).json("You are trying to update others product!!!")
            }
        }
    }catch(err){
        res.status(401).json(err)
    }
}

// delete product
exports.deleteProductController = async (req,res)=>{
    const id = req.params.id
    const user_ID = req.userId
    try{
        const getUserDetails = await users.findOne({_id:user_ID})
        const productDetails = await products.findOne({_id:id})                        

        if(getUserDetails.role == 'admin' || user_ID == productDetails.userId){
            const deleteProduct = await products.findByIdAndDelete({_id:id})
            res.status(200).json(deleteProduct)
        }else{
            res.status(406).json("You are trying to delete others product!!!")
        }
    }catch(err){
        res.status(401).json(err)
    }
}

// get all products
exports.allProductsController = async (req,res)=>{
    try{
        const allProducts = await products.find()
        const productList = allProducts.map(product=>(
            {Name:product.productName,Image:product.productImage,Price:product.price}
        ))
        res.status(200).json(productList)
    }
    catch(err){
        res.status(401).json(err)        
    }
}

// get single product
exports.singleProductController = async (req,res)=>{
    const id = req.params.id
    try{
        const singleProduct = await products.findOne({_id:id})
        res.status(200).json(singleProduct)
    }
    catch(err){
        res.status(401).json(err)        
    }
}

// search products
exports.searchProductController = async (req,res)=>{
    const searchKey = req.query.search
    
    try{
        const searchResult = await products.find({
            $or: [
                { productName: { $regex: searchKey, $options: 'i' } },
                { productID: { $regex: searchKey, $options: 'i' } }
              ]
        })        
        res.status(200).json(searchResult)
    }
    catch(err){
        res.status(401).json(err)        
    }
}

// filter products 
exports.filterProductController = async (req,res)=>{
    const { category,minPrice,maxPrice} = req.query
    
    try{
        const filterResult = await products.find({
            $or: [
                { category: { $regex: category, $options: 'i' } },
                { price: { $gte: minPrice, $lte: maxPrice } }
              ]
        })        
        res.status(200).json(filterResult)
    }
    catch(err){
        res.status(401).json(err)        
    }
}
