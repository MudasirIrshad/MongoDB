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
    blogs:[{
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

app.post('/user/signup',async(req,res)=>{
   const {name,gmail,password}=req.body
   const foundUser=await UserSignupModel.findOne({gmail})
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

const secretKey="hello this is user signup key"
app.post('/user/login',async (req,res)=>{
    const {name,gmail,password}=req.body
    let foundUser=await UserSignupModel.findOne({name,gmail,password})
    if(foundUser){
        const token=jwt.sign({foundUser},secretKey)
        res.send(token)
    }
    else{
        res.send('Invalid Credentials')
    }
    
})
let Userauthentication=(req,res,next)=>{
    let token=req.headers.authorization.split(' ')[1]
    jwt.verify(token,secretKey,(err,decoded)=>{
        if(err){
            res.send(err)
        }
        else{
            req.user=decoded
            next()
        }
    })
}
app.post('/blog',Userauthentication,async(req,res)=>{
    let {title,body,author}=req.body
    const newBlog=new BlogModel({
        title,
        body,
        author
    })
    
    console.log(req.user.gmail);
    
    newBlog.save()
    
    res.send(newBlog)
})
app.get('/user',Userauthentication,(req,res)=>{
    res.send(req.user)
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})