const express = require('express')
const app = express()
const path = require('path')
const port = 5555

let dir = path.join(__dirname, 'public');

app.use(express.static(dir));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})