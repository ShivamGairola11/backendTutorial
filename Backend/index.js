const express = require("express");

// const users = require("./MOCK_DATA.json")
// Fruther when connect with db we won't use json file upload methoda we will import user from DB So commenting above line
const fs = require('fs')


const app = express();
const PORT = 8000;

// ------------------------- DB Setupt with Mongoose START -----------------------
const mongoose = require("mongoose");
// Connection || It also returns promise : give the url from local running terminal and after/ is name that you want to name your db
mongoose.connect('mongodb://127.0.0.1:27017/tutorial-app')
.then(()=> console.log("mongoDB Connected"))
.catch(err => console.log("mongo error", err))

// For connecting DB you need to define Schema:
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required :true,
    },
    lastName:{
        type: String,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
    jobTitle:{
        type: String,
    },
    gender:{
        type:String,
    }
},{timestamps:true})
// After defining schema now you need to define model. "user": this is name given to model
const User = mongoose.model("user",userSchema )
// Using this USER class i can interact with mongo db so for that create a connection : done on top

// ------------------------- DB Setupt with Mongoose END -----------------------

// Using plugins: middleware
app.use(express.urlencoded({extended:false}))


//-------------------------- Without DB code------------------------------
//Routes
// app.get("/api/users", (req,res)=>{
//     return res.json(users);
// })
// app.get("/users", (req,res)=>{
//     const html = 
//     `<ul>
//     ${users.map((user)=>
//         `<li>${user.first_name}</li>`
//     ).join("")} 
//     </ul>
//     `;
//     res.send(html);
// })
// app.get("/users/:id",(req,res)=>{
//     const id = Number(req.params.id);
//     const searchUser = users.find(user=> user.id == id)
//     if(searchUser)
//     {
//         res.json(searchUser)
//     }
//     else{
//         res.status(404).send("User not found")
//     }

// })

// Task 2
// create an post request
// app.post("/users", (req,res)=>{
//     const body = req.body;
//     users.push(({...body, id:users.length+1}));
//     fs.writeFile('./MOCK_DATA.json',JSON.stringify(users), (err,data)=>{
//         return res.json({status:"Done"})
//     })
// })
// Creating Patch request 

app.patch("/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    const body = req.body;
    const newContent=users.find(user => user.id === id)
    if(newContent){
        newContent.first_name= first_name || newContent.first_name;
        newContent.last_name = last_name || newContent.last_name;
        newContent.email = email || newContent.email;
        newContent.gender = gender || newContent.gender;
        newContent.job_title = job_title || newContent.job_title;
        res.status(201).json(newContent);
    }
    else{
        res.status(404).send("User not found")
    }
})
// Adding header to your response:
// app.get("/users",(req,res)=>{
//     res.setHeader('Name of header here', 'And its value')
//     return res.json (users);
// }) 

// -------------------------------Reuqest With DB START ----------------------------------

// So to instead of FS we will use DB and it will be async
app.post("/users", async (req,res)=>{
    const body = req.body;
    if(
        !body ||
        !body.first_name ||
        !body.last_name ||
        !body.email ||
        !body.gender ||
        !body.job_title
    )
    {
        return res.status(400).json({message:"All fields are required"});
    }
    // User we will use here will be model/ mongoose. 
   const result = await User.create({
        firstName:body.first_name,
        lastName: body.last_name,
        email: body.email,
        gender: body.gender,
        jobTitle: body.job_title
    })
    console.log("result",result)
    return res.status(201).json({msg:"success"})
})

app.get("/users",async (req,res)=>{
    const allDbUser = await User.find({})
    const html = 
    `<ul>
    ${allDbUser.map((user)=>
        `<li>${user.firstName}-${user.email}</li>`
    ).join("")} 
    </ul>
    `;
    res.send(html);
})

app.get("/api/users", async (req,res)=>{
    const allDbUser = await User.find({})
    return res.json(allDbUser);
})
.route("/user/:id")
.get(async(req,res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(401).json({error: "User not found"});
    }
    return res.json(user);
})
.patch(async(req,res)=>{
    await User.findByIdAndUpdate(req.params.id,{lastName:'changed'})
    return res.json({status:"success"})
})
.delete(async(req,res)=>{
 await User.findByIdAndDelete(req.params.id)
 return res.json({status: "Success"})
})









app.listen(PORT,()=> console.log("app is launched"))
