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
    password:String,
    expense:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExpenseModel'
    }]
})
const UserExpenseSchema=new mongoose.Schema({
    description:String,
    amount:Number
})
const UserSignup=mongoose.model('UserSignup',UserSignupSchema)
const ExpenseModel=mongoose.model('ExpenseModel',UserExpenseSchema)

const userKey="UserSignup Done"
app.post('/user/signup',async(req, res) => {
    const {name,gmail,password}=req.body
    const foundUser=await UserSignup.findOne({gmail})
    console.log(foundUser);
    if(foundUser){
        res.send('User Already Exist')
    }
    else{
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
    }
})
function LoginMiddleware(req, res, next) {
    const token=req.headers.authorization.split(' ')[1]
    jwt.verify(token,userKey,async(err,user)=>{
        const gmail=user.gmail
        if(err){
            res.send(err)
        }
        else{
            const findUser=await UserSignup.findOne({gmail})
            console.log(findUser);
            if(findUser){
                next()
            }
            else{
                res.send('Invalid')
            }
        }
    })
}

app.post('/user/login',LoginMiddleware,(req, res) => {
   res.send('Login successful')
})

app.post('/user/Expense',LoginMiddleware,(req, res) => {
    const {description,amount}=req.body
    const expense=new ExpenseModel({description,amount})
    const token=req.headers.authorization.split(' ')[1]
    jwt.verify(token,userKey,async(err,user)=>{
        const gmail=user.gmail
        const findUser=await UserSignup.findOne({gmail})
        if(findUser){
            findUser.expense.push(expense._id)
            findUser.save()
            res.send(findUser)
        }
        else{
            res.send('Invalid')
        }
    })
    expense.save()
})
app.get('/user',LoginMiddleware,(req, res) => {
    const token =req.headers.authorization.split(' ')[1]
    jwt.verify(token,userKey,async(err,user)=>{
        const gmail=user.gmail
        
        const findUser=await UserSignup.findOne({gmail})
        if(findUser){
            res.send(findUser)
        }
        else{
            res.send('Invalid')
        }
    })
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})