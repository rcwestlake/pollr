const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const shortid = require('shortid')

app.use(express.static('public')) //if you need static files, change this path
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.locals.polls = []
app.locals.users = []

app.set('port', process.env.PORT || 1111)
app.locals.title = 'Pollr' //change title if necessary

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/screens', 'home.html'));
})

app.get('/polls', (req, res) => {
  res.status(200).json(app.locals.polls)
})

app.post('/polls', (req, res) => {
  const { question, options } = req.body
  const uid = shortid.generate()
  app.locals.polls.push({ uid, question, options })
  res.status(200).json({ uid, question, options })
})

app.get('/polls/:uid', (req, res) => {
  const { uid } = req.params

  const poll = app.locals.polls.filter(poll => poll.uid == uid)[0]
  res.status(200).json({ poll })
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/screens', 'login.html'));
})

app.post('/login', (req, res) => {
  const { profile } = req.body
  const nickname = profile.nickname
  const img = profile.picture
  app.locals.users.push({ nickname, img })
  res.status(200).json(app.locals.users)
})

app.get('*', (req, res) => {
  res.send('page not found - try again')
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`);
})
