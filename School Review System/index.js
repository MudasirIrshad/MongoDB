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

app.post('/user/signup',(req,res)=>{
    const {name,gmail,password}=req.body
    const newUser=new UserSignup({
        name,gmail,password
    })
    newUser.save()
    res.send({name,gmail,message:"Signup Done"})
})

app.get('/user',async(req,res)=>{
    const Users = await UserSignup.find()
    res.send(Users)
})

const userToken = "this is user jwt Toekn"
app.post('/user/login',async(req,res)=>{
    const password = Number(req.body.password)
    const gmail = req.body.gmail
    
    const user=await UserSignup.findOne({gmail})
    if(user){
        if(user.password===password){
            const token=jwt.sign({gmail:gmail},userToken)
            console.log(password);
            res.send({token})
        }
        else{
            res.send({message:"Wrong Password"})
        }
    }
    else{
        res.send({message:"User Not Found"})
    }
})