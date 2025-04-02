require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Check MySQL Connection
db.connect((err) => {
    if (err) {
        console.error('Database Connection Failed:', err);
    } else {
        console.log('✅ Connected to MySQL Database');
    }
});

// Root Route
app.get("/", (req, res) => {
    res.send("Welcome to the DreamHome API!");
});

// 🔹 1. Get All Branches
app.get('/branches', (req, res) => {
    const query = 'SELECT * FROM Branch';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching branches:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// 🔹 2. Add a New Branch
app.post('/branches', (req, res) => {
    const { branchNo, street, city, postcode } = req.body;
    const query = 'INSERT INTO Branch (branchNo, street, city, postcode) VALUES (?, ?, ?, ?)';
    db.query(query, [branchNo, street, city, postcode], (err, result) => {
        if (err) {
            console.error('Error adding branch:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Branch added successfully', branchId: result.insertId });
        }
    });
});

// 🔹 3. Get All Staff Members
app.get('/staff', (req, res) => {
    const query = 'SELECT * FROM Staff';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching staff:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// 🔹 4. Add a New Staff Member
app.post('/staff', (req, res) => {
    const { staffNo, fName, lName, position, salary, branchNo } = req.body;
    const query = 'INSERT INTO Staff (staffNo, fName, lName, position, salary, branchNo) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [staffNo, fName, lName, position, salary, branchNo], (err, result) => {
        if (err) {
            console.error('Error adding staff:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Staff added successfully', staffId: result.insertId });
        }
    });
});

// 🔹 5. Get All Properties
app.get('/properties', (req, res) => {
    const query = 'SELECT * FROM Property';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching properties:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// 🔹 6. ✅ FIXED: Get a Single Property by propertyNo
app.get('/properties/:propertyNo', (req, res) => {
    const { propertyNo } = req.params;
    const query = 'SELECT * FROM Property WHERE propertyNo = ?';

    db.query(query, [propertyNo], (err, results) => {
        if (err) {
            console.error('Error fetching property:', err);
            res.status(500).json({ error: 'Database error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Property not found' });
        } else {
            res.json(results[0]); // Return single property
        }
    });
});

// 🔹 7. Add a New Property
app.post('/properties', (req, res) => {
    const { propertyNo, street, city, postcode, type, rooms, rent, ownerNo, staffNo, branchNo } = req.body;
    const query = 'INSERT INTO Property (propertyNo, street, city, postcode, type, rooms, rent, ownerNo, staffNo, branchNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [propertyNo, street, city, postcode, type, rooms, rent, ownerNo, staffNo, branchNo], (err, result) => {
        if (err) {
            console.error('Error adding property:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Property added successfully', propertyId: result.insertId });
        }
    });
});

// 🔹 8. Get All Clients
app.get('/clients', (req, res) => {
    const query = 'SELECT * FROM Client';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching clients:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});

// 🔹 9. Add a New Client
app.post('/clients', (req, res) => {
    const { clientNo, fName, lName, telNo, prefType, maxRent, regBranchNo, regStaffNo } = req.body;
    const query = 'INSERT INTO Client (clientNo, fName, lName, telNo, prefType, maxRent, regBranchNo, regStaffNo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [clientNo, fName, lName, telNo, prefType, maxRent, regBranchNo, regStaffNo], (err, result) => {
        if (err) {
            console.error('Error adding client:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Client added successfully', clientId: result.insertId });
        }
    });
});

// 🔹 10. Delete a Property
app.delete('/properties/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Property WHERE propertyNo = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting property:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Property deleted successfully' });
        }
    });
});

// 🔹 11. Delete a Staff Member
app.delete('/staff/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Staff WHERE staffNo = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting staff:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Staff deleted successfully' });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
