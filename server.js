const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle recipe routes
app.get('/recipes/:category/:recipe', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'recipes', req.params.category, req.params.recipe);
    res.sendFile(filePath);
});

// Handle category pages
app.get('/pages/:page', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'pages', req.params.page);
    res.sendFile(filePath);
});

// Handle home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 