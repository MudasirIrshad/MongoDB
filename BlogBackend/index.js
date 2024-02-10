const express=require('express')
const app=express()
const port=3000
const bodyparser=require('body-parser')
const url='mongodb+srv://mudasirirshad47:mudasir123456789@cluster0.jzcnrjw.mongodb.net/Blog_Posts'
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
mongoose.connect(url)
app.use(bodyparser.json())
app.use(express.json())

const UserSignupSchema = mongoose.Schema({
    name:String,
    gmail:String,
    password:String,
    expense:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'UserSignupModel'
    }]
})
const Blog_PostSchema = mongoose.Schema({
    title:String,
    body:String,
    author:String
})
const UserSignupModel=mongoose.model('UserSignup',UserSignupSchema)
const BlogModel=mongoose.model('BlogModel',Blog_PostSchema)

app.post('/user/signup',(req,res)=>{
   const {name,gmail,password}=req.body
   const foundUser=UserSignupModel.findOne({gmail})
   if(foundUser){
    res.send('User Already Exist')
   }
   else{
    const newUser=new UserSignupModel({
        name,
        gmail,
        password
    })
    newUser.save()
    res.send(newUser)
   }
})

app.post('/user/login',(req,res)=>{
    const {gmail,password}=req.body
    UserSignupModel.findOne({gmail},(err,user)=>{
        if(err){
            res.send(err)
        }
        else{
            if(user){
                if(user.password===password){
                    const token=jwt.sign({gmail:gmail},'mudasirirshad47',{expiresIn:60*60*24})
                    res.send({token:token})
                }
                else{
                    res.send('Invalid Password')
                }
            }
            else{
                res.send('Invalid User')
            }
        }
    })
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})