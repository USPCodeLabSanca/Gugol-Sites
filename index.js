const express = require('express');
const mongoose = require('mongoose');
const app = express();
require('dotenv').config()

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({extended: true}));

const PORT = 10323;

// Routes
app.use(require('./routes/user'));

console.log(process.env.CONN_STR);

mongoose.connect(process.env.CONN_STR, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    app.listen(PORT, () => {
        console.log(`App listening at http://localhost:${PORT}`);
    });
});