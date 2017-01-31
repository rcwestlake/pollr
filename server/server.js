const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

app.use(express.static('src')) //if you need static files, change this path
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 1111)
app.locals.title = 'Pollr' //change title if necessary

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../src', 'login.html'));
})

app.get('*', (req, res) => {
  res.send('page not found - try again')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
})
