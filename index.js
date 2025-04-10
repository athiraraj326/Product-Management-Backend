require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/router')
require('./database/dbConnection')

const productServer = express()

productServer.use(cors())
productServer.use(express.json())
productServer.use(router)
productServer.use('/uploads',express.static('./uploads'))

const PORT = 3000 || process.env.PORT

productServer.listen(PORT,()=>{
    console.log(`productServer started at port ${PORT} and waiting for client request`);
})

productServer.get('/',(req,res)=>{
    res.status(200).send(`productServer started at port and waiting for client request`)
})