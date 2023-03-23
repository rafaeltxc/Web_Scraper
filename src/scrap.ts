import { Builder, By, Key, WebDriver, WebElement } from 'selenium-webdriver';
import 'chromedriver';

export interface objPattern {
  imgSrc: string | null;
  title: string | null;
  src: string | null;
  shop: string | null;
  price: string | null;
  withoutDiscount: string | null;
}

export async function scrap(value: string) {
  // initialize chrome browser and go to google.com
  const driver: WebDriver = await new Builder().forBrowser('chrome').build();
  driver.manage().window().setRect({ width: 500, height: 500 });
  await driver.get('https://www.google.com');

  // search for some value
  const searchBar: WebElement = await driver.findElement(By.className('gLFyf'));
  await searchBar.sendKeys(value);
  await searchBar.sendKeys(Key.ENTER);

  // go to the shopping part and set the current window and page url
  const shopping: WebElement = await driver.findElement(By.xpath('//*[contains(text(), "Shopping")]'));
  await shopping.click();
  const originalWindow = await driver.getWindowHandle();
  const originalUrl = await driver.getCurrentUrl();

  // fing all the products on the page (recomended)
  const elementsRecomended: WebElement[] = await driver.findElements(By.className('sh-dgr__content'));
  const data: objPattern[] = [];
  for (let i = 0; i < elementsRecomended.length; i++) {
    /* enter the product in a new tab and get its real url (google makes a redirect from their own link to the product page.
      Here is where the program becomes slow, since it needs to enter each one of the url's and wait for the redirect) */
    await elementsRecomended[i].findElement(By.className('shntl')).click();
    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2);
    const windows: string[] = await driver.getAllWindowHandles();
    windows.forEach(async (handle) => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
    });
    await driver.wait(async () => (await driver.getCurrentUrl()) != originalUrl);
    const src: string = await driver.getCurrentUrl();
    await driver.close();
    await driver.switchTo().window(originalWindow);

    // get product main image url
    const imgSrc: string = await elementsRecomended[i]
      .findElement(By.className('ArOc1c'))
      .findElement(By.css('img'))
      .getAttribute('src');

    // get product title
    const title: string = await elementsRecomended[i].findElement(By.className('tAxDx')).getText();

    // get product shop
    const shop: string = await elementsRecomended[i].findElement(By.className('aULzUe IuHnof')).getText();

    // get product price and discount, if there is any
    let price: string;
    let withoutDiscount: string | null = null;
    try {
      price = await elementsRecomended[i].findElement(By.className('a8Pemb OFFNJ')).getText();
      withoutDiscount = await elementsRecomended[i].findElement(By.className('zY3Xhe OFFNJ')).getText();
    } catch (e) {
      price = await elementsRecomended[i].findElement(By.className('a8Pemb OFFNJ')).getText();
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

  driver.close();
  return data;
}
