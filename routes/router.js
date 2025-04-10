const express = require('express')
const userController = require('../controllers/userController')
const productController = require('../controllers/productController')
const wishlistController = require('../controllers/wishlistController')
const jwtMiddleware = require('../middlewares/jwtMiddleware')
const multerMiddleware = require('../middlewares/multerMiddleware')

const router = new express.Router()

// register
router.post('/register',userController.registerController)

// login
router.post('/login',userController.loginController)

// add product
router.post('/add-product',jwtMiddleware,multerMiddleware.single('productImage'),productController.addProductController)

// update products
router.put('/products/:id/update',jwtMiddleware,multerMiddleware.single('productImage'),productController.updateProductController)

// delete product
router.delete('/products/:id/delete',jwtMiddleware,productController.deleteProductController)

// get all products
router.get('/all-products',productController.allProductsController) 

// get single product
router.get('/products/:id',productController.singleProductController)

// search products
router.get('/search-products',productController.searchProductController) 

// filter products
router.get('/products-filter',productController.filterProductController) 

// add to wishlist
router.post('/:id/add-to-wishlist',jwtMiddleware,wishlistController.addToWishlistController)

// remove from wishlist
router.delete('/remove/wishlist/:id',jwtMiddleware,wishlistController.removeFromWishlistController)

// get user wishlist
router.get('/user-wishlist',jwtMiddleware,wishlistController.userWishlistController) 

module.exports = router