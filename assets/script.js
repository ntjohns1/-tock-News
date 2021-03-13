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

searchButton.addEventListener("click", newsAPI);