const postsRouter = require('express').Router()
const commentsRouter = require('../comments')
const db = require('../../data/db')

postsRouter.use('/:id/comments', commentsRouter)

//GET

postsRouter.get('/', async (req, res) => {
  try {
    const posts = await db.find();
    res.status(200).json({
      success: true, 
      posts
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'The posts information could not be retrieved.'
    });
  }
});
  
postsRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = (await db.findById(id))[0];
    if (!post) {
      res.status(404).json({ 
        success: false, 
        error: 'The post with the specified ID does not exist.'
      });
    } else {
      res.status(200).json({
        success: true,
        post
      })
    }
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'The post information could not be retrieved.' 
    });
  }
});

//POST

postsRouter.post('/', async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({
      success: false,
      error: 'Please provide title and contents for the post.'
    });
  }
  try {
    const { id } = await db.insert({ title, contents })
    const post = (await db.findById(id))[0]
    res.status(201).json({
      success: true,
      post
    })
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'An error occurred while saving the post to the database' 
    });
  }
});

//DELETE

postsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = (await db.findById(id))[0];
    if (!post) {
      res.status(404).json({
        success: false,
        error: 'The post with the specified ID does not exist.'
      })
    } else {
      await db.remove(id)
      res.status(202).json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ 
      success: false,
      error: 'The post could not be removed'
    });
  }
});

  
// PUT

postsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  if (!title || !contents) {
    return res.status(400).json({
      success: false,
      error: 'Please provide title and contents for the post.'
    })
  }
  try {
      const post = (await db.findById(id))[0]
      if (!post) {
        res.status(404).json({
          success: false,
          error: 'The post with the specified ID does not exist.'
        })
      } else {
        await db.update(id, { title, contents })
        const updated = (await db.findById(id))[0]
        res.status(200).json({
          success: true,
          post: updated
        })
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        error: 'The post information could not be modified'
      })
    }
})

module.exports = postsRouter