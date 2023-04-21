require('dotenv').config();
const PORT = process.env.PORT || 5000;

const express = require('express');
const path = require('path');
const cors = require('cors');

// db
const connectDB = require('./config/db');
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  cors({
    origin: ['http://localhost:5000'],
    credentials: true,
  })
);

// test

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// routes
app.get('/', async (req, res) => {
  res.send(`<h1>Ready to get started!</h1>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
