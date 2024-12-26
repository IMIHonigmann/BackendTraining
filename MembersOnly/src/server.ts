import init from "./app";

const PORT = process.env.PORT || 3000;
init().then(app => {
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
});