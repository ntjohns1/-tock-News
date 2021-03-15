// Finnhub 
// Use symbol lookup API first, returns symbol based on input (1)
// Get quote (2)
// Then use company profile 2 to display company info (3)
// use news sentiment to get news stats (4)
// Get basic financials (5)

getStock('Apple');

// input can be a symbol, name, isin or cusip
function getStock(userSearch) {
  // api key c162mdv48v6ootkka5hg
  var token = 'c162mdv48v6ootkka5hg';
  
  // utilize five seperate API calls to get data for page
  var stockSymbolURL = 'https://finnhub.io/api/v1/search?q=' + userSearch + '&token=' + token;

  var priceQuoteURL = 'https://finnhub.io/docs/api/quote?symbol=' + userSearch + '&token=' + token; 
  
  var stockProfileURL = 'https://finnhub.io/api/v1/stock/profile2?symbol=' + userSearch + '&token=' + token; 

  var newsStats = 'https://finnhub.io/api/v1/stock/news-sentiment?symbol=' + userSearch + '&token=' + token;

  var stockFinancials = 'https://finnhub.io/api/v1/stock/metric?symbol=' + userSearch + '&metric=all&token=' + token;

  // Algorithm explained. 1st get stock symbol or a list of similar stocks for the user to choose, once choice is solid
  // 2. get price quote, stock profile, news stats, and financials - then display them to page

  fetch(stockSymbolURL, {mode: 'cors'})
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // make sure there was a result before you do anything
      if (data.result.length > 0) {
        // if keyword is in stock name, proceed, otherwise ask user to verify from list 
        if (sameStock(userSearch,data)) {
          // display everything else with nested fetch promise chain
          console.log('Same!');
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
      console.log(data);
    })
    .catch(function(response) {
      // display error message here
    });
}

// display current stock price
function displayStockQuote(data) {
  console.log(data);
}

// display company profile
function displayStockProfile(data) {
  console.log(data);
}

// display company news stats
function displayNewsStats(data) {
  console.log(data);
}

// display basic company finance info
function displayStockFinance(data) {
  console.log(data);
}

// same stock - used to see if user search is actually in company name
// keeping suggested search very simple - if search string is foundin company descrip, go with that item. if not, display list. 
// could expand to create array of all searches matching search string and display that in list instead of raw data - if there's time
function sameStock(userSearch,data) {
  // extract first search result from data, put in string variable 
  var dataCompanyName = data.result[0].description;
  // make both strings uppercase so that we can accurately compare them (stock market doesn't care about case)
  userSearch = userSearch.toUpperCase();
  // default is they are not the same
  var same = false;
  // if the user search string is found in the company description, assume it is correct (may get fancier later)
  if (dataCompanyName.search(userSearch) > -1) {
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