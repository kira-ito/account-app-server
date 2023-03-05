require('dotenv').config()
const PORT = process.env.PORT || 3008;
const express = require('express')
const app = express();
const cors = require('cors');
const Router = require('./routes/route')

app.use(express.json());
app.use(cors());

app.use('/api', Router)

app.listen(PORT, () => {
    console.log('起動しました')
})