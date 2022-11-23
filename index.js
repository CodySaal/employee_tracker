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
const viewEmployees = async () => {
    try {
        const [employees] = await connection.promise().query(`
            SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager 
            FROM employee employee 
            INNER JOIN role ON employee.role_id=role.id
            INNER JOIN department ON role.department_id=department.id 
            LEFT JOIN employee manager ON employee.manager_id=manager.id
        `
        );
        console.table(employees);
        menuPrompt();
    } catch(err) {
        throw new Error(err)
    };
};
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
const addDepartment = async () => {
    const answer = await inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the department?"
        }
    ])
    try {
        const [results] = await connection.promise().query(`
        INSERT INTO department (name)
        VALUES (?)
        `, [answer.department])

        console.log("Department added!")
        menuPrompt()
    } catch(err) {
        throw new Error(err)
    }
};
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
const addRole = async () => {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the role?"
        },
        {
            type: "number",
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department",
            message: "Which department does the role belong to?",
            choices: async () => {
                const [result] = await connection.promise().query("SELECT * FROM department")
                console.log(result)
                return result
            }
        },
    ]);
    try {
        const [result] = await connection.promise().query("SELECT id FROM department WHERE name = ?", [answers.department])
        await connection.promise().query(`
        INSERT INTO role (title, salary, department_id)
        VALUES (?, ?, ?)
        `, [answers.name, answers.salary, result[0].id])

        console.log(`${answers.name} was added!`)
        menuPrompt();
    } catch(err) {
        throw new Error(err)
    }
};
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// Idea 2 addEmployee
const addEmployee = async () => {
    connection.query("SELECT role.title, employee.first_name, employee.last_name FROM role LEFT JOIN employee ON role.id = employee.role_id", async (err, res) => {
        console.log(res)
        const roles = res.map(role => role.title)
        console.log(roles)
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "first_name",
                message: "What is the first name of the employee?"
            },
            {
                type: "input",
                name: "last_name",
                message: "What is the last name of the employee?"
            },
            {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: () => {
                    let roles = res.map(role => role.title)
                    let rolesChoices = [...new Set(roles)]
                    return rolesChoices
                }
            },
            {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: () => {
                    let managers = ["None"]
    
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].first_name != null || res[i].last_name != null) {
                            let managerName = `${res[i].first_name} ${res[i].last_name}`
    
                            managers.push(managerName)
                        }
                    }
                    return managers
                }
            },
        ]);
        try {
            const [role] = await connection.promise().query("SELECT id FROM role WHERE title = ?", [answers.role])
    
            const managersArray = answers.manager.split(" ")
    
            if (managersArray[0] != "None") {
                const [manager] = await connection.promise().query("SELECT id FROM employee WHERE first_name = ? and last_name = ?", [managersArray[0], managersArray[1]])
                await connection.promise().query(`
                INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                VALUES (?, ?, ?, ?)
                `, [answers.first_name, answers.last_name, role[0].id, manager[0].id])
            } else {
                await connection.promise().query(`
                INSERT INTO employee (first_name, last_name, role_id) 
                VALUES (?, ?, ?)
                `, [answers.first_name, answers.last_name, role[0].id])
            }
    
            console.log(`Added ${answers.first_name} ${answers.last_name} to the database.`)
    
            menuPrompt();
        } catch(err) {
            throw new Error(err)
        }
    })
};

// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
const updateEmployeeRole = async () => {
    connection.query("SELECT role.title, employee.first_name, employee.last_name FROM role LEFT JOIN employee ON role.id = employee.role_id", async (err, res) => {
        const answers = await inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee's role do you want to update?",
                choices: () => {
                    let employees = []
    
                    for (let i = 0; i < res.length; i++) {
                        if (res[i].first_name != null || res[i].last_name != null) {
                            let employeeName = `${res[i].first_name} ${res[i].last_name}`
    
                            employees.push(employeeName)
                        }
                    }
                    return employees
                }
            },
            {
                type: "list",
                name: "role",
                message: "Which role do you want to assign the selected employee?",
                choices: () => {
                    let roles = res.map(role => role.title)
                    let rolesChoices = [...new Set(roles)]
                    return rolesChoices
                }
            }
        ]);
        try {
            const employeeNameSplit = answers.employee.split(" ")
            const [employeeId] = await connection.promise().query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [employeeNameSplit[0], employeeNameSplit[1]])

            const [role] = await connection.promise().query("SELECT id FROM role WHERE title = ?", [answers.role])

            await connection.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [role[0].id, employeeId[0].id])

            console.log("Updated employee's role")
            menuPrompt();
        } catch(err) {
            throw new Error(err)
        }
    });
};
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
        viewEmployees();
    } else if (answers.action === "Add a Department") {
        addDepartment();
    } else if (answers.action === "Add a Role") {
        addRole();
    } else if (answers.action === "Add an Employee") {
        addEmployee();
    } else if (answers.action === "Update an Employee Role") {
        updateEmployeeRole();
    } else {
        process.exit(0)
    };
};

menuPrompt();