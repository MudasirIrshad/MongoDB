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
        ref:'BlogModel'
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
   const founded=await UserSignupModel.findOne({gmail})
   if(founded){
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
    const founded=await UserSignupModel.findOne({name,gmail,password})
    if(founded){
        const token=jwt.sign({name,gmail,password},secretKey)
        res.send(token)
    }
    else{
        res.send('Invalid Credentials')
    }
    
})
function Userauthentication(req,res,next){
    const token=req.headers.authorization.split(' ')[1]
    jwt.verify(token,secretKey,async(err,decoded)=>{
        console.log(decoded);
        const gmail=decoded.gmail
        console.log(gmail);
        const founded=await UserSignupModel.findOne({gmail})
        
        if(founded){
            req.user=decoded
            
            next()
        }
        else {
            res.send(err)
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
    
    const gmail=req.user.gmail
    const founded=await UserSignupModel.findOne({gmail})
    console.log(founded.blogs);
    
    founded.blogs.push(newBlog._id)
    newBlog.save()
    await founded.save()
    res.send(founded)
})
app.get('/user',Userauthentication,async (req,res)=>{
    let gmail = req.user.gmail
    const founded=await UserSignupModel.findOne({gmail})
    res.send(founded)

})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})