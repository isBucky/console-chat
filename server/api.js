const
  chalk = require('chalk'),
  gradient = require('gradient-string');
  
module.exports = {
  banner,
  color,
  randomColor
};

function banner() {
  return console.log(color([
    ' ',
    ' ',
    '     █████████                                                   ',
    '    ███░░░░░███                                                  ',
    '   ░███    ░░░   ██████  ████████  █████ █████  ██████  ████████ ',
    '   ░░█████████  ███░░███░░███░░███░░███ ░░███  ███░░███░░███░░███',
    '    ░░░░░░░░███░███████  ░███ ░░░  ░███  ░███ ░███████  ░███ ░░░ ',
    '    ███    ░███░███░░░   ░███      ░░███ ███  ░███░░░   ░███     ',
    '   ░░█████████ ░░██████  █████      ░░█████   ░░██████  █████    ',
    '    ░░░░░░░░░   ░░░░░░  ░░░░░        ░░░░░     ░░░░░░  ░░░░░     ',
    ' ',
    '                       Criado por @bucky.br',
    ' ',
    ' '
  ].join('\n')));
}

function color(text = '\u200B') {
  return chalk.bold(gradient(randomColor(), randomColor())(text));
}

function randomColor() {
  let arr = ['#87CEFA', '#87CEEB', '#00FFFF'];
  return arr[Math.floor(Math.random() * arr.length)];
}