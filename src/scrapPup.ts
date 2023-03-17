'use strict';
import puppeteer from 'puppeteer';

interface objPattern {
  imgSrc: string | null;
  title: string | null;
  src: string | null;
  shop: string | null;
  price: number | null;
}

function delay(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

(async (value) => {
  // launch browser and open a new tab
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
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.keyboard.press('Enter'),
  ]);

  // wait for the browser to load the "Shopping" part of the page and click it
  await page.waitForSelector('div[class="MUFPAc"]', {
    visible: true,
  });
  await page.click('text/Shopping');

  const data: object[] = [];
  // wait till the page is loaded
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  const productsLength = await page.evaluate(() => {
    // get the length of the products in the page
    return document.getElementsByClassName('sh-dgr__content').length;
  });

  // TODO get all images from the page (needed to open the div to get the information)
  // await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  // const productsImgsLength = await page.evaluate(() => {
  //   // get the length of each product images in the page
  //   return document.getElementsByClassName('_-da')[0].children.length;
  // });
  // console.log(productsImgsLength);

  //get every product information and push to the data array
  for (let i = 0; i < productsLength; i++) {
    await page.click('.shntl');
    await delay(3000);
    const pages = await browser.pages();
    const newTab = pages[pages.length - 1];
    const pageUrl: string = newTab.url();
    await newTab.close();

    const productsUnit = await page.evaluate(
      (i, url) => {
        const json: objPattern = {
          // @ts-ignore: Object is possibly 'null'
          imgSrc: document.getElementsByClassName('ArOc1c')[i].children.item(0).getAttribute('src'),
          title: document.getElementsByClassName('tAxDx')[i].innerHTML,
          src: url,
          shop: document.getElementsByClassName('aULzUe IuHnof')[i].innerHTML,
          price: Number.parseFloat(
            document.getElementsByClassName('a8Pemb OFFNJ')[i].innerHTML.split(';')[1].replace(',', '.')
          ),
        };
        return json;
      },
      i,
      pageUrl
    );
    data.push(productsUnit);
  }

  console.log(data);
})('Bola de basquete');
