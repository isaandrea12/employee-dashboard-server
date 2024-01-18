const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000; 

app.use(express.json());
app.use(cors());

// Set up MySQL connection
const connection = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: 'password', 
    database: 'giraffe'
  });

  connection.connect(error => {
    if (error) {
      console.error('Error connecting: ' + error.stack);
      return;
    }
    console.log('Connected as id ' + connection.threadId);
  });

  app.get('/', (req, res) => {
    res.send('This is data from the server.');
  });

  // Define a GET endpoint that retrieves all employees
  app.get('/getAllEmployees', (req, res) => {
    connection.query('SELECT * FROM employee', (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).send('Error in fetching records');
        return;
      }
      res.json(results);
    });
  });

  // Define a GET endpoint that retrieves all branches
  app.get('/getAllBranches', (req, res) => {
    connection.query('SELECT * FROM branch', (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).send('Error in fetching records');
        return;
      }
      res.json(results);
    });
  });

  // Define a GET endpoint that retrieves all clients
  app.get('/getAllClients', (req, res) => {
    connection.query('SELECT * FROM client', (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).send('Error in fetching records');
        return;
      }
      res.json(results);
    });
  });
  
  // Define a GET endpoint that retrieves works with
  app.get('/getWorksWith', (req, res) => {
    connection.query('SELECT * FROM works_with', (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).send('Error in fetching records');
        return;
      }
      res.json(results);
    });
  });

  // Define a GET endpoint that retrieves branch suppliers
  app.get('/getBranchSuppliers', (req, res) => {
    connection.query('SELECT * FROM branch_supplier', (error, results) => {
      if (error) {
        console.log(error)
        res.status(500).send('Error in fetching records');
        return;
      }
      res.json(results);
    });
  });

  // Define a POST endpoint that creates a new employee
  app.post('/createEmployee', (req, res) => {
    const { emp_id, first_name, last_name, birth_day, sex, salary, super_id, branch_id } = req.body;
    const query = `
        INSERT INTO employee (emp_id, first_name, last_name, birth_day, sex, salary, super_id, branch_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    connection.query(query, [emp_id, first_name, last_name, birth_day, sex, salary, super_id, branch_id], (error, results) => {
        if (error) {
            console.error('Error occurred:', error);
            res.status(500).send('Failed to create new employee');
            return;
        }
        res.status(201).send(`Employee created with ID: ${emp_id}`);
    });
});

// Define a PUT endpoint for updating an employee
app.put('/updateEmployee/:empId', (req, res) => {
  const empId = req.params.empId;
  const { first_name, last_name, birth_day, sex, salary, super_id, branch_id } = req.body;

  const query = `
      UPDATE employee 
      SET first_name = ?, last_name = ?, birth_day = ?, sex = ?, salary = ?, super_id = ?, branch_id = ?
      WHERE emp_id = ?
  `;

  connection.query(query, [first_name, last_name, birth_day, sex, salary, super_id, branch_id, empId], (error, results) => {
      if (error) {
          console.error('Error occurred:', error);
          res.status(500).send('Failed to update employee');
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).send('Employee not found');
      } else {
          res.send(`Employee with ID ${empId} updated successfully`);
      }
  });
});

// Define a DELETE endpoint that deletes an employee
app.delete('/deleteEmployee/:empId', (req, res) => {
  const empId = req.params.empId;
  

  const query = 'DELETE FROM employee WHERE emp_id = ?';

  connection.query(query, [empId], (error, results) => {
      if (error) {
          console.error('Error occurred:', error);
          res.status(500).send('Failed to delete employee');
          return;
      }
      if (results.affectedRows === 0) {
          res.status(404).send('Employee not found');
      } else {
          res.send(`Employee with ID ${empId} deleted successfully`);
      }
  });
});
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
   