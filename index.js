import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use('/tmp', express.static(path.join(process.cwd(), 'tmp')));

app.get('/', (req, res) => {
  res.send(
    `<!DOCTYPE html><html><head><title>Hello</title></head><body><h1>Hello World</h1></body></html>`,
  );
});

app.listen(3000, () => console.log('http://localhost:3000'));
