const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(express.static('src')) //if you need static files, change this path
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 3001)
app.locals.title = 'Pollr' //change title if necessary

app.get('/polls', (request, response) => {
  response.sendFile('src/')
})

app.get('*', (request, response) => {
  response.send('page not found - try again')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
})
