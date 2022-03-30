const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

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
    });
}
const showRoles = () => { 
    db.query('SELECT * FROM roles', function (err, results) {
    console.table(results);
    });
}
const showDepartments = () => { 
    db.query('SELECT * FROM departments', function (err, results) {
    console.table(results);
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

  }

  initPrompt();