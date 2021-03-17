// Finnhub finance API

/** GUIDE! 
 * Use stock symbol API to verify user input returns data, and that the data is correct
 * If it is correct (IE user input matches either the first result's company description OR the symbol...
 * Then display all of that stock's data (quote, profile, stats, financials)
 * IF NOT then display list of suggestions or an error message asking user to search again
**/

getStock('TSLA');

// input can be a symbol, name, isin or cusip
function getStock(userSearch) {
  // api key c162mdv48v6ootkka5hg
  var token = 'c162mdv48v6ootkka5hg';
  userSearch = userSearch.toUpperCase();

  // utilize five seperate API calls to get data for page
  var stockSymbol = 'https://finnhub.io/api/v1/search?q=' + userSearch + '&token=' + token;

  // Algorithm explained. 1st get stock symbol or a list of similar stocks for the user to choose, once choice is solid
  // 2. get price quote, stock profile, news stats, and financials - then display them to page

  fetch(stockSymbol, {mode: 'cors'})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // make sure there was a result before you do anything
      if (data.result.length > 0) {
        console.log('Got results back from user search...');
        console.log(data);
        // if keyword is in stock name, proceed, otherwise ask user to verify from list 
        if (sameStock(userSearch,data)) {
          // since the first result is correct, pull symbol from API data
          var correctSymbol = data.result[0].displaySymbol;

          // set URL's for other API calls...
          var priceQuote = 'https://finnhub.io/api/v1/quote?symbol=' + correctSymbol + '&token=' + token; 
  
          var stockProfile = 'https://finnhub.io/api/v1/stock/profile2?symbol=' + correctSymbol + '&token=' + token; 
        
          var newsStats = 'https://finnhub.io/api/v1/stock/news-sentiment?symbol=' + correctSymbol + '&token=' + token;
        
          var stockFinancials = 'https://finnhub.io/api/v1/stock/metric?symbol=' + correctSymbol + '&metric=all&token=' + token;

          // call functions to make additional API calls/display data
          console.log('Calling display functions...');
          $('.stock-current').children().eq(0).html(data.result[0].description);

          displayStockQuote(priceQuote,correctSymbol);
          displayStockProfile(stockProfile,correctSymbol);
          //displayNewsStats(newsStats,userSearch);
          displayStockFinance(stockFinancials,correctSymbol);
        }
        else {
          // otherwise, display list and use button to recursively call this function
          closestSearchResult(userSearch,data);
        }
      }
      // if search had ZERO results...
      else {
        // display not found message here
      }
    })
    .catch(function(response) {
      $('.stock-current').children().eq(0).attr('style','font-size: 16pt;');
      $('.stock-current').children().eq(0).html('Finnhub API error...please try your search again!');
    });
}

// display current stock price
function displayStockQuote(priceQuote,userSearch) {
  console.log('displayStockQuote()');

  fetch(priceQuote, {mode: 'cors'})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('Got ' + userSearch + ' PRICE QUOTE data back...');
      console.log(priceQuote);
      console.log(data);
      $('.stock-current').children().eq(1).html('Current price: ' + formatPrice(data.c) + ' High: ' + formatPrice(data.h) + ' Low: ' + formatPrice(data.l) + ' Previous close: ' + formatPrice(data.pc));
    });
}

// display company profile
function displayStockProfile(stockProfile,userSearch) {
  console.log('displayStockProfile()');

  // create 3 divs so that content doesn't load in the wrong order
  var div1 = document.createElement('div');
  div1.setAttribute('id','top-stocks-1');
  $('.top-stocks').append(div1);
  var div2 = document.createElement('div');
  div2.setAttribute('id','top-stocks-2');
  $('.top-stocks').append(div2);
  var div3 = document.createElement('div');
  div3.setAttribute('id','top-stocks-3');
  $('.top-stocks').append(div3);

  fetch(stockProfile, {mode: 'cors'})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('Got ' + userSearch + ' STOCK PROFILE data back...');
      console.log(stockProfile);
      console.log(data);
      // display logo first, then data in a list format
      if (data.logo) {
        var companyLogo = document.createElement('img');
        companyLogo.setAttribute('src',data.logo);
        companyLogo.setAttribute('alt',data.name + ' logo');
        $('#top-stocks-1').append(companyLogo);
      }
      else {
        $('.top-stocks').children().eq(0).append(data.name);
      }

      var profileList = document.createElement('ul');
      profileList.setAttribute('style','list-style: none;');

      var marketCap = formatProfile(data.marketCapitalization);
      var suffix = 'billion';

      var shares = formatProfile(data.shareOutstanding);
      
      profileList.innerHTML = '<li>Country: ' + data.country + '</li>'+
      '<li>Industry: ' + data.finnhubIndustry + '</li>' +
      '<li>Market cap: $' + marketCap + '</li>' +
      '<li>Shares outstanding: ' + shares + '</li>' +
      '<li>Ticker: ' + data.ticker + '</li>';

      $('#top-stocks-2').append(profileList);
    });
}

