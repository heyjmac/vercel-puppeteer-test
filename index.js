import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use('/tmp', express.static(path.join(process.cwd(), 'tmp')));

app.get('/', async (req, res) => {
  try {
    const chromium = await import('chrome-aws-lambda');
    const puppeteerModule = await import('puppeteer-core');
    const puppeteer = puppeteerModule.default || puppeteerModule;
    const executablePath = await chromium.executablePath;
    if (!executablePath) {
      throw new Error(
        'Chromium executablePath is null. Vercel may not support chrome-aws-lambda in this environment.',
      );
    }
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');
    const title = await page.title();
    await browser.close();
    res.send(`<html><body><h1>Page title: ${title}</h1></body></html>`);
  } catch (error) {
    res.status(500).send(`<html><body><h1>Error: ${error.message}</h1></body></html>`);
  }
});

app.listen(3000, () => console.log('http://localhost:3000'));
