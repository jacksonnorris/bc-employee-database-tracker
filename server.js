const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');
const { asyncScheduler } = require('rxjs');

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
        var roleId = rolesList.indexOf(role);
        let manager = info.manager;
        var managerId = managersList.indexOf(manager);
        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, 
        [firstName, lastName, roleId, managerId],
        (err, result) => {
            console.log(err);
        });
        initPrompt();
    }
    addEmployeePrompt();
}

const showRoles = () => { 
    db.query('SELECT * FROM roles', function (err, results) {
    console.table(results);
    initPrompt();
    });
}
const showDepartments = () => { 
    db.query('SELECT * FROM departments', function (err, results) {
    console.table(results);
    initPrompt();
    });
}

app.use((req, res) => {
    res.status(404).end();
  });
  
  app.listen(PORT, () => {
    // console.log(`Server running on port ${PORT}`);
  });

  const initQuestions = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add department', 'Quit'];

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
    
  }

  initPrompt();