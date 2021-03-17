<<<<<<< Updated upstream
var searchButton = document.querySelector("#search_button");
var inputField = document.querySelector("#search_field")

function newsAPI() {
    var searchInput = inputField.value.trim();
    var url = 'https://api.currentsapi.services/v1/latest-news?' + searchInput +
    'language=us&' +
    'apiKey=58zqUId_bFIYNSpOfAZh4cXhhgMJ1is-b48zhSmxe60fK5F5';
    var req = new Request(url);
    fetch(req)
    .then(function(response) { 
        return response.json();
    })
    .then(function(response) {
    console.log(response);
    })

};

=======
var newsAPIKey = '5978072a3f15452b82d992ec9921e3fc';
var searchButton = document.querySelector("#button");
var inputField = document.querySelector("#textbox");
// cors proxy thing 
var proxyUrl = "https://cors-anywhere.herokuapp.com/"

function newsAPI() {
    var searchInput = inputField.value.trim();
    console.log(searchInput)
    var url = 'https://api.currentsapi.services/v1/search?' + 'language=en&keywords=' + 'Apple' + '&apiKey=58zqUId_bFIYNSpOfAZh4cXhhgMJ1is-b48zhSmxe60fK5F5';
    fetch(url)
        .then(function (response) {
          console.log(response);  
          return response.json();
        })
        .then(function (data) {
            console.log(data);
        })

};
newsAPI();
>>>>>>> Stashed changes
searchButton.addEventListener("click", newsAPI);