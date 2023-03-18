import { Builder, By, Key } from 'selenium-webdriver';

require('chromedriver');
interface objPattern {
  imgSrc: string[] | null;
  title: string | null;
  src: string | null;
  shop: string | null;
  price: number | null;
}

(async function helloSelenium() {
  const driver = await new Builder().forBrowser('chrome').build();

  await driver.get('https://www.google.com');

  const searchBar = await driver.findElement(By.className('gLFyf'));
  await searchBar.sendKeys('Bola de basquete');
  await searchBar.sendKeys(Key.ENTER);

  const shopping = await driver.findElement(By.xpath('//*[contains(text(), "Shopping")]'));
  await shopping.click();

  const sponsoredElements = await driver.findElements(By.className('KZmu8e'));
  const data: string[] = [];
  for (let i = 0; i < sponsoredElements.length; i++) {
    await sponsoredElements[i].click();
  }

  driver.close();
})();
