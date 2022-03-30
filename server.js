const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { asyncScheduler } = require('rxjs');
const { allowedNodeEnvironmentFlags } = require('process');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    },
    console.log('connection success')
);

const showEmployees = () => { 
    db.query('SELECT * FROM employees', function (err, results) {
    console.table(results);
    initPrompt();
    });
}
const addEmployee = () => {
    const addEmployeePrompt = async () => {
        var rolesList = [];
        var managersList = [];
        db.query('SELECT * FROM roles', function (err, roles) {
            var r = roles;
            for (var i in r) {
                rolesList.push(r[i].title);
            }
        });
        db.query('SELECT * FROM employees', function (err, managers) {
            var m = managers;
            for (var j in m) {
                managersList.push(m[j].first_name + " " + m[j].last_name);
            }
        });
        const info = await inquirer.prompt([
            {
                type: 'input',
                message: 'What is the first name of the employee?',
                name: 'fName'
            },
            {
                type: 'input',
                message: 'What is the last name of the employee?',
                name: 'lName'
            },
            {
                type: 'list',
                message: 'What is their role?',
                name: 'role',
                choices: rolesList
            },
            {
                type: 'list',
                message: 'Who is the employees manager?',
                name: 'manager',
                choices: managersList
            }
        ])
        let firstName = info.fName;
        let lastName = info.lName;
        let role = info.role;
        var roleId = rolesList.indexOf(role) + 1;
        let manager = info.manager;
        var managerId = managersList.indexOf(manager) + 1;
        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, 
        [firstName, lastName, roleId, managerId],
        (err, result) => {
            console.log(err);
        });
        console.log(`Added ${firstName} ${lastName} to the database`);
        initPrompt();
    }
    addEmployeePrompt();
}

const updateEmployee = async () => {
    var employeesList = [];
    var rolesList = [];
    db.query('SELECT * FROM employees', function (err, employees) {
        console.log(employees);
        var e = employees;
        for (var i in e) {
            employeesList.push(e[i].first_name + " " + e[i].last_name);
        }
        console.log(employeesList)
    });
    db.query('SELECT * FROM roles', function (err, roles) {
        var r = roles;
        for (var i in r) {
            rolesList.push(r[i].title);
        }
    });
    const updateInfo = await inquirer.prompt([
        {
            type: 'list',
            message: 'What employee do you want to update the role for?',
            name: 'update',
            choices: employeesList
        },
        {
            type: 'list',
            message: 'What role do you want to change to?',
            name: 'role',
            choices: rolesList
        }
    ])
    let employee = updateInfo.update;
    let role = updateInfo.role;
    let roleId = role.indexOf(role);
    let employeeId = employee.indexOf(employee);
    db.query(`UPDATE employees SET role_id = ? WHERE id = ?`,
    [role_id, employeeId],
    [firstName, lastName, roleId, managerId],
        (err, result) => {
            console.log(err);
        });
    console.log(`Updated ${employee}'s role in the database`);
    initPrompt();
}

const showRoles = () => { 
    db.query('SELECT * FROM roles', function (err, results) {
    console.table(results);
    initPrompt();
    });
}
const addRole = async () => {
    var departmentList = [];
        db.query('SELECT * FROM departments', function (err, departments) {
            var d = departments;
            for (var i in d) {
                departmentList.push(d[i].name);
            }
        });
    const rInfo = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the first name of the role?',
            name: 'rName'
        },
        {
            type: 'input',
            message: 'What is the salary of the role?',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Which department does the role belong to?',
            name: 'department',
            choices: departmentList
        }
    ])
    let roleName = rInfo.rName;
    let salary = rInfo.salary;
    let department = rInfo.department;
    var departmentId = departmentList.indexOf(department) + 1;
    db.query('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)',
    [roleName, salary, departmentId],
    (err, result) => {
        console.log(err);
    });
    console.log(`Added ${roleName} to the database`);
    initPrompt();
}

const showDepartments = () => { 
    db.query('SELECT * FROM departments', function (err, results) {
    console.table(results);
    initPrompt();
    });
}

const addDepartment = async () => {
    const dInfo = await inquirer.prompt([
        {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'dName'
        }
    ])
    let departmentName = dInfo.dName;
    db.query('INSERT INTO departments (name) VALUES (?)',
    [departmentName],
    (err, result) => {
        console.log(err);
    });
    console.log(`Added ${departmentName} to the database`);
    initPrompt();
}

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    // console.log(`Server running on port ${PORT}`);
  });

  const initQuestions = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit'];

  const initPrompt = async () => {
    const task = await inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'task',
            choices: initQuestions,
        },
    ]);
    if (task.task === 'View All Employees') {
        showEmployees();
    }
    else if (task.task === 'View All Roles') {
        showRoles();
    }
    else if (task.task === 'View All Departments') {
        showDepartments();
    }
    else if (task.task === 'Add Employee') {
        addEmployee();
    }
    else if (task.task === 'Add Role') {
        addRole();
    }
    else if (task.task === 'Add Department') {
        addDepartment();
    }
    else if (task.task === 'Update Employee Role') {
        updateEmployee();
    }
    else if (task.task === 'Quit') {

    }
  }

  initPrompt();