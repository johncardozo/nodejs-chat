// Libraries
var express = require('express');
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

// Create the app
var app = express();

// Setup socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Setup app
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// Define data model
var Message = mongoose.model('Message',{
  name : String,
  message : String
})

// Endpoint to get messages
app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

// Endpoint to create a message
app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

// Create a socket.io connection
io.on('connection', () =>{
  console.log('a user is connected')
})

// Connect to database
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect('mongodb://localhost:27017/chat',(err) => {
  console.log('mongodb connected',err);
})

// Execute the app
var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});