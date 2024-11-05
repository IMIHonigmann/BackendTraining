const express = require("express");
const { body, validationResult } = require("express-validator");
const app = express();
const dotenv = require("@dotenvx/dotenvx")
const path = require("path")
const db = require("./db")
const authorRouter = require("./routes/authorRouter")
const threadRouter = require("./routes/threadRouter")
const { openThread, openUser } = require("./controllers/threadController")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => res.send("Hello, world!"))
app.get("/avdol", (req, res) => res.sendFile(path.join(__dirname, "pages", "fuckyou.html")))
app.get("/currenthotshit", (req, res) => res.sendFile)

app.use("/authors", authorRouter)
app.use("/home", threadRouter)
app.post('/new', openThread);
app.post('/create', openUser);

const PORT = process.env.LIGMA;
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`)
})
