const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Define your endpoints here
app.get('/', (req, res) => {
    res.send('Hello, htmx!');
});

app.post('/data', (req, res) => {
    // Handle the POST request here
    res.send('Received POST request');
});

app.get('/data', (req, res) => {
    // Handle the GET request here
    res.send('Received GET request');
});

app.get('/api/lists', (req, res) => {
    // Handle the GET request here
    res.send('lists of todos');
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
