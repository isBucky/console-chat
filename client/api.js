const
  gradient = require('gradient-string'),
  chalk = require('chalk');

module.exports = {
  sendMessage,
  banner,
  color,
  randomColor
};

function sendMessage(message, rl) {
  let { author, id, content } = message;
  
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(color(`  [${author}]:`), chalk.white(content));
  return rl.prompt(true);
}

function banner() {
  return console.log(color([
    '        █████████  █████   █████   █████████   ███████████',
    '       ███░░░░░███░░███   ░░███   ███░░░░░███ ░█░░░███░░░█',
    '      ███     ░░░  ░███    ░███  ░███    ░███ ░   ░███  ░ ',
    '     ░███          ░███████████  ░███████████     ░███    ',
    '     ░███          ░███░░░░░███  ░███░░░░░███     ░███    ',
    '     ░░███     ███ ░███    ░███  ░███    ░███     ░███    ',
    '      ░░█████████  █████   █████ █████   █████    █████   ',
    '       ░░░░░░░░░  ░░░░░   ░░░░░ ░░░░░   ░░░░░    ░░░░░    ',
    ' ',
    '                   Criado por @bucky.br',
    ' ',
    ' '
  ].join('\n')));
}

function color(text) {
  return chalk.bold(gradient(randomColor(), randomColor())(text));
}

function randomColor() {
  let arr = ['#87CEFA', '#87CEEB', '#00FFFF'];
  return arr[Math.floor(Math.random() * arr.length)];
}