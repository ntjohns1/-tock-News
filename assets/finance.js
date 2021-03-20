// Group Project 1
// Finnhub Finance API

/** GUIDE! 
 * Use stock symbol API to verify user input returns data, and that the data is correct
 * If it is correct (IE user input matches either the first result's company description OR the symbol...
 * Then display all of that stock's data (quote, profile, stats, financials)
 * IF NOT then display list of suggestions or an error message asking user to search again
**/

// display default messages in stock containers prior to search
defaultMessages();

$('#button').on('click',function() {
    var userInput = $('#textbox').val();
    getStock(userInput);
    // newsAPI(userInput)
});

// display default content in content containers before search
function defaultMessages() {
  $('.stock-current').children().eq(0).attr('style','font-size: 16pt;');
  $('.stock-current').children().eq(0).html('Search for a stock above to see results!');
  $('.top-stocks').children().eq(0).html('Stock profile');
}

// input can be a symbol, name, isin or cusip
function getStock(userSearch) {
  // reset a few things
  $('.news-title').children().eq(0).html('');
  $('.news-results').html('');
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
        // if user search (stock symbol) matches results, then continue
        if (sameStock(userSearch,data)[0]) {
          // since the first result is correct, pull symbol from API data
          var stockPosition = sameStock(userSearch,data)[1];
          var correctSymbol = data.result[stockPosition].displaySymbol;

          // set URL's for other API calls...
          var priceQuote = 'https://finnhub.io/api/v1/quote?symbol=' + correctSymbol + '&token=' + token; 
  
          var stockProfile = 'https://finnhub.io/api/v1/stock/profile2?symbol=' + correctSymbol + '&token=' + token; 
        
          var stockFinancials = 'https://finnhub.io/api/v1/stock/metric?symbol=' + correctSymbol + '&metric=all&token=' + token;

          // call functions to make additional API calls/display data
          console.log('Calling display functions...');
          $('.stock-current').children().eq(0).html(data.result[stockPosition].description);

          displayStockQuote(priceQuote,correctSymbol);
          displayStockProfile(stockProfile,correctSymbol);
          displayStockFinance(stockFinancials,correctSymbol);
        }
        else {
          // otherwise, display list and use button to recursively call this function
          closestSearchResult(userSearch,data);
        }
      }
      // if search had ZERO results...
      else {
        $('.stock-current').children().eq(0).attr('style','font-size: 16pt;');
        $('.stock-current').children().eq(0).html('Your search returned 0 direct matches or suggested results. Please try again.');
      }
    })
    .catch(function(response) {
      $('.stock-current').children().eq(0).attr('style','font-size: 16pt;');
      $('.stock-current').children().eq(0).html('Finnhub API error...please try your search again!');
      console.log(response);
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

  // reset all top-stocks children to blank
  $('.top-stocks').children().html('');

  // create 3 divs so that content doesn't load in the wrong order
  var div1 = document.createElement('div');
  div1.setAttribute('id','top-stocks-1');
  div1.setAttribute('style','padding: 5px;');
  $('.top-stocks').append(div1);
  var div2 = document.createElement('div');
  div2.setAttribute('id','top-stocks-2');
  div2.setAttribute('style','padding: 5px;');
  $('.top-stocks').append(div2);
  var div3 = document.createElement('div');
  div3.setAttribute('id','top-stocks-3');
  div3.setAttribute('style','padding: 5px;');
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
      if (data.logo != '') {
        var companyLogo = document.createElement('img');
        companyLogo.setAttribute('src',data.logo);
        companyLogo.setAttribute('alt',data.name + ' logo');
        $('#top-stocks-1').append(companyLogo);
      }
      else {
        $('.top-stocks').children().eq(0).html(data.name);
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

/*function displayNewsHeadlines(input) {
  var url = 'https://api.currentsapi.services/v1/search?' + 'language=en&category=finance&keywords=' + input + '&apiKey=58zqUId_bFIYNSpOfAZh4cXhhgMJ1is-b48zhSmxe60fK5F5';
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (let i = 0; i < 5; i++) {
        var articleCard = $('<div>')
        newsCard.append(articleCard)
        var newsTitle = $('<h2>');
        newsTitle.text(data.news[i].title);
        articleCard.append(newsTitle);
        var newsAuthor = $('<h3>');
        newsAuthor.text(data.news[i].author);
        articleCard.append(newsAuthor);
        if (data.news[i].image !== "None") {
        var newsImg = $('<img>');
        newsImg.attr('src', data.news[i].image);
        newsImg.addClass('news-image')
        articleCard.append(newsImg);
        }
        var newsContent = $('<p>');
        newsContent.text(data.news[i].description);
        articleCard.append(newsContent);
      }
    })
  };
*/
// same stock - used to see if user search is actually in company name
function sameStock(userSearch,data) {
  // make both strings uppercase so that we can accurately compare them (stock market doesn't care about case)
  userSearch = userSearch.toUpperCase();
  // default is they are not the same
  var same = false;
  var position = -1;

  // if the user search string is found in the company description, assume it is correct (may get fancier later)
  for (i = 0; i < data.result.length; i++) {
    if (data.result[i].displaySymbol === userSearch) {
      same = true;
      position = i;
    }
  }
 
  return [same,position];
}

// displays top 10 results from API (if user query has no matching result)
function closestSearchResult(userSearch,data) {
  // display message to user
  $('.stock-current').children().eq(0).attr('style','font-size: 16pt;');
  $('.stock-current').children().eq(0).html('Your search returned 0 direct matches. See below.');
  $('.news-title').children().eq(0).html('Are any of these what you were looking for?');
  var suggestionList = document.createElement("ul");
  var numberAcceptableLinks = 0;

  for(i = 0; i < data.result.length && i < 10; i++) {
    var dataCompanyName = data.result[i].description;
    var dataCompanySymbol = data.result[i].displaySymbol;

    // this filters out indexes and other special funds from list (requires premium access with API)
    if (!dataCompanySymbol.includes('.') && !dataCompanySymbol.includes('^')) {
        var listEl = document.createElement('li');
        var linkEl = document.createElement('a');
        linkEl.setAttribute('href','#');
        linkEl.setAttribute('data-descr',dataCompanySymbol);

        linkEl.innerHTML = data.result[i].description + ' (Symbol: ' + dataCompanySymbol + ')';
        listEl.append(linkEl);
        suggestionList.append(listEl);

        // add event listener to link so it will run getStock function when clicked
        listEl.addEventListener('click', function() {
            var stockSymbol = this.children[0].getAttribute('data-descr');

            // reset news results
            $('.news-title').children().eq(0).html('Searching for ' + stockSymbol);
            $('.news-results').html('Results will display above.');
            // search for suggested stock
            getStock(stockSymbol);
        });
        numberAcceptableLinks++;
    }
  }

  if (numberAcceptableLinks > 0) {
      // insert list into news article section
      $('.news-results').html(suggestionList);
  }
  else {
      $('.news-results').html('No suggested results.');
  }

}

// formats numbers for stock profile section (market cap, outstanding shares)
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

// formats stock price numbers
function formatPrice(number) {
  number = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', maximumFractionDigits: 2}).format(number);
  console.log('formatPrice = ' + number);
  return number;
}

// basic check on user input - make sure no symbols in name
function inputOK(userInput) {
  inputOK = true;

  if (userInput.includes('.') || userInput.includes('^')) {
    console.log('Bad search');
    console.log(userInput);

    $('.stock-current').children().eq(0).attr('style','font-size: 16pt;');
    $('.stock-current').children().eq(0).html('Can only search for common stock symbols!');

    inputOK = false;
  }

  return inputOK;
}