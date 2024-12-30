import multer from 'multer';
import * as path from 'jsr:@std/path';
import notifyBoth from '../utils/consoleFuncs.ts';
import createPathIfNotExists from '../utils/path.ts';
import InitializationError from '../utils/errors.ts';

const dirName = import.meta.dirname;
if (!dirName) {
  throw new InitializationError('dirname is not defined');
}
const uploadDir = path.join(dirName, '../../uploads');

createPathIfNotExists(uploadDir);
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '--' + file.originalname);
  },
});

const upload = multer({ storage: storage });
function giveUploadFeedback(req, res) {
  try {
    notifyBoth(req.file, res, 200);
  } catch {
    notifyBoth('File upload unsuccessful', res, 500);
  }
}

export const uploadMiddleware = [
  upload.single('file'),
  giveUploadFeedback,
];
