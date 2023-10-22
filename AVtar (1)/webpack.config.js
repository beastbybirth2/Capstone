const path = require('path');

module.exports = {
  entry: {
    gameRaw: './public/js/gameRaw.js',
    chatTeacher: './public/js/chatTeacher.js',
    chatStudent: './public/js/chatStudent.js',
    // Add more entry points as needed
  },
  output: {
    filename: '[name]Bundle.js',
    path: path.resolve(__dirname, 'public/js')
  }
};
