import express from "express";
const app = express.Router()
import readController from "../controllers/readController";

app.get('/', readController.ReadAll)
app.get('/createCategory', readController.ShowCreateCategoryForm)
app.get('/:productId', readController.DisplayProductWithId)

export default app