import { PrismaClient } from '@prisma/client'
import express from 'express';
import readController from './controllers/readController'
const prisma = new PrismaClient()
const app = express();
const port = 3000;

app.use(express.json());
app.set('view engine', 'ejs')
app.set('views', './src/views')


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.get('/nigga', readController.ReadAll)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});