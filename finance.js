// Alpha Vantage API test

// api key c162mdv48v6ootkka5hg
var token = 'c162mdv48v6ootkka5hg';

console.log(token);

fetch('https://finnhub.io/docs/api/quote?symbol=AAPL&token='+token)
  .then(response => response.json())
  .then(data => console.log(data));