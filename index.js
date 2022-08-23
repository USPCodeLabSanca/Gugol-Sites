const express = require('express');
const app = express();

app.use(express.static('public'));

const PORT = 10323;

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`)
});