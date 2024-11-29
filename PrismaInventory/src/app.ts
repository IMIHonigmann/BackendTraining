import express from 'express';
import productRouter from './routes/storeFrontRouter'
import readController from './controllers/readController'
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.set('view engine', 'ejs')
app.set('views', './src/views')


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/filterCategories', readController.FilterCategories)
app.post('/insertNewProduct', readController.CreateProduct)
app.post('/changeProduct', readController.ChangeProduct)
app.use('/homer', productRouter)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});