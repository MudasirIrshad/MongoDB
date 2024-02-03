const express=require('express')
const app=express()
const port=3000
const mongoose = require('mongoose')
const url='mongodb+srv://mudasirirshad47:mudasir123456789@cluster0.jzcnrjw.mongodb.net/TodoApp'
mongoose.connect(url)
const bodyparser=require('body-parser')
app.use(bodyparser.json())


const Tasks=new mongoose.Schema({
    title:String,
    description:String
})

const AddTask=mongoose.model('AddTask',Tasks)

app.post('/tasks',(req,res)=>{
    const title=req.headers.title
    const description=req.headers.description
    console.log(title);
    const newTask=new AddTask({
        title,description
    })
    res.send("Added successfully")
    newTask.save()
})

app.get('/tasks',async (req,res)=>{
    const tasks=await AddTask.find()
    res.send(tasks)
})


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})