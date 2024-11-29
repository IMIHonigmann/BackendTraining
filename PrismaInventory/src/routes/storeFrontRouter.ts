import express from "express";
const app = express.Router()
import readController from "../controllers/readController";

app.get('/', readController.ReadAll)
app.get('/createProduct', readController.RenderCreateProduct)
app.get('/changeProduct/:productId', readController.RenderChangeProduct)
app.get('/:productId', readController.DisplayProductWithId)

export default app