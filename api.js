const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
// app.use(cors());
const allowedOrigins = ['http://localhost:3001'];


const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())



const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "webmobi",
  });

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});




app.get('/api/users', (req, res) => {
    connection.query('SELECT * FROM qr_codes', (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(results);
    });
  });
  

  app.post('/api/users', (req, res) => {
    const { id, content, scan_date, thumbnail } = req.body; // Assuming you're sending JSON data
  console.log(req.body)

    if (!req.body) {
      res.status(400).json({ error: 'Name and email are required' });
      return;
    }
  
    connection.query('INSERT INTO qr_codes (id, content, scan_date, thumbnail) VALUES (?, ?, ?, ?)', [id, content, scan_date, thumbnail], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: results.insertId });
    });
  });



  app.delete('/api/users/:id', (req, res) => {
    const userId = req.params.id;
  
    connection.query('DELETE FROM qr_codes WHERE id = ?', [userId], (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: `User with ID ${userId} deleted` });
    });
  });

  
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.use(express.json());
