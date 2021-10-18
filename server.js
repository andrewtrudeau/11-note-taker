// Import express package
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, '/db/db.json');

let getDB = () => JSON.parse(fs.readFileSync(dbPath));

let saveDB = (json) => fs.writeFile(dbPath, json, err => { err ? console.error(err) : console.log('Database Saved!'); });


// Require the JSON file and assign it to a variable called `termData`
const PORT = 5296;

// Initialize our app variable by setting it to the value of express()
const app = express();

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, '/public/assets')))

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

app.get('/api/notes', (req, res) => res.json(getDB()));

app.post('/api/notes', (req, res) => {
    let json = getDB();
    let data = req.body;
    data.id = uuidv4();
    json.push(req.body);
    saveDB(JSON.stringify(json));
    res.redirect('/notes')
});

app.delete('/api/notes/:id', (req, res) => {
    let json = getDB();
    let data = json.find(e => e.id === req.params.id);
    json.splice(json.indexOf(data), 1);

    saveDB(JSON.stringify(json));
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.listen(process.env.PORT || PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
