const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const port=3000
const mongoose = require('mongoose')
const url='mongodb+srv://mudasirirshad47:mudasir123456789@cluster0.jzcnrjw.mongodb.net/TodoApp'
mongoose.connect(url)

const Tasks=new mongoose.Schema({
    title:String,
    description:String
})

const AddTask=mongoose.model('AddTask',Tasks)

app.post('/tasks',(req,res)=>{
    res.send('Tasks added successfully')
})

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})