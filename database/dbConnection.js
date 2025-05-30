const mongoose = require('mongoose')

const connectionString = process.env.DBCONNECTIONSTRING

mongoose.connect(connectionString).then(res=>{
    console.log("Mongodb Atlas connected successfully with productServer");
}).catch(err=>{
    console.log("Mongodb Atlas connection failed");
    console.log(err);
})