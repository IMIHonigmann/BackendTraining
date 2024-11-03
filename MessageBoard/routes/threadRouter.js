const { Router } = require('express')
const { getThreadById, getThreadByIdEJS, getAllThreads, renderForm } = require('../controllers/threadController')

const threadRouter = Router()


threadRouter.get('/new', renderForm)
threadRouter.get('/:threadId', getThreadByIdEJS)
threadRouter.get('/', getAllThreads)


module.exports = threadRouter