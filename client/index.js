const
  parser = require('socket.io-msgpack-parser'),
  gradient = require('gradient-string'),
  socket = require('socket.io-client');
  
const
  readline = require('readline'),
  { red, green, white, yellow } = require('chalk'),
  { color, banner, sendMessage } = require('./api.js');

const
  stream = process.stderr,
  log = (...txt) => console.log(...txt),
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: color(`  [você]: `),
    terminal: false,
  }),
  io = socket('ws://localhost:3000', {
    parser,
    auth: {
      password: 'senha'
    }
  });
  
io.on('connect', () => 
  io.on('requestUsername', async() => {
    console.clear(); banner();
    rl.question(color('  Escolha um nome qualquer: '), username => {
      if (!username.length) username = 'Anônimo';
      if (username.length > 10) username = username.substr(0, 10);
      io.emit('username', username);
      
      console.clear(); banner();
      log(' '.repeat(5),
        color('-'.repeat(20)),
        color('Mensagens'),
        color('-'.repeat(20)),
      ); log(' ');
      
      io.on('loadMessages', messages => {
        if (!messages.length) return;
        return messages.forEach(message => sendMessage(message, rl));
      });
      
      io.on('message', message => {
        let { author, id } = message;
        if (id == io.id) return;
        return sendMessage(message, rl);
      });
      rl.prompt(true);
      
      rl.on('line', message => {
        if (!message || !message.length) return;
        let messageObject = {
          author: username,
          id: io.id,
          content: message
        };
        io.emit('sendMessage', messageObject);
        return rl.prompt(true);
      });
      
      io.on('entry', member => {
        let { username, id } = member;
        if (id == io.id) return;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        log(yellow('  [sistema]:'), green(`O membro ${username} entrou no chat.`));
        return rl.prompt(true);
      });
      
      io.on('exit', member => {
        let { username, id } = member;
        if (id == io.id) return;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        log(yellow('  [sistema]:'), red(`O membro ${username} saiu do chat.`));
        return rl.prompt(true);
      });
    });
  })
);

io.on('connect_error', err => log(red(err.message)));
