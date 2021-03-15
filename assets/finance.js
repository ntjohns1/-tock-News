// Finnhub finance API

/** GUIDE! 
 * Use stock symbol API to verify user input returns data, and that the data is correct
 * If it is correct (IE user input matches either the first result's company description OR the symbol...
 * Then display all of that stock's data (quote, profile, stats, financials)
 * IF NOT then display list of suggestions or an error message asking user to search again
 * List is generated using function closestSearchResult...looks through response to see if there are any options that match user input
 * When user clicks on list item, it calls getStock again (or whatever super function is created to call both getStock and the news API) with the suggested result
 * 
 * To do: 
 * 1. Iron out error handling for fetch 
 * 2. Error handling when no data/limited data comes back
 * 3. Use moment or another library to set default message for QUOTE when market is closed 
 * 4. Look at CSS and page structure to determine how to properly write data to page
 * 5. Consider that saved search might be a thing, functionality similar to closestSearchResult()
**/

getStock('Veru');

// input can be a symbol, name, isin or cusip
function getStock(userSearch) {
  // api key c162mdv48v6ootkka5hg
  var token = 'c162mdv48v6ootkka5hg';
  userSearch = userSearch.toUpperCase();

  // utilize five seperate API calls to get data for page
  var stockSymbol = 'https://finnhub.io/api/v1/search?q=' + userSearch + '&token=' + token;

  var priceQuote = 'https://finnhub.io/api/v1/quote?symbol=' + userSearch + '&token=' + token; 
  
  var stockProfile = 'https://finnhub.io/api/v1/stock/profile2?symbol=' + userSearch + '&token=' + token; 

  var newsStats = 'https://finnhub.io/api/v1/stock/news-sentiment?symbol=' + userSearch + '&token=' + token;

  var stockFinancials = 'https://finnhub.io/api/v1/stock/metric?symbol=' + userSearch + '&metric=all&token=' + token;

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
        // if keyword is in stock name, proceed, otherwise ask user to verify from list 
        if (sameStock(userSearch,data)) {
          console.log('Calling display functions...');

          displayStockQuote(priceQuote,userSearch);
          displayStockProfile(stockProfile,userSearch);
          //displayNewsStats(newsStats,userSearch);
          displayStockFinance(stockFinancials,userSearch);
        }
        else {
          // otherwise, display list and use button to recursively call this function
          console.log(closestSearchResult(userSearch,data));
        }
      }
      // if search had ZERO results...
      else {
        // display not found message here
      }
    })
    .catch(function(response) {
      // display error message here
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
      // do something with data
    });
}

// display company profile
function displayStockProfile(stockProfile,userSearch) {
  console.log('displayStockProfile()');

  fetch(stockProfile, {mode: 'cors'})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('Got ' + userSearch + ' STOCK PROFILE data back...');
      console.log(stockProfile);
      console.log(data);
      // do something with data
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

// this function finds the search result that contains the user's string search (because API was returning weird results for searches, including Apple - seriously)
function closestSearchResult(userSearch,data) {
  // default result is false
  var results = [];
  // loop through all of data, see if there are similar options and push those options into an array

  for(i = 0; i < data.result.length; i++) {
    var dataCompanyName = data.result[i].description;
    userSearch = userSearch.toUpperCase();
    console.log(userSearch);
    // if search string is in name, then add it to array
    if (dataCompanyName.search(userSearch) > -1) {
        var companyObject = {
          description: data.result[i].description,
          displaySymbol: data.result[i].displaySymbol
        }
        results.push(companyObject);
    }
  }

  // if search found something, send it back, if not return false
  if (results.length > 0) {
    // return array of objects (if any)
    return results;
  }
  else {
    return false;
  }
}