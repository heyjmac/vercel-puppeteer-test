import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use('/tmp', express.static(path.join(process.cwd(), 'tmp')));

app.get('/', async (req, res) => {
  let browser;
  try {
    let puppeteer,
      launchOptions = { headless: true };
    if (process.env.VERCEL || process.env.VERCEL_ENV) {
      const chromium = (await import('@sparticuz/chromium')).default;
      puppeteer = (await import('puppeteer-core')).default;
      launchOptions = {
        ...launchOptions,
        args: chromium.args,
        executablePath: await chromium.executablePath(),
      };
    } else {
      puppeteer = (await import('puppeteer')).default;
    }
    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.goto('https://example.com', { waitUntil: 'networkidle2' });
    const title = await page.title();
    await browser.close();
    res.send(`<html><body><h1>Page title: ${title}</h1></body></html>`);
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).send(`<html><body><h1>Error: ${error.message}</h1></body></html>`);
  }
});

app.listen(3000, () => console.log('http://localhost:3000'));
