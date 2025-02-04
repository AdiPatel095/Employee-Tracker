import inquirer from 'inquirer';
import {
  getDepartments,
  getRoles,
  getEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
} from './db/index.js';

async function mainMenu() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View All Departments',
        'View All Roles',
        'View All Employees',
        'Add Department',
        'Add Role',
        'Add Employee',
        'Update Employee Role',
        'Exit',
      ],
    },
  ]);

  switch (action) {
    case 'View All Departments': {
      const departments = await getDepartments();
      console.table(departments);
      break;
    }
    case 'View All Roles': {
      const roles = await getRoles();
      console.table(roles);
      break;
    }
    case 'View All Employees': {
      const employees = await getEmployees();
      console.table(employees);
      break;
    }
    case 'Add Department': {
      await promptAddDepartment();
      break;
    }
    case 'Add Role': {
      await promptAddRole();
      break;
    }
    case 'Add Employee': {
      await promptAddEmployee();
      break;
    }
    case 'Update Employee Role': {
      await promptUpdateEmployeeRole();
      break;
    }
    case 'Exit': {
      console.log('Goodbye!');
      process.exit(0);
    }
  }

  mainMenu();
}

async function promptAddDepartment() {
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ]);
  const department = await addDepartment(name);
  console.log('Department added:', department);
}

async function promptAddRole() {
  // Fetch current departments to show as choices
  const departments = await getDepartments();
  const departmentChoices = departments.map((dept: any) => ({
    name: dept.name,
    value: dept.id,
  }));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title for the role:',
    },
    {
      type: 'number',
      name: 'salary',
      message: 'Enter the salary for the role:',
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department for the role:',
      choices: departmentChoices,
    },
  ]);
  const role = await addRole(answers.title, answers.salary, answers.department_id);
  console.log('Role added:', role);
}

async function promptAddEmployee() {
  // Get roles and employees for choices
  const roles = await getRoles();
  const employees = await getEmployees();
  const roleChoices = roles.map((role: any) => ({
    name: role.title,
    value: role.id,
  }));
  const managerChoices = employees.map((emp: any) => ({
    name: `${emp.first_name} ${emp.last_name}`,
    value: emp.id,
  }));

  // Add an option for no manager
  managerChoices.unshift({ name: 'None', value: null });

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "Enter the employee's first name:",
    },
    {
      type: 'input',
      name: 'last_name',
      message: "Enter the employee's last name:",
    },
    {
      type: 'list',
      name: 'role_id',
      message: "Select the employee's role:",
      choices: roleChoices,
    },
    {
      type: 'list',
      name: 'manager_id',
      message: "Select the employee's manager:",
      choices: managerChoices,
    },
  ]);
  const employee = await addEmployee(
    answers.first_name,
    answers.last_name,
    answers.role_id,
    answers.manager_id
  );
  console.log('Employee added:', employee);
}

async function promptUpdateEmployeeRole() {
  const employees = await getEmployees();
  const roles = await getRoles();

  const employeeChoices = employees.map((emp: any) => ({
    name: `${emp.first_name} ${emp.last_name}`,
    value: emp.id,
  }));

  const roleChoices = roles.map((role: any) => ({
    name: role.title,
    value: role.id,
  }));

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee to update:',
      choices: employeeChoices,
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the new role:',
      choices: roleChoices,
    },
  ]);
  const updatedEmployee = await updateEmployeeRole(answers.employee_id, answers.role_id);
  console.log('Employee updated:', updatedEmployee);
}

mainMenu();
