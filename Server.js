const express = require('express');
var app = express();
app.use(express.static(__dirname));
const mongoose = require('mongoose');
var bodyParser = require('body-parser')
var http = require('http').Server(app);
const io = require('socket.io')(http);

var dbUrl = 'mongodb+srv://dbSasen:dbSasen@chatapp.zbnv8.mongodb.net/Chat_Data?retryWrites=true&w=majority'

io.on('connection', () =>{
    console.log('a user is connected')
})

mongoose.connect(dbUrl , (err) => { 
    console.log('mongodb connected',err);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Chat',{ name : String, message : String})

var server = app.listen(3000, () => {
    console.log('server is running on port', server.address().port);
})

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      io.emit('message', req.body);
      res.sendStatus(200);
    })
})
