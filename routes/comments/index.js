const commentsRouter = require('express').Router({ mergeParams: true })
const db = require('../../data/db.js');


//GET

commentsRouter.get('/', async (req, res) => {
  const postId = req.params.id;
  try {
    const post = (await db.findById(postId))[0];
    if (!post) {
      res.status(404).json({
          success: false,
          error: 'The post with the specified ID does not exist'
      });
    } else {
      const comments = await db.findPostComments(postId)
      res
        .status(200)
        .json({ 
          success: true,
          comments 
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: 'The post information could not be retrieved.', err });
  }
});

//POST

commentsRouter.post('/', async (req, res) => {
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

module.exports = commentsRouter;