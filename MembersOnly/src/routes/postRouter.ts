import express from 'express';
import { deletePost } from '../controllers/posts/deletePostController';
import { createPost } from '../controllers/posts/postController';
import { authenticateJWT } from '../middlewares/auth.middleware';
const postRouter = express.Router();

postRouter.get('/addPost', authenticateJWT,
    async (req, res) => {
        res.render('sendMessage', {})
    })

postRouter.post('/addPost', authenticateJWT, createPost)

postRouter.get('/delete/:postId', authenticateJWT, deletePost)

export default postRouter