import express from 'express';
import { uploadMiddleware } from '../controllers/uploadController.ts';
const uploadRouter = express.Router();

uploadRouter.post(
  '/stats',
  uploadMiddleware,
);

export default uploadRouter;
