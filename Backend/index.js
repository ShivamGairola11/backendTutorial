const express = require("express");
const users = require("./MOCK_DATA.json")
const fs = require('fs')


const app = express();
const PORT = 8000;

// Using plugins: middleware
app.use(express.urlencoded({extended:false}))

//Routes
app.get("/api/users", (req,res)=>{
    return res.json(users);
})
app.get("/users", (req,res)=>{
    const html = 
    `<ul>
    ${users.map((user)=>
        `<li>${user.first_name}</li>`
    ).join("")} 
    </ul>
    `;
    res.send(html);
})
app.get("/users/:id",(req,res)=>{
    const id = Number(req.params.id);
    const searchUser = users.find(user=> user.id == id)
    if(searchUser)
    {
        res.json(searchUser)
    }
    else{
        res.status(404).send("User not found")
    }

})

// Task 2
// create an post request
app.post("/users", (req,res)=>{
    const body = req.body;
    users.push(({...body, id:users.length+1}));
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users), (err,data)=>{
        return res.json({status:"Done"})
    })
})

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
        res.json(newContent);
    }
    else{
        res.status(404).send("User not found")
    }
})




 

app.listen(PORT,()=> console.log("app is launched"))
