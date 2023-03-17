import { Builder, By, Key } from 'selenium-webdriver';

require('chromedriver');

(async function helloSelenium() {
  const driver = await new Builder().forBrowser('chrome').build();

  await driver.get('https://www.google.com');

  const searchBar = await driver.findElement(By.className('gLFyf'));
  await searchBar.sendKeys('Bola de basquete');
  await searchBar.sendKeys(Key.ENTER);
})();
