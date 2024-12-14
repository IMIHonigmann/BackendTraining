import express from 'express';

const app = express();

app.use(express.json());

// Define your routes here
app.get('/', (req, res) => {
    res.send('Welcome to the Prisma App!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});