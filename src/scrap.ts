import { Builder, By, Key, until } from 'selenium-webdriver';
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
  const driver = await new Builder().forBrowser('chrome').build();

  await driver.get('https://www.google.com');

  const searchBar = await driver.findElement(By.className('gLFyf'));
  await searchBar.sendKeys('Bola de basquete');
  await searchBar.sendKeys(Key.ENTER);

  const shopping = await driver.findElement(By.xpath('//*[contains(text(), "Shopping")]'));
  await shopping.click();
  const originalWindow = await driver.getWindowHandle();
  const originalUrl = await driver.getCurrentUrl();

  // TODO get all elements images
  // const productsInfos = await driver.findElements(By.className('_-da'));
  // // const infoImgs = await driver.findElements(By.className('_-db sh-div__thumbnail'));
  // const listImgs = [];
  // for (let i = 0; i < productsInfos.length; i++) {
  //   const infoImgs: WebElement[] = await productsInfos[i].findElements(By.className('_-dc'));

  //   const data: string[] = [];
  //   for (let j = 0; j < infoImgs.length; j++) {
  //     data.push(await infoImgs[j].getAttribute('src'));
  //   }
  //   listImgs.push(data);
  // }
  // console.log(listImgs);

  const elements = await driver.findElements(By.className('sh-dgr__content'));
  const data = [];
  for (let i = 0; i < elements.length; i++) {
    // OPEN ELEMENT
    // const url = await elements[i].click();

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

    const imgSrc = await elements[i]
      .findElement(By.className('ArOc1c'))
      .findElement(By.css('img'))
      .getAttribute('src');

    const title = await elements[i].findElement(By.className('tAxDx')).getText();

    const shop = await elements[i].findElement(By.className('aULzUe IuHnof')).getText();

    let price;
    let withoutDiscount = null;
    try {
      price = await elements[i].findElement(By.className('a8Pemb OFFNJ')).getText();
      withoutDiscount = await elements[i].findElement(By.className('zY3Xhe OFFNJ')).getText();
    } catch (e) {
      price = await elements[i].findElement(By.className('a8Pemb OFFNJ')).getText();
    }

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
