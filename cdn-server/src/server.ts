import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'CDN Server Initialized' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, server };