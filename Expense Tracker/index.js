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
    }],
    income:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IncomeModel'
    }]
})
const UserExpenseSchema=new mongoose.Schema({
    description:String,
    amount:Number
})
const UserIncomeSchema=new mongoose.Schema({
    description:String,
    amount:Number
})
const UserSignup=mongoose.model('UserSignup',UserSignupSchema)
const ExpenseModel=mongoose.model('ExpenseModel',UserExpenseSchema)
const IncomeModel=mongoose.model('IncomeModel',UserIncomeSchema)

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
    jwt.verify(token,userKey,async(err,decoded)=>{
        const gmail=decoded.gmail
        if(err){
            
            res.send(err)
        }
        else{
            const findUser=await UserSignup.findOne({gmail})
            
            if(findUser){
                req.user=decoded
                next()
            }
            else{
                res.send('Invalid')
            }
        }
    })
}

app.post('/user/login',LoginMiddleware,(req, res) => {
    let User = req.user
    res.send(User)
})

app.post('/user/Expense',LoginMiddleware,async (req, res) => {
    const {description,amount}=req.body
    const expense=new ExpenseModel({description,amount})
    const gmail=req.user.gmail
    const findUser=await UserSignup.findOne({gmail})
    if(findUser){
        findUser.expense.push(expense._id)
        findUser.save()
        expense.save()
        res.send(findUser)
    }
    else{
        res.send('Invalid')
    }
})

app.post('/user/Income',LoginMiddleware,async (req, res) => {
    const {description,amount}=req.body
    const income=new IncomeModel({description,amount})
    const gmail=req.user.gmail
    const findUser=await UserSignup.findOne({gmail})
    if(findUser){
        findUser.income.push(income._id)
        findUser.save()
        income.save()
        res.send(findUser)
    }
    else{
        res.send('Invalid')
    }
})

app.get('/user',LoginMiddleware,async (req, res) => {
    let gmail=req.user.gmail
    const findUser=await UserSignup.findOne({gmail})
    res.send(findUser)
})

app.get('/user/Expense',LoginMiddleware,async (req, res) => {
    const gmail=req.user.gmail
    const findUser=await UserSignup.findOne({gmail})
    let totalExpenseAmount=0
    let totalExpense=[]
    for (let i of findUser.expense){
        const expense=await ExpenseModel.findById(i)
        totalExpenseAmount+=expense.amount
        totalExpense.push(expense)
    }
    res.json({totalExpense,totalExpenseAmount})
})
app.get('/user/Income',LoginMiddleware,async (req, res) => {
    const gmail=req.user.gmail
    const findUser=await UserSignup.findOne({gmail})
    let totalIncomeAmount=0
    let totalIncome=[]
    for (let i of findUser.income){
        const income=await IncomeModel.findById(i)
        totalIncomeAmount+=income.amount
        totalIncome.push(income)
    }
    res.json({totalIncome,totalIncomeAmount})
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})