'use strict';

const puppeteer = require('puppeteer');

(async (value) => {
  // initiate scrap
  //TODO verify browser language to search on google
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--lagn=en-US,en'],
  });
  const page = await browser.newPage();

  // go to google and search for the input value
  await page.goto('https://www.google.com/', { waitUntil: 'domcontentloaded' });

  await page.waitForSelector('aria/Pesquisar', {
    visible: true,
  });
  await page.type('aria/Pesquisar', value);
  await Promise.all([page.waitForNavigation({ waitUntil: 'domcontentloaded' }), page.keyboard.press('Enter')]);

  // wait for the browser to load the "Shopping" part of the page and click it
  await page.waitForSelector('div[class="MUFPAc"]', {
    visible: true,
  });
  await page.click('text/Shopping');

  const data = [];
  // wait till the page is loaded
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  const productsLength = await page.evaluate(() => {
    // get the length of the products in the page
    return document.getElementsByClassName('sh-dgr__content').length;
  });
  // get every product information and push to the data array
  for (let i = 0; i < productsLength; i++) {
    const productsUnit = await page.evaluate((i) => {
      json = {
        imgSrc: document.getElementsByClassName('ArOc1c')[i].children.item(0).getAttribute('src'),
        title: document.getElementsByClassName('tAxDx')[i].innerHTML,
        src: document.getElementsByClassName('Lq5OHe eaGTj translate-content')[i].getAttribute('href'),
        shop: document.getElementsByClassName('aULzUe IuHnof')[i].innerHTML,
        price: Number.parseFloat(
          document.getElementsByClassName('a8Pemb OFFNJ')[i].innerHTML.split(';')[1].replace(',', '.')
        ),
      };
      return json;
    }, i);
    data.push(productsUnit);
  }

  console.log(data);
})('Lingerie Push-Up');
