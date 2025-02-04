// src/db/index.ts
import { pool } from './connection.js';

export const getDepartments = async () => {
  const res = await pool.query('SELECT * FROM department');
  return res.rows;
};

export const getRoles = async () => {
  const res = await pool.query(`
    SELECT r.id, r.title, r.salary, d.name AS department
    FROM role r
    JOIN department d ON r.department_id = d.id
  `);
  return res.rows;
};

export const getEmployees = async () => {
  const res = await pool.query(`
    SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title, 
      d.name AS department, 
      r.salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN employee m ON e.manager_id = m.id
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
  `);
  return res.rows;
};

export const addDepartment = async (name: string) => {
  const res = await pool.query(
    'INSERT INTO department (name) VALUES ($1) RETURNING *',
    [name]
  );
  return res.rows[0];
};

export const addRole = async (title: string, salary: number, department_id: number) => {
  const res = await pool.query(
    'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
    [title, salary, department_id]
  );
  return res.rows[0];
};

export const addEmployee = async (
  first_name: string,
  last_name: string,
  role_id: number,
  manager_id: number | null
) => {
  const res = await pool.query(
    'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
    [first_name, last_name, role_id, manager_id]
  );
  return res.rows[0];
};

export const updateEmployeeRole = async (employee_id: number, role_id: number) => {
  const res = await pool.query(
    'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *',
    [role_id, employee_id]
  );
  return res.rows[0];
};
