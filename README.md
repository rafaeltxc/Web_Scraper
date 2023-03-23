## Chrome Web Scraper

Return all the relationed products that match the search criteria, including their names, prices, discounts (if there is any), image source and shop link.

The program also contains an api that runs with node express, a request can be sent to the server, and it will respond with all the collected data in JSON format. The request can also be sent with multiple parameters with specific shop names for filtering.

### Example url's:
/api/noFilter <br>
/api/filter?value1=exampleValue&value2=exampleValue <br>
/api/eliminate?value1=exampleValue&value2=exampleValue <br>
