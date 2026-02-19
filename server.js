const express=require("express");
const fs=require("fs");
const app=express();

app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

/* READ FILE */
function readEmployees(){
return JSON.parse(fs.readFileSync("employees.json"));
}

/* WRITE FILE */
function writeEmployees(data){
fs.writeFileSync("employees.json",JSON.stringify(data,null,2));
}

/* DASHBOARD */
app.get("/",(req,res)=>{
const employees=readEmployees();
res.render("index",{employees});
});

/* ADD PAGE */
app.get("/add",(req,res)=>{
res.render("add");
});

/* ADD EMPLOYEE */
app.post("/add",(req,res)=>{
const employees=readEmployees();

const newEmployee={
id:"EMP-"+(employees.length+1001),
name:req.body.name,
department:req.body.department,
salary:Number(req.body.salary),
profile:req.body.profile
};

employees.push(newEmployee);
writeEmployees(employees);
res.redirect("/");
});

/* DELETE */
app.get("/delete/:id",(req,res)=>{
let employees=readEmployees();
employees=employees.filter(emp=>emp.id!==req.params.id);
writeEmployees(employees);
res.redirect("/");
});

/* EDIT PAGE */
app.get("/edit/:id",(req,res)=>{
const employees=readEmployees();
const employee=employees.find(e=>e.id===req.params.id);
res.render("edit",{employee});
});

/* UPDATE */
app.post("/update/:id",(req,res)=>{
let employees=readEmployees();

employees=employees.map(emp=>{
if(emp.id===req.params.id){
return{
...emp,
name:req.body.name,
department:req.body.department,
salary:Number(req.body.salary),
profile:req.body.profile
};
}
return emp;
});

writeEmployees(employees);
res.redirect("/");
});

app.listen(3000,()=>console.log("Server running on port 3000"));
