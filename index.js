const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
// const headers = require('./src/config/headers');
const { analyzeRequest } = require('./src/request-analyzer.js');

const port = 3000;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

const app = express();
// app.use(cors({ origin: true, credentials: true }));
// app.use(headers);
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
        res.end();
        return;
    }
    // console.log(requestAnalyzed);
    res.status(200).send(requestAnalyzed);
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})