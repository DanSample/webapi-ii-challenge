const express = require('express');
const db = require('./data/db');
const server = express();

server.use(express.json());

//POST

server.post('/api/posts', async (req, res) => {
  const { title, contents } = req.body;
  try {
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

server.post('/api/posts/:id/comments', async (req, res) => {
  const postId = req.params.id;
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({
      success: false,
      errorMessage: 'Please provide text for the comment.'
    });
  }
  try {
    const post = (await db.findById(postId))[0];
    if (!post) {
      res.status(404).json({
        success: false,
        message: 'The post with the specified ID does not exist.'
      });
    } else {
      const { id } = await db.insertComment({ text, post_id: postId });
      const comment = (await db.findCommentById(id))[0];
      res.status(201).json({ success: true, comment });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'There was an error while saving the comment to the database',
      err
    });
  }
});

//GET

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

server.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db.findById(id);
    if (id) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: 'The post information could not be retrieved.', err });
  }
});

server.get('/api/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db.findCommentById(id);
    if (id) {
      res.status(200).json(post);
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: 'The post information could not be retrieved.', err });
  }
});

//DELETE

server.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const postId = await db.remove(id);
    if (postId) {
      res.status(200).end();
    } else {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: 'The post information could not be retrieved.', err });
  }
});

//PUT

// server.put('/api/posts/:id', async (req, res) => {
//   const { id } = req.params;
//   const { title, contents } = req.body;
//   const comment = req.body;
//   try {
//     const post = await db.insertComment(comment)

//   }
// });

module.exports = server;
