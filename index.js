//set up an express app for user

const path = require('path');
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('frontend/build'));
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/api/pirates/:id', (req, res) => {
    const id = req.params.id;
    const pirate = getPirate(id);
    if (!pirate) {
        res.status(404).send({ error: `Pirate ${id} not found` });
    } else {
        res.send({ data: pirate });
    }
});
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});