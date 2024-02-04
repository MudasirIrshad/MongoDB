const express=require('express')
const app=express()
const port=3000
const bodyparser=require('body-parser')
const url='mongodb+srv://mudasirirshad47:mudasir123456789@cluster0.jzcnrjw.mongodb.net/Expense_Tracker'
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
mongoose.connect(url)
app.use(bodyparser.json())
app.use(express.json())

const UserSignupSchema=new mongoose.Schema({
    name:String,
    gmail:String,
    password:String
})
const UserSignup=mongoose.model('UserSignup',UserSignupSchema)

const userKey="UserSignup Done"
app.post('/user/signup',(req, res) => {
    const {name,gmail,password}=req.body
    const newUser=new UserSignup({
        name,
        gmail,
        password
    })
    console.log(req.body);
    newUser.save()
    const token=jwt.sign({name,gmail,password},userKey)
    if(newUser){
        res.send(token)
    }
})








app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})