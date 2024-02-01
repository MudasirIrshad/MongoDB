const express=require('express')
const app=express()
const bodyparser=require('body-parser')
const port=3000
const mongoose=require('mongoose')
const connectionStr='mongodb+srv://mudasirirshad47:mudasir123456789@cluster0.jzcnrjw.mongodb.net/TodoApp'
mongoose.connect(connectionStr)

app.get('/addtask',(req,res)=>{
    app.send('add data here functionality')
})
app.listen(port,()=>{
    console.log("Server started on port: "+port);
})