const express = require('express');
const db = require('./data/db');
const server = express();

server.use(express.json());

server.post('/api/posts', async (req, res) => {
  const { title, contents } = req.body;
  try {
    // const post = await db.find(title, contents);

    if (!title || !contents) {
      res.status(400).json({
        errorMessage: 'Please provide title and contents for the post.'
      });
    } else {
      db.insert({ title, contents });
      res.status(201).json({ title, contents });
    }
  } catch (err) {
    res.status(500).json({ success: false, err });
  }
});

server.get('/api/posts', async (req, res) => {
  try {
    const posts = await db.find(req.body);
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ error: 'The posts information could not be retrieved.', err });
  }
});

module.exports = server;

// server.get('/api/posts', async (req, res) => {
//   try {
//     const posts = await db.find(req.body);
//     res.status(200).json(posts);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ error: 'The posts information could not be retrieved.', err });
//   }
// });
