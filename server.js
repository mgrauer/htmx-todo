const express = require('express');
const app = express();
const port = 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Define your endpoints here
app.get('/api/lists', (req, res) => {
    // Handle the GET request here
    const items = ['item_1', 'item_2', 'item_3'];
    const html = `${items.map(item => `<li>${item}</li>`).join('')}`;
    res.send(html);
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
