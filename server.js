const express = require('express');
const server = express();
const postsRouter = require('./routes/posts')

server.use(express.json());
server.use('/api/posts', postsRouter)

server.get('/', (req, res) => {
  res.json({
    message: 'The posts have been retrieved'
  })
})

module.exports = server;
