const express = require("express");
const fileHandler = require("./modules/fileHandler");

const app = express();
const PORT = 3000;

/* SERVER SETUP */
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

/*
==============================
GENERATE EMPLOYEE ID
EMP-1001, EMP-1002, EMP-1003
==============================
*/
function generateEmployeeId(employees) {
  if (employees.length === 0) return "EMP-1001";

  // Extract numbers from all IDs
  const numbers = employees.map(emp =>
    parseInt(emp.id.split("-")[1])
  );

  const max = Math.max(...numbers);

  return `EMP-${max + 1}`;
}

/*
START SERVER
*/
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

/*
==============================
DASHBOARD → READ & DISPLAY
==============================
*/
app.get("/", async (req, res) => {
  const employees = await fileHandler.read();
  res.render("index", { employees });
});

/*
==============================
SHOW ADD FORM
==============================
*/
app.get("/add", (req, res) => {
  res.render("add");
});

/*
==============================
ADD EMPLOYEE (CREATE)
==============================
*/
app.post("/add", async (req, res) => {
  const { name, department, salary } = req.body;

  // Validation
  if (!name || name.trim() === "" || salary < 0) {
    return res.send("Invalid input: Name cannot be empty & salary cannot be negative");
  }

  const employees = await fileHandler.read();

  const newEmployee = {
    id: generateEmployeeId(employees), // 👈 EMP-1002 format
    name,
    department,
    salary: Number(salary)
  };

  employees.push(newEmployee);
  await fileHandler.write(employees);

  res.redirect("/");
});

/*
==============================
DELETE EMPLOYEE
==============================
*/
app.get("/delete/:id", async (req, res) => {
  let employees = await fileHandler.read();

  employees = employees.filter(emp => emp.id != req.params.id);

  await fileHandler.write(employees);
  res.redirect("/");
});

/*
==============================
SHOW EDIT FORM
==============================
*/
app.get("/edit/:id", async (req, res) => {
  const employees = await fileHandler.read();
  const employee = employees.find(emp => emp.id == req.params.id);

  if (!employee) return res.send("Employee not found");

  res.render("edit", { employee });
});

/*
==============================
UPDATE EMPLOYEE
==============================
*/
app.post("/edit/:id", async (req, res) => {
  const { name, department, salary } = req.body;

  // Validation
  if (!name || name.trim() === "" || salary < 0) {
    return res.send("Invalid input: Name cannot be empty & salary cannot be negative");
  }

  let employees = await fileHandler.read();

  employees = employees.map(emp =>
    emp.id == req.params.id
      ? {
          ...emp,
          name,
          department,
          salary: Number(salary)
        }
      : emp
  );

  await fileHandler.write(employees);
  res.redirect("/");
});
