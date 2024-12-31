import multer from 'multer';
import * as path from 'jsr:@std/path';
import fs from 'node:fs';
import notifyBoth from '../utils/consoleFuncs.ts';
import createPathIfNotExists from '../utils/path.ts';
import InitializationError from '../utils/errors.ts';
import Prisma, { MimeType } from '@prisma/client';
const prisma = new Prisma.PrismaClient();

const dirName = import.meta.dirname;
if (!dirName) {
  throw new InitializationError('dirname is not defined');
}
const uploadDir = path.join(dirName, '../../uploads');

createPathIfNotExists(uploadDir);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function storeFileAtDB(req, res, next) {
  const email = 'test@example.com';
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  // TODO: Add user authentication
  // TODO: use the values of the authenticated user for looking up prisma folders
  // TODO: Add checking for the accessibility options (so users can only access folders where they have viewing rights)
  // TODO: Display bytes with mimetype image as images in HTML on a successful response
  // TODO: Add a route that downloads the bytes as a file with the original name and mimetype extension
  // TODO: (BONUS) Add the ability to add an array of objects

  if (!user) {
    notifyBoth(`User ${email} is not defined`, res, 404);
    return;
  }

  const formattedMimeType: MimeType = req.file.mimetype.toUpperCase().replace(
    /\//g,
    '_',
  );
  const storedFiles = await prisma.file.create({
    data: {
      fileName: req.file.originalname,
      folderLocation: '/uploads/sigma/ligma',
      mimeType: formattedMimeType,
      byteSize: BigInt(req.file.size),
      bytes: req.file.buffer,
      ownerId: user.id, // insert an arbitrary user until authentication is implemented
      fileAccessTo: 'PUBLIC',
    },
  });
  console.log(storedFiles);
  next();
}

function giveUploadFeedback(req, res) {
  try {
    notifyBoth(req.file, res, 200);
  } catch {
    notifyBoth('File upload unsuccessful', res, 500);
  }
}

export const uploadMiddleware = [
  upload.single('file'),
  storeFileAtDB,
  giveUploadFeedback,
];
