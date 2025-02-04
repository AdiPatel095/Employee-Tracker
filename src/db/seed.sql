-- src/db/seed.sql

-- Seed departments
INSERT INTO department (name) VALUES 
('Engineering'),
('Finance'),
('Human Resources'),
('Sales');

-- Seed roles
INSERT INTO role (title, salary, department_id) VALUES 
('Software Engineer', 80000, (SELECT id FROM department WHERE name='Engineering')),
('Accountant', 60000, (SELECT id FROM department WHERE name='Finance')),
('HR Manager', 70000, (SELECT id FROM department WHERE name='Human Resources')),
('Sales Representative', 50000, (SELECT id FROM department WHERE name='Sales'));

-- Seed employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', (SELECT id FROM role WHERE title='Software Engineer'), NULL),
('Jane', 'Smith', (SELECT id FROM role WHERE title='Accountant'), NULL),
('Alice', 'Johnson', (SELECT id FROM role WHERE title='HR Manager'), NULL),
('Bob', 'Brown', (SELECT id FROM role WHERE title='Sales Representative'), NULL);
