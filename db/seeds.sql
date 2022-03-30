INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Jackson', 'Norris', 1, 1),
    (2, 'John', 'Norris', 2, 1);

INSERT INTO roles (id, title, salary, department_id)
VALUES (1, 'CEO', '100000', '1'),
    (2, 'COO', '95000', '1');

INSERT INTO departments (id, name)
VALUES (1, 'Sales');