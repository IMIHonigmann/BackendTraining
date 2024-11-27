import { PrismaClient } from '@prisma/client'
import express from 'express';
import productRouter from './routes/storeFront'
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

app.post('/filterCategories', readController.FilterCategories)

app.use('/nigga', productRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});