const express=require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
app.use(bodyParser.json())
const url='mongodb+srv://mudasirirshad47:mudasir123456789@cluster0.jzcnrjw.mongodb.net/School_Review_System'
mongoose.connect(url)
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})


const UserSignupSchema = mongoose.Schema({
    name:String,
    gmail:String,
    password:Number
})
const UserSignup = mongoose.model('UserSignup',UserSignupSchema)

const SchoolDetailSchema = mongoose.Schema({
    name:String,
    rating:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
    }]
})
const SchoolDetail = mongoose.model('SchoolDetail',SchoolDetailSchema)

const RatingSchema = mongoose.Schema({
    name:String,
    rating:Number
})