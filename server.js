const express = require("express");
const fileHandler = require("./modules/fileHandler");

const app = express();
const PORT = 3000;

/* SERVER SETUP */
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

/*
Generate Unique Employee ID
*/
function generateEmployeeId(employees) {
  if (employees.length === 0) return "EMP-1001";

  const lastId = employees[employees.length - 1].id;
  const number = parseInt(lastId.split("-")[1]);

  return `EMP-${number + 1}`;
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
ADD EMPLOYEE
==============================
*/
app.post("/add", async (req, res) => {
  const employees = await fileHandler.read();

  const newEmployee = {
    id: generateEmployeeId(employees),
    name: req.body.name,
    department: req.body.department,
    salary: Number(req.body.salary)
  };

  employees.push(newEmployee);
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
  const employee = employees.find(e => e.id === req.params.id);

  if (!employee) return res.send("Employee not found");

  res.render("edit", { employee });
});

/*
==============================
UPDATE EMPLOYEE
==============================
*/
app.post("/edit/:id", async (req, res) => {
  let employees = await fileHandler.read();

  employees = employees.map(emp =>
    emp.id === req.params.id
      ? {
          ...emp,
          name: req.body.name,
          department: req.body.department,
          salary: Number(req.body.salary)
        }
      : emp
  );

  await fileHandler.write(employees);
  res.redirect("/");
});
