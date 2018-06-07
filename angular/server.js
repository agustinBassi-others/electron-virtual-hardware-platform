//=======================[File description]=====================================

//=======================[Libraries requieres]==================================

'use strict';

const Required_App        = require('express')();
const Required_Http       = require('http').Server(Required_App);
const Required_SocketIo   = require('socket.io')(Required_Http);
const Required_SerialPort = require('serialport');

//=======================[Script constants]=====================================

const SERIAL_PORT        = '/dev/pts/6';
const SERIAL_BAUDRATE    = 115200;
const HTTP_PORT          = process.env.PORT || 3000;

const HTTP_RESPONSE_FILE = 'index.html';

const TAG_MSG_COMMAND    = 'command';
const TAG_MSG_CLOSE      = 'close';

//=======================[Script variables]=====================================

//=======================[Objects initialization]===============================

const Obj_ReadLine   = Required_SerialPort.parsers.Readline;
const Obj_Parser     = new Obj_ReadLine();
const Obj_SerialPort = new Required_SerialPort(SERIAL_PORT, { baudRate: SERIAL_BAUDRATE });

//=======================[Objects events]=======================================

Required_App.get     ('/', (req, res)        => Http_SendRequestToClient(req, res) );

Required_Http.listen (HTTP_PORT, ()          => Socket_CreateSocketListener() );

Required_SocketIo.on ('connection', (socket) => Socket_NewClientConnectedCallback(socket) );

Obj_SerialPort.on    ('open', ()             => Serial_OpenPort() );

Obj_SerialPort.on    ('data', (data)         => Serial_ReceiveDataCallback(data) );

Obj_SerialPort.on    ('close', ()            => Serial_ClosePort() );

//=======================[Function definitions]=================================

function Http_SendRequestToClient (req, res){
  console.log('[NORMAL] - Http_SendRequestToClient - Sending to client the HTML file: ' + HTTP_RESPONSE_FILE);
  res.sendfile(HTTP_RESPONSE_FILE);
}

function Socket_CreateSocketListener (){
  console.log(`[NORMAL] - Socket_CreateSocketListener - Socket server listening on port: ${HTTP_PORT}`);
}

function Socket_NewClientConnectedCallback (socket){
  console.log('[NORMAL] - Socket_NewClientConnectedCallback - New client connected');
  socket.on('message', (msg) => Socket_ReceiveDataCallback (msg));
}

function Socket_ReceiveDataCallback (msg) {
  console.log('[DEBUG] - Socket_ReceiveDataCallback - Message received from client: ' + msg + '\n\r');
  Serial_SendData (msg + '\n');
}

function Socket_SendDataToClient (messageTag, data){
  console.log('[DEBUG] - Socket_SendDataToClient - Sending to client. Tag: ' + messageTag + '. Data: ' + data);
  Required_SocketIo.sockets.emit(messageTag, data);
}

function Serial_OpenPort (){
  console.log('[NORMAL] - Serial_OpenPort - Port open at ' + SERIAL_PORT);
}

function Serial_ReceiveDataCallback (data){
  console.log('[DEBUG] - Serial_ReceiveDataCallback - Data received from serial: ' + data);
  Socket_SendDataToClient (TAG_MSG_COMMAND, data.toString());
}

function Serial_SendData (data){
  console.log('[DEBUG] - Serial_SendData - Sending data serial: ' + data);
  Obj_SerialPort.write(data);
}

function Serial_ClosePort(){
  console.log('[NORMAL] - Serial close - Closing serial port...');
  Socket_SendDataToClient (TAG_MSG_CLOSE, ' ');
}

//=======================[End of file]==========================================



// Initialize application constants








/*
'use strict';

// Initialize application constants
const app   = require('express')();
const http  = require('http').Server(app);
const io    = require('socket.io')(http);
const port  = process.env.PORT || 3000;

const SerialPort = require('serialport');
const Readline   = SerialPort.parsers.Readline;
const parser     = new Readline();

var SerialPath = '/dev/pts/6';

const serial = new SerialPort(SerialPath, {
  baudRate: 115200
});

//Setup a simple server

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

http.listen(port, () => {
  console.log(`[NORMAL] - HTTP Listen - Socket server listening on port: ${port}`);
});

//Socket.io stuff

io.on('connection', (socket) => {
  console.log('[NORMAL] - Socket connection - New client connected');

  socket.on('message', (msg) => {
    console.log('[DEBUG] - Socket receive - Message received from client: ' + msg + '\n\r');
    serial.write(msg + '\n');
  });
});

//Serialport stuff

serial.on('open', () => {
  console.log('[NORMAL] - Serial open - Port open at ' + SerialPath);
});

//EventListener to receive data from .ino script uploaded to Arduino.

serial.on('data', (data) => {
  var messageTag = 'command'

  console.log('[DEBUG] - Serial receive - Data received from serial: ' + data);
  console.log('[DEBUG] - Serial receive - Sending to client in tag (' + messageTag + ') the data: ' + data);
  io.sockets.emit(messageTag, data.toString());
});

serial.on('close', () => {
  console.log('[NORMAL] - Serial close - Closing serial port...');
  io.sockets.emit('close');
});
*/


/*
const path = require('path');
const express = require('express');
const http = require('http');
const SocketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = SocketIo.listen(server);

// settings

// routes
app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;
const parser = new Readline();

const mySerial = new SerialPort('/dev/pts/6', {
  baudRate: 115200
});

mySerial.pipe(parser);

mySerial.on('open', function () {
  console.log('Opened Port.');
});

mySerial.on('data', function (data) {
  // Print arrived data in console
  console.log("Received from serial port: " + data.toString());
  // Send arrived data to socket client
  io.emit('arduino:data',
    data.toString()
  );

  mySerial.flush(function(err,results){});

});

io.on('web:data', function(webData){
  mySerial.write(webData.toString());
  console.log("Received from client: " + webData.toString());
});

mySerial.on('err', function (data) {
  console.log(err.message);
});

server.listen(3000, () => {
  console.log('Server on port 3000');
});
*/



/*

// eslint-disable node/no-missing-require
'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require ('socket.io').listen(server);

// Use a Readline parser
const SerialPort = require('serialport');
const parsers = SerialPort.parsers;

// Use a `\r\n` as a line terminator
const parser = new parsers.Readline({
  delimiter: '\r\n'
});

const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 115200
});

port.pipe(parser);

port.on("open", function () {
  console.log('Emedded system connected');
});

port.on('data', function(data) {
    console.log(data.toString());
});

server.listen (8000, function(){
  console.log ("Server has started at port 8000");
});

*/
/*
//ORIGINAL

port.pipe(parser);

port.on('open', () => console.log('Port open'));

parser.on('data', console.log);

//port.write('ROBOT PLEASE RESPOND\n');

*/

/*

port.on('open', onOpen));
port.on('data', onData));

function onOpen(){
  console.log ("Emedded system connected");
}

function onData(data){
  console.log (data);
}
*/
