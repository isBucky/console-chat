'use strict';
require('dotenv').config();

const
  { compareSync: cs } = require('bcryptjs'),
  { color, banner } = require('./api'),
  { red, green } = require('chalk'),
  port = process.env.PORT || 3000,
  http = require('http');
  
const
  stream = process.stderr,
  server = http.createServer(),
  parser = require('socket.io-msgpack-parser'),
  socket = require('socket.io')(server, { parser }),
  log = (...txt) => console.log(...txt);
  
let messages = [];

socket.use((client, next) => {
  if (!process.env.password) {
    log(red(`  [!] Não foi definida nehuma senha no .env!`));
    let err = (new Error(`  [!] Servidor: Não foi definida nehuma senha no .env!`));
    err.data = 'Tente novamente.';
    return next(err);
  }
  
  let { password } = client.handshake.auth;
  if (!password || !cs(password, process.env.password)) {
    log(red(`  [?] Falha na autenticação, id: ${client.id}`));
    let err = (new Error(`Forneça uma senha valida para continuar!`));
    err.data = 'Tente novamente.';
    return next(err);
  }
  return next();
});

socket.on('connection', client => {
  log(green(`  [!] Conexão estabelecida, id: ${client.id}`));
  client.emit('requestUsername', null)
  client.on('username', username => {
    client.username = username;
    let obj = {
      username: client.username,
      id: client.id
    };
    
    socket.emit('entry', obj);
    if (messages.length) client.emit('loadMessages', messages);
    
    client.on('sendMessage', message => {
      messages.push(message);
      return socket.emit('message', message);
    });
    
    client.on('disconnect', () => {
      log(red(`  [!] Conexão fechada, id: ${client.id}`));
      return socket.emit('exit', obj);
    });
  });
});

server.listen(port, () => {
  console.clear(); banner();
  log(
    '     ', color('-'.repeat(20)),
    color(`Porta: ${port}`), color('-'.repeat(20))
  ); log(' ');
});