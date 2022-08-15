<<<<<<< HEAD
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

app.get('/messages/:user', (req, res) => {
  const user = req.params.user;
  Message.find({ name: user }, (err, messages) => {
    if (err) {
      res.sendStatus(500);
    }
    res.send(messages);
  });
});

// eslint-disable-next-line consistent-return
app.post('/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    console.log('Saved');
    const censoredWord = await Message.findOne({ message: 'badword' });
    if (censoredWord) {
      await Message.deleteOne({ _id: censoredWord.id });
    } else {
      io.emit('message', req.body);
    }
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
    return console.error(error);
  } finally {
    console.log('Message Post Called');
  }
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
>>>>>>> 0776e3cbd7070f5f137f1bb3b46edb80c057c749
