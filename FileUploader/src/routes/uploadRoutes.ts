import express from 'express';
import { uploadMiddleware } from '../controllers/uploadController.ts';
import Prisma from '@prisma/client';
import notifyBoth from '../utils/consoleFuncs.ts';
const uploadRouter = express.Router();
const prisma = new Prisma.PrismaClient();

uploadRouter.post(
  '/stats',
  uploadMiddleware,
);

uploadRouter.get('/:encodedFolderPath', async (req, res, _next) => {
  const { encodedFolderPath } = req.params;
  const folderPath = decodeURIComponent(encodedFolderPath);

  const owner = await prisma.user.findUnique({
    where: {
      email: 'test@example.com',
    },
  });

  if (!owner) {
    console.log('Owner is not defined');
    return;
  }

  console.log(folderPath);
  const folderFiles = await prisma.file.findMany({
    where: {
      // folderLocation: folderPath,
      ownerId: owner.id,
    },
  });

  const serializedFiles = folderFiles.map((file) => ({
    ...file,
    byteSize: file.byteSize.toString(),
  }));

  notifyBoth(
    JSON.stringify(serializedFiles.map((file) => file.fileName)),
    res,
    200,
  );
});

export default uploadRouter;
