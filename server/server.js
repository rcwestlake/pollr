const express = require('express')
const app = express()
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const shortid = require('shortid')
require('dotenv').config()

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.locals.polls = [
  {
    uid: 'HyuueskOe',
    question: 'dinner?',
    options: ['burger', 'salad', 'pizza', 'tacos']
  },
  {
    uid: 'ye03830a3',
    question: 'bball?',
    options: ['basketball', 'golf', 'football', 'soccer']
  }
]
app.locals.users = []

app.set('port', process.env.PORT || 1111)
app.locals.title = 'Pollr' //change title if necessary

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/screens', 'home.html'));
})

app.get('/authkeys', (req, res) => {
  authId = process.env.AUTH0_CLIENT_ID
  authDomain = process.env.AUTH0_DOMAIN
  res.status(200).json({authId, authDomain})
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

app.get('/api/polls/:uid', (req, res) => {
  const { uid } = req.params
  const result = app.locals.polls.filter(poll => poll.uid == uid)[0]

  res.status(200).json(result)
})

app.get('/polls/:uid', (req, res) => {
  const { uid } = req.params

  const poll = app.locals.polls.filter(poll => poll.uid == uid)[0]
  res.sendFile(path.join(__dirname, '../public/screens', 'poll.html'));
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


const server = http.createServer(app)
                 .listen(app.get('port'), () => {
                    console.log(`Pollr listening on port ${app.get('port')}.`)
                  })

/* Websockets */

var socketIo = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('A user has connected', io.engine.clientsCount);
  io.sockets.emit('usersConnected', io.engine.clientsCount)

  socket.on('userVote', () => {
    socket.emit('voteMessage', 'You voted!')
  })

  socket.on('disconnect', () => {
    console.log('A user has disconnected', io.engine.clientsCount);
  })
})
