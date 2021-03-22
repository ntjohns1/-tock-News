// Group Project 1
// Finnhub Finance API

/** GUIDE! 
 * Use stock symbol API to verify user input returns data, and that the data is correct
 * If it is correct (IE user input matches either the first result's company description OR the symbol...
 * Then display all of that stock's data (quote, profile, stats, financials)
 * IF NOT then display list of suggestions or an error message asking user to search again
**/

// local storage array

// display default messages in stock containers prior to search
defaultMessages();

// if user searches...
$('#button').on('click',function() {
    // get user input
    var userInput = $('#textbox').val();
    getStock(userInput);
    displayNewsHeadlines(userInput + 'stock')
    // reset certain content containers
    $('.stock-current').children().html('');
    $('.top-stocks').children().html('');
    $('#news-card').children().html('');

    // add stock to past searches
    addSearch(userInput);
});

// clear search history
$('#clear').on('click', function() {
  clearPastSearches();
});

// display default content in content containers before search
function defaultMessages() {
  $('.stock-current').children().eq(0).attr('style','font-size: 16pt;');
  $('.stock-current').children().eq(0).html('Search for a stock above to see results!');
  $('.top-stocks').children().eq(0).html('Stock profile');

  displaySearches();
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
          var stockDescription = data.result[stockPosition].description
          var storageObject = {
            name: stockDescription,
            symbol: correctSymbol
          }

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
// retrieves currents API data and appends headlines to the page
function displayNewsHeadlines(input) {
  $('#news-card').html('');

  var url = 'https://api.currentsapi.services/v1/search?' + 'language=en&category=finance&keywords=' + input + '&apiKey=58zqUId_bFIYNSpOfAZh4cXhhgMJ1is-b48zhSmxe60fK5F5';
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (let i = 0; i < 5; i++) {
        var articleCard = $('<div>');
        $('#news-card').append(articleCard)
        var newsTitle = $('<h2>');
        newsTitle.text(data.news[i].title);
        newsTitle.attr('class', 'news-title')
        articleCard.append(newsTitle);
        var newsAuthor = $('<h3>');
        newsAuthor.text(data.news[i].author);
        newsAuthor.attr('class', 'news-author');
        articleCard.append(newsAuthor);
        if (data.news[i].image !== "None") {
        var newsImg = $('<img>');
        newsImg.attr('src', data.news[i].image);
        newsImg.addClass('news-image')
        articleCard.append(newsImg);
        }
        var newsContent = $('<p>');
        newsContent.text(data.news[i].description);
        newsContent.attr('class', 'news-content');
        articleCard.append(newsContent);
      }
    })
  };
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
  $('.stock-current').children().eq(0).html('Your search returned 0 direct matches. Please search using stock symbol. See suggested results below.');
  $('.top-stocks').children().eq(0).html('Are any of these what you were looking for?');

  var suggestionList = document.createElement("ul");
  var numberAcceptableLinks = 0;

  for(i = 0; i < data.result.length && i < 10; i++) {
    var dataCompanyName = data.result[i].description;
    var dataCompanySymbol = data.result[i].displaySymbol;

    // this filters out indexes and other special funds from list (requires premium access with API)
    if (!dataCompanySymbol.includes('.') && !dataCompanySymbol.includes('^')) {
        var listEl = document.createElement('li');
        listEl.setAttribute('style','list-style: none; color: white;');

        var linkEl = document.createElement('a');
        linkEl.setAttribute('style','color: white; text-decoration: none');
        linkEl.setAttribute('href','#');
        linkEl.setAttribute('data-descr',dataCompanySymbol);
        linkEl.setAttribute('data-name',dataCompanyName);

        linkEl.innerHTML = data.result[i].description + ' (Symbol: ' + dataCompanySymbol + ')';
        listEl.append(linkEl);
        suggestionList.append(listEl);

        // add event listener to link so it will run getStock function when clicked
        listEl.addEventListener('click', function() {
            var stockSymbol = this.children[0].getAttribute('data-descr');
            var stockName = this.children[0].getAttribute('data-name');

            // reset news results
            $('.top-stocks').children().html('');

            // search for suggested stock
            getStock(stockSymbol);
            displayNewsHeadlines(stockSymbol);
        });
        
        numberAcceptableLinks++;
    }
  }

  if (numberAcceptableLinks > 0) {
      // insert list into news article section
      $('.top-stocks').append(suggestionList);
  }
  else {
      $('.top-stocks').children().eq(0).html('No suggested results.');
  }

}

// formats numbers for stock profile section (market cap, outstanding shares)
function formatProfile(number) {
    // trillion
    if (number > 1000000) {
        number /= 1000000;
        number = new Intl.NumberFormat('en-US', {style: 'decimal', maximumFractionDigits: 2}).format(number) + ' trillion';
    }
    // billion
    else if (number > 1000) {
      number /= 1000;
      number = new Intl.NumberFormat('en-US', {style: 'decimal', maximumFractionDigits: 2}).format(number) + ' billion';
      console.log(number);
    }
    // mere millions
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

function addSearch(stock) {
  // if the localstorage item is not there
  if (!localStorage.getItem("pastSearches")) {
      // push stock into array
      var pastSearches = [];    
   
      pastSearches.push(stock);
      // write it to local storage
      localStorage.setItem("pastSearches",JSON.stringify(pastSearches));
  }
  // if the localstorage item is there
  else {
      // extract data from localstorage
      var pastSearches = JSON.parse(localStorage.getItem("pastSearches"));
      console.log(pastSearches);
      //only add if it's not already there
      if (!alreadySaved(stock,pastSearches)) {
           // add new stock to list
           pastSearches.push(stock);
           // re-insert data into local storage
           localStorage.setItem("pastSearches",JSON.stringify(pastSearches));
      }
  }
  displaySearches();
}

// retrieves past searches, displays them to page
function displaySearches() {
   $('.history-list').html("");
   $('.history-list').attr('style','align: start; height: 100%; padding-top: 5px; list-style: none;');

   // only do something if local storage objects exist, otherwise do nothing (ie leave blank)
   if (localStorage.getItem("pastSearches")) {
       // extract data from localstorage
       var pastSearches = JSON.parse(localStorage.getItem("pastSearches"));

       for (i = 0; i < pastSearches.length; i++) {
           // build list item, add to list
           var listItem = document.createElement("li");
           listItem.setAttribute("id","search"+i);
           listItem.setAttribute("style","cursor: pointer;");
           listItem.setAttribute("data-descr",pastSearches[i]);
           listItem.innerHTML = pastSearches[i]; 
           $('.history-list').append(listItem);

           // handle when one link is clicked on
           listItem.addEventListener("click", function() {
               getStock(this.getAttribute("data-descr"));
               displayNewsHeadlines(this.getAttribute("data-descr") + " stock");
           });
       }
   }
   // set default value
   else {
       $('.history-list').html("None yet!");
   }
}

// clears search history
function clearPastSearches() {
   localStorage.removeItem("pastSearches");
   location.reload();
}

// takes stock and compares it to each item in array, if present returns true
function alreadySaved(symbol,data) {
  var present = false;
  symbol = symbol.toUpperCase();

  for (i = 0; i < data.length; i++) {
      if (data[i].toUpperCase() === symbol) {
          present = true;
      }
  }

  return present;
}
