const express = require('express')
const app = express()
const path = require('path')
const controller = require('./controllers/queryController')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('views', path.join(__dirname, 'views'))
app.set("view engine", "ejs")

app.get('/delete', controller.deleteAll)
app.get('/showall', controller.getUsernames)
app.get('/searchResults', controller.searchFor)
app.get('/insertoffensive', controller.createUsernameGet)
app.get('/search', controller.openSearchPage)
app.get('/', controller.getUsernames)

const PORT = 3000
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`))