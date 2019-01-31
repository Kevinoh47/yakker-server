const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

const PORT = process.env.PORT || 3001;

const io = require('socket.io')(PORT);

// don't reverse the history array in place. reverse the copy.
reverseChron = arr => {
  let reversedArr = [...arr].reverse();
  return reversedArr;
}



// turing namespace connection
const turing = io.of('/turing');
let turingHistArr = [];
turing.on('connection', socket => {

  console.log('Connected to turing', socket.id);

  socket.on('chatter', (payload) => {
    console.log('turing incoming payload: ', payload);
    console.log({turing});
    turingHistArr.push(payload);

    console.log('turing history: ', turingHistArr);

    let reversedArr = reverseChron(turingHistArr);
    let newPayload = {payload: payload, history: [...reversedArr]};
    turing.emit('incoming', newPayload); // todo broadcast.emit may not work with namespace
  });

});

// hopper namespace connection
const hopper = io.of('/hopper');
let hopperHistArr = [];
hopper.on('connection', socket => {

  // console.log({hopper});

  console.log('Connected to hopper', socket.id);

  socket.on('chatter', (payload) => {
    console.log('hopper incoming payload: ', payload);
    hopperHistArr.push(payload);

    console.log('hopper history: ', hopperHistArr);

    let reversedArr = reverseChron(hopperHistArr);
    let newPayload = {payload: payload, history: [...reversedArr]};
    hopper.emit('incoming', newPayload);
  });

});

// generic connection
let historyArr = [];
io.on('connection', socket => {

  console.log('Connected', socket.id);

  socket.on('chatter', (payload) => {
    console.log('generic payload: ', payload);
    historyArr.push(payload);
    let reversedArr = reverseChron(historyArr);
    let newPayload = {payload: payload, history: [...reversedArr]};
    socket.broadcast.emit('incoming', newPayload);
  });

});
