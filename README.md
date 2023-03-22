## Chrome Web Scraper

The scraper receives a value that will be searched in the chrome's browser, and return all the relationed products that match the search criteria, including their names, prices, discounts (if there is any), image source and shop link

The program also contains an api that runs with node express, a request can be sent to the server, and it will respond with all the collected data in JSON format. The request can also be sent with multiple parameters with specific shop names, the server gives the option to the conteined data to have or not have the specified shops, depending on how the request was made.

### Example url's:
/api/noFilter
/api/filter?value1=exampleValue&value2=exampleValue
/api/eliminate?value1=exampleValue&value2=exampleValue