// display company news stats
function displayNewsStats(newsStats,userSearch) {
  console.log('displayNewsStats()');

  fetch(newsStats, {mode: 'cors'})
    .then(function (response) {
      console.log(newsStats);
      console.log(response);
      return response;
    })
    .then(function (data) {
      console.log('Got ' + userSearch + ' NEWS STATS data back...');
      console.log(newsStats);
      console.log(data);
      // do something with data
    });
}

// display basic company finance info
function displayStockFinance(stockFinancials,userSearch) {
  console.log('displayStockFinance()');

  fetch(stockFinancials, {mode: 'cors'})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('Got ' + userSearch + ' STOCK FINANCIALS data back...');
      console.log(stockFinancials);
      console.log(data);
      // do something with data
      
      var financialsList = document.createElement('ul');
      financialsList.setAttribute('style','list-style: none;');

      var weekHigh = formatPrice(data.metric['52WeekHigh']);
      var weekLow = formatPrice(data.metric['52WeekLow']);

      financialsList.innerHTML = '<li>52 week high: ' + weekHigh + '</li>' +
      '<li>52 week low: ' + weekLow + '</li>' +
      '<li>beta: ' + data.metric.beta + '</li>';
      $('#top-stocks-3').append(financialsList); 
    });
}

// same stock - used to see if user search is actually in company name
function sameStock(userSearch,data) {
  // extract first search result from data, put in string variable 
  var dataCompanyName = data.result[0].description;
  var dataSymbol = data.result[0].displaySymbol;
  // make both strings uppercase so that we can accurately compare them (stock market doesn't care about case)
  userSearch = userSearch.toUpperCase();
  // default is they are not the same
  var same = false;
  // if the user search string is found in the company description, assume it is correct (may get fancier later)
  if ((dataCompanyName.search(userSearch) > -1) || (dataSymbol === userSearch)) {
    same = true;
  }
 
  return same;
}

// if user query not direct match, display top 10 results returned in list 
function closestSearchResult(userSearch,data) {
  // display message to user
  $('.stock-current').children().eq(0).attr('style','font-size: 16pt;');
  $('.stock-current').children().eq(0).html('Your search returned 0 direct matches. See below.');
  $('.news-title').children().eq(0).html('Are any of these what you were looking for?');
  var suggestionList = document.createElement("ul");

  for(i = 0; i < data.result.length && i < 10; i++) {
    var dataCompanyName = data.result[i].description;
    var dataCompanySymbol = data.result[i].displaySymbol;
      
    var listEl = document.createElement('li');
    listEl.innerHTML = data.result[i].description;
    suggestionList.append(listEl);
  }

  // insert list into news article section
  $('.news-results').html(suggestionList);
}

function formatProfile(number) {
    if (number > 1000000) {
        number /= 1000000;
        number = new Intl.NumberFormat('en-US', {style: 'decimal', maximumFractionDigits: 2}).format(number) + ' trillion';
    }
    else if (number > 1000) {
      number /= 1000;
      number = new Intl.NumberFormat('en-US', {style: 'decimal', maximumFractionDigits: 2}).format(number) + ' billion';
      console.log(number);
    }
    else {
        number = new Intl.NumberFormat('en-US', {style: 'decimal', maximumFractionDigits: 2}).format(number) + ' million';
    }
    return number;
}

function formatPrice(number) {
  number = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2}).format(number);
  console.log('formatPrice = ' + number);
  return number;
}