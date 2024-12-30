import express from 'express';
import Prisma from '@prisma/client';
import * as path from 'jsr:@std/path';
import uploadRouter from './routes/uploadRoutes.ts';
import InitializationError from './utils/errors.ts';

const prisma = new Prisma.PrismaClient();

function init() {
  const dirName = import.meta.dirname;
  if (!dirName) {
    throw new InitializationError('dirname is not defined');
  }
  const app = express();
  const PORT = Deno.env.get('PORT');
  const env = Deno.env.get('NODE_ENV');

  app.use(
    '/public',
    express.static(path.join(dirName, '../public')),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/upload', uploadRouter);

  // TODO: go through the project requirements

  app.listen(PORT, () => {
    console.log(`Server running in ${env} mode at http://localhost:${PORT}`);
  });
}

(async () => {
  try {
    init();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
