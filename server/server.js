const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3001;

const io = require('socket.io')(PORT);

let historyArr = [];

io.on('connection', socket => {

  console.log('Connected', socket.id);

  socket.on('chatter', (payload) => {
    historyArr.push(payload);
    let newPayload = {payload: payload, history: [...historyArr]};
    socket.broadcast.emit('incoming', newPayload);
  });

});
