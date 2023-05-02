# Selenium Web Scraper

Return all the relationed products that match the search criteria, including their names, prices, discounts (if there is any), image source and shop link.

### Usage
run the following commands:
```console
git clone https://github.com/rafaeltxc/Web-Scraper/
cd ./Web-Scraper
npm install
npm start
```
The program contain an API that can be used for requests such as:
```console
/api/noFilter
/api/filter?value1=exampleValue&value2=exampleValue
/api/eliminate?value1=exampleValue&value2=exampleValue
```
The way that the program work, is:<br />
It first open google, search for the given word, and once the page is loaded, it access the shopping tab, and in there, scrap all the data encountered within the products.

The scraping part of the job, can take little while, since the program needs to open each one of the products, and access the link to scrap the real url (since scraping the url directly from the product's page, give a chrome redirect url).

At the end of the process, a JSON will be given.
