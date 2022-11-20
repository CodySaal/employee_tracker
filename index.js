import * as dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2";
import inquirer from "inquirer";

const connection = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    database: process.env.DB_NAME
});

// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
const viewDepartments = async () => {
    try {
        const [departments] = await connection.promise().query(
            "SELECT * FROM department"
        );
        console.table(departments);
        menuPrompt();
    } catch(err) {
        throw new Error(err);
    };
};
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
const viewRoles = async () => {
    try {
        const [roles] = await connection.promise().query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role INNER JOIN department ON role.department_id=department.id"
        );
        console.table(roles);
        menuPrompt();
    } catch(err) {
        throw new Error(err)
    };
};
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database

// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

const menuPrompt = async () => {
    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Quit"]
        }
    ]);

    if (answers.action === "View All Departments"){
        viewDepartments();
    } else if (answers.action === "View All Roles") {
        viewRoles();
    } else if (answers.action === "View All Employees") {
        console.log("viewEmployees")
    } else if (answers.action === "Add a Department") {
        console.log("addDepartment")
    } else if (answers.action === "Add a Role") {
        console.log("addRole")
    } else if (answers.action === "Add an Employee") {
        console.log("addEmployee")
    } else if (answers.action === "Update an Employee Role") {
        console.log("updateEmployeeRole")
    } else {
        process.exit(0)
    };
};

menuPrompt();