import { Builder, By, Key } from 'selenium-webdriver';
require('chromedriver');

interface objPattern {
  imgSrc: string | null;
  title: string | null;
  src: string | null;
  shop: string | null;
  price: string | null;
  withoutDiscount: string | null;
}

(async function helloSelenium() {
  // initialize chrome browser and go to google.com
  const driver = await new Builder().forBrowser('chrome').build();
  await driver.get('https://www.google.com');

  // search for some value
  const searchBar = await driver.findElement(By.className('gLFyf'));
  await searchBar.sendKeys('Bola de basquete');
  await searchBar.sendKeys(Key.ENTER);

  // go to the shopping part and set the current window and page url
  const shopping = await driver.findElement(By.xpath('//*[contains(text(), "Shopping")]'));
  await shopping.click();
  const originalWindow = await driver.getWindowHandle();
  const originalUrl = await driver.getCurrentUrl();

  // TODO get all elements images
  // const productsImgs = await driver.findElements(By.className('sh-div__viewer'));
  // const listImgs: any = [];
  // const data: string[] = [];
  // if (productsImgs.length > 1) {
  //   for (let i = 0; i < elements.length; i++) {
  //     const imgs = await elements[i].findElements(By.className('_-dc'));
  //     await elements[i].click().then(async () => {
  //       await delay(5000);
  //       for (let j = 0; j < productsImgs.length; j++) {
  //         data.push(await imgs[j].getAttribute('src'));
  //       }
  //       listImgs.push(data);
  //     });
  //   }
  // }
  // console.log(listImgs);

  // fing all the products on the page
  const elements = await driver.findElements(By.className('sh-dgr__content'));
  const data = [];
  for (let i = 0; i < elements.length; i++) {
    // enter the product in a new tab and get its real url
    await elements[i].findElement(By.className('shntl')).click();
    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2);
    const windows = await driver.getAllWindowHandles();
    windows.forEach(async (handle) => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    await driver.wait(async () => (await driver.getCurrentUrl()) != originalUrl);
    const src = await driver.getCurrentUrl();
    await driver.close();
    await driver.switchTo().window(originalWindow);

    // get product main image url
    const imgSrc = await elements[i]
      .findElement(By.className('ArOc1c'))
      .findElement(By.css('img'))
      .getAttribute('src');

    // get product title
    const title = await elements[i].findElement(By.className('tAxDx')).getText();

    // get product shop
    const shop = await elements[i].findElement(By.className('aULzUe IuHnof')).getText();

    // get product price and discount, if there is any
    let price;
    let withoutDiscount = null;
    try {
      price = await elements[i].findElement(By.className('a8Pemb OFFNJ')).getText();
      withoutDiscount = await elements[i].findElement(By.className('zY3Xhe OFFNJ')).getText();
    } catch (e) {
      price = await elements[i].findElement(By.className('a8Pemb OFFNJ')).getText();
    }

    // build the object and send to the list
    const obj: objPattern = {
      imgSrc,
      title,
      src,
      shop,
      price,
      withoutDiscount,
    };

    data.push(obj);
  }

  console.log(data);
  driver.close();
})();
