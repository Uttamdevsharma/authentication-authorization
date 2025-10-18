const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
require('dotenv').config()
const path = require("path")
const mongoose = require('mongoose')



//middleware
app.use(express.json())
app.use(cors())



const userRouter = require('./user-router.js')
app.use("/user",userRouter)



const uri = process.env.DB_URL
//mongoose configuration
async function main() {
    await mongoose.connect(uri);
}


main().then(() => console.log("Mongodb connected succesfully")).catch(err => console.log(err));




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
