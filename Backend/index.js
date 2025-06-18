const express = require("express");
const users = require("./MOCK_DATA.json")


const app = express();
const PORT = 8000;

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


 

app.listen(PORT,()=> console.log("app is launched"))
