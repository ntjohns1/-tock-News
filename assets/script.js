var newsAPIKey = '5978072a3f15452b82d992ec9921e3fc';
var searchButton = $('#button');
var inputField = $('#textbox');
// .val method for jQuery
var newsCard = $('#news-card');
// cors proxy thing 

searchButton.on('click', function newsAPI() {

  var url = 'https://api.currentsapi.services/v1/search?' + 'language=en&category=finance&keywords=' + inputField.val() + '&apiKey=58zqUId_bFIYNSpOfAZh4cXhhgMJ1is-b48zhSmxe60fK5F5';
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      for (let i = 0; i < 5; i++) {
        var articleCard = $('<div>');
        newsCard.append(articleCard);
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
});
