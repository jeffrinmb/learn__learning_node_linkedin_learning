const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

mongoose.Promise = Promise;
const dbUrl = `mongodb+srv://${process.env.MONGO_DB_USER_NAME}:${process.env.MONGO_DB_USER_PASSWORD}@cluster0.fferj.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

const Message = mongoose.model('Message', {
  name: String,
  message: String,
});

app.get('/messages', (req, res) => {
  Message.find({}, (err, messages) => {
    if (err) {
      res.sendStatus(500);
    }
    res.send(messages);
  });
});

app.post('/messages', (req, res) => {
  const message = new Message(req.body);
  // message.save((err) => {
  //   if (err) {
  //     res.sendStatus(500);
  //   }
  //   io.emit('message', req.body);
  //   res.sendStatus(200);
  // });
  message.save()
    .then(() => {
      console.log('Saved');
      return Message.findOne({ message: 'badword' });
    })
    .then((censoredWord) => {
      if (censoredWord) {
        console.log('Censored Words Found', censoredWord);
        return Message.remove({ _id: censoredWord.id });
      }
      io.emit('message', req.body);
      res.sendStatus(200);
      return console.log('Returned Success');
    })
    .catch((err) => {
      res.sendStatus(500);
      return console.error(err);
    });
});

io.on('connection', (socket) => { // eslint-disable-line
  console.log('A User Connected!');
});

mongoose.connect(dbUrl, (err) => {
  if (err) {
    console.log('Mongo DB Connection Error', err);
  } else {
    console.log('Mongo DB Connection Successful');
  }
});

const server = http.listen(3000, () => {
  console.log('Server is listening on Port', server.address().port);
});
