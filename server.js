require('dotenv').config()
const PORT = process.env.PORT || 3008;
const express = require('express')
const app = express();
const cors = require('cors');
const Router = require('./routes/route')

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.headers.host) {
        req.headers.host = 'accout-app-client.herokuapp.com'; // Replace with your own domain name
    }
    next();
});
app.use(express.json());
app.use(cors());

app.use('/api', Router)

app.listen(PORT, () => {
    console.log('起動しました')
})