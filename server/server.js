const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3001;

const io = require('socket.io')(PORT);

let history = [];

io.on('connection', socket => {

  console.log('Connected', socket.id);

  socket.on('chatter', (payload) => {
    console.log('broadcast', payload);
    history.push(payload);
    console.log('history: ', history);
    let newPayload = {payload: payload, history: [...history]}
    socket.broadcast.emit('incoming', newPayload);
  });

  // do i need to make payload an object with .payload and .history?
  // Or can i handle that in the client state?
  // socket.on('chatter', (payload) => {
  //   console.log('broadcast', payload);
  //   history.push(payload);
  //   console.log('history: ', history);
  //   socket.broadcast.emit('incoming', payload);
  // });

});
