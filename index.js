const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const analyzeRequest = require('./src/request-analyzer.js');

const port = 3000;

const app = express();
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('Hello, World!');
})

app.post('/api/analyze', (req, res) => {
    const requestPayload = req.body;
    const requestAnalyzed = analyzeRequest(requestPayload);
    if (!requestAnalyzed) {
        res.status(200).send({});
        return;
    }
    res.status(200).send(requestAnalyzed);
})

app.listen((process.env.PORT || port), () => {
    console.log(`App listening on port ${port}`);
})