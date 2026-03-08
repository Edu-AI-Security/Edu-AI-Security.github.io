// simple express server to handle module access requests
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// store requests in a text file next to this script
const REQUEST_FILE = path.join(__dirname, 'module_requests.txt');

app.use(bodyParser.json());

app.post('/submit-request', (req, res) => {
    const { name, reason, module } = req.body || {};
    if (!name || !reason) {
        return res.status(400).send('missing fields');
    }
    let entry = '';
    if(module) entry += `Module: ${module}\n`;
    entry += `Name: ${name}\nReason: ${reason}\n--\n`;
    fs.appendFile(REQUEST_FILE, entry, (err) => {
        if (err) {
            console.error('failed to write request', err);
            return res.status(500).send('error');
        }
        res.send('ok');
    });
});

// serve static files (optional) if you want to run hexo in same server
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Request server listening on port ${PORT}`);
});
