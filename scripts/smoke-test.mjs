import puppeteer from 'puppeteer';

const urls = ['http://localhost:3001/', 'http://localhost:3001/ar', 'http://localhost:3001/login'];

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();

for (const url of urls) {
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  const title = await page.title();
  const h1 = await page.$eval('h1', (element) => element.textContent?.trim());
  console.log(JSON.stringify({ url, title, h1 }));
}

await browser.close();
