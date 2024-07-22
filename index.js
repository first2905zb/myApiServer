const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

const app = express();

app.use(cors());
app.use(express.json());

app.get('/hello', (req, res) => {
    res.json({ msg: 'Hello World' });
});

app.get('/health/checkversion', (req, res) => {
    res.json({
        appversion,
        appUrl
    })
})

app.get('/health/foods', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM foods ORDER BY name ASC');
        res.json(results);
    } catch (err) {
        console.error('Error fetching foods data:', err);
        res.status(500).json({ error: 'Error fetching foods data ' });
    }
});

app.get('/health/bloodresult', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM bloodresult');
        res.json(results);
    } catch (err) {
        console.error('Error fetching blood results data:', err);
        res.status(500).json({ error: 'Error fetching blood results data' });
    }
});

app.post('/health/bloodresult', async (req, res) => {
    const values = [
        req.body.username,
        req.body.eGFR,
        req.body.height,
        req.body.weight,
        req.body.bpUp,
        req.body.bpDown,
        req.body.alb,
        req.body.na,
        req.body.k,
        req.body.po4,
        req.body.urine,
        req.body.date,
    ];
    try {
        const [result] = await pool.query(
            'INSERT INTO bloodresult (`username`, `eGFR`, `height`, `weight`, `bpUp`,`bpDown`, `alb`, `na`, `k`, `po4`, `urine`, `date`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
            values
        );
        res.status(200).json({ message: 'Data inserted successfully', data: values });
    } catch (err) {
        console.error('Error inserting blood result data:', err);
        res.status(500).json({ error: 'Error inserting blood result data' });
    }
});

app.post('/health/consumefood', async (req, res) => {
    const values = [
        req.body.username,
        req.body.cost,
        req.body.date,
    ];
    try {
        const [result] = await pool.query(
            'INSERT INTO consumefood (`username`,`cost`,`date`) VALUES (?, ?, ?)',
            values
        );
        res.status(200).json({ message: 'Data inserted successfully', data: values });
    } catch (err) {
        console.error('Error inserting consume food data:', err);
        res.status(500).json({ error: 'Error inserting consume food data' });
    }
});

app.get('/health/consumefood', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM consumefood');
        res.json(result);
    } catch (err) {
        console.log('Error fetching consumefood data', err);
        res.status(500).json({ error: 'Error fetching consumefood data' });
    }
});

app.get('/health/user', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM user');
        res.json(results);
    } catch (err) {
        console.error('Error fetching user data:', err);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});

app.post('/health/user', async (req, res) => {
    const values = [
        req.body.name,
        req.body.username,
        req.body.password,
        req.body.sex,
        req.body.age,
    ];
    try {
        const [result] = await pool.query(
            'INSERT INTO user (`name`,`username`,`password`,`sex`,`age`) VALUES (?,?,?,?,?)',
            values
        );
        res.status(200).json({ message: 'Data inserted successfully', data: values });
    } catch (err) {
        console.error('Error inserting user data:', err);
        res.status(500).json({ error: 'Error inserting user data' });
    }
});

app.post('/health/userprogram', async (req, res) => {
    const values = [
        req.body.username,
        req.body.pro,
        req.body.thPro,
        req.body.fullPro,
        req.body.quotaMin,
        req.body.quotaMax,
        req.body.startDate,
        req.body.endDate,
    ];
    try {
        const [result] = await pool.query(
            'INSERT INTO userprogram (`username`,`pro`,`thPro`,`fullPro`,`quotaMin`,`quotaMax`,`startDate`,`endDate`) VALUES (?,?,?,?,?,?,?,?)',
            values
        );
        res.status(200).json({ message: 'Data inserted successfully', data: values });
    } catch (err) {
        console.error('Error inserting user program data:', err);
        res.status(500).json({ error: 'Error inserting user program data' });
    }
});

app.get('/health/userprogram', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM userprogram');
        res.json(result);
    } catch (err) {
        console.error('Error fetching userprogram data:', err);
        res.status(500).json({ error: 'Error fetching userprogram data' });
    }
});

app.put('/health/user/:id', (req, res) => {
    const userId = req.params.id;
    const values = [
        req.body.name,
        req.body.username,
        req.body.password,
        userId
    ];
    pool.query(
        'UPDATE user SET name = ?, username = ?, password = ? WHERE id = ?',
        values,
        (err, result) => {
            if (err) {
                console.error('Error updating user data:', err);
                return res.status(500).json({ error: 'Error updating user data' });
            }
            res.status(200).json({ message: 'Data updated successfully', data: values });
        }
    );
});


const PORT = 2999 || 5000;
app.listen(PORT, () => {
    console.log(`CORS-enabled web server listening on port ${PORT}`);
});
