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
    id: 1,
    question: 'dinner?'
  },
  {
    id: 2,
    question: 'bball?'
  }
]

app.locals.options = [
  {
    id: 1,
    poll_id: 1,
    text: 'burger'
  },
  {
    id: 2,
    poll_id: 1,
    text: 'pizza'
  },
  {
    id: 3,
    poll_id: 1,
    text: 'salad'
  },
  {
    id: 4,
    poll_id: 1,
    text: 'tacos'
  },
  {
    id: 5,
    poll_id: 2,
    text: 'baseball'
  },
  {
    id: 6,
    poll_id: 2,
    text: 'basketball'
  },
  {
    id: 7,
    poll_id: 2,
    text: 'soccer'
  },
  {
    id: 8,
    poll_id: 2,
    text: 'football'
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

app.get('/api/polls', (req, res) => {
  res.status(200).json(app.locals.polls)
})

app.post('/api/polls', (req, res) => {
  const { question } = req.body
  const id = app.locals.polls.length + 1
  app.locals.polls.push({ id, question })
  res.status(200).json({ id, question })
})

app.get('/api/polls/:id', (req, res) => {
  const { id } = req.params
  const result = app.locals.polls.filter(poll => poll.id == id)[0]

  res.status(200).json(result)
})

app.get('/polls/:uid', (req, res) => {
  const { uid } = req.params

  const poll = app.locals.polls.filter(poll => poll.uid == uid)[0]
  res.sendFile(path.join(__dirname, '../public/screens', 'poll.html'));
})

app.get('/api/options', (req, res) => {
  res.status(200).json(app.locals.options)
})

app.post('/api/options', (req, res) => {
  const { id, options } = req.body
  console.log(options[0]);
  const poll_id = id
  options.map(option => {
    const id = app.locals.options.length + 1
    app.locals.options.push({ id, poll_id, text: option })
  })

  res.status(200).json(app.locals.options)
})

app.get('/api/options/:id', (req, res) => {
  const { id } = req.params
  const optionsById = app.locals.options.filter(option => option.poll_id == id)
  res.status(200).json(optionsById)
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

  socket.on('userVote', (id, name) => {
    //thing that was clicked on
    //who clicked on it
    //send it to everyone
    socket.emit('userMessage', 'You voted!')
    io.sockets.emit('voteMessage', id, 'Click on by' + name)
  })

  socket.on('disconnect', () => {
    console.log('A user has disconnected', io.engine.clientsCount);
  })
})
