var favorites = [];
var articles = [];

// ===================== ARTICLE CONSTRUCTOR ============================

function article ( title, section, snippet, date, link, fav ) {
    this.title = title,
    this.section = section, 
    this.snippet = snippet,
    this.date = date, 
    this.link = link,
    this.fav = fav

    this.addFavorites = function() {
        this.fav = true;
        var newfav = true;

        for( var i = 0; i < favorites.length; i++) {
            if (favorites[i].title === this.title) {
                newfav = false;
            }
        }
        if (newfav) {
            favorites.push(this);
        }
    }

    this.delFavorites = function() {
        this.fav = false;

        for( var i = 0; i < favorites.length; i++) {
            if (favorites[i].title === this.title) {
                favorites.splice(i, 1);
                i--;
            }
        }
    }

    this.create = function( i ) {
        var articleDiv = $("<div id= 'article-container'>");

        if(this.fav){
            $(articleDiv).append("<button id= 'fav-btn-" + i + "' class='btn fav-btn' onclick= 'favoriteArticle(" + i + ", true)' type='submit'><i id= 'fav-icon" + i + "' class= 'fas fa-bookmark'></i></button>");
        }
        else {
            $(articleDiv).append("<button id= 'fav-btn-" + i + "' class='btn fav-btn' onclick= 'favoriteArticle(" + i + ", false)' type='submit'><i id= 'fav-icon" + i + "' class= 'far fa-bookmark'></i></button>"); 
        }
          $(articleDiv).append("<p id= 'article-title-" + i + "' class='article-title'>"+ this.title + "</p>");
          $(articleDiv).append("<p id= 'article-section-" + i + "' class = 'article-selection'>"+ this.section + "</p>");
          $(articleDiv).append("<p id= 'article-snippet-" + i + "' class = 'article-snippet'>"+ this.snippet + "</p>");
          $(articleDiv).append("<p id= 'article-date-" + i + "' class = 'article-date'>"+ this.date + "</p>");
          $(articleDiv).append("<a id= 'article-link-" + i + "' class = 'article-link' target= 'blank' href= '"+ this.link + "'>" + this.link + "</a>");
        
        $("#articles-location").append(articleDiv);
    }
}

// ==================== GETTING THE CURRENT DATE ====================
// ==================== Source : https://stackoverflow.com/questions/8398897/how-to-get-current-date-in-jquery ====================

var d = new Date();

var month = d.getMonth()+1;
var day = d.getDate();

var currentDate = d.getFullYear() + (month<10 ? '0' : '') + month + (day<10 ? '0' : '') + day;

// ==================== ON SEARCH CILCK EVENT ====================
    
$("#search-button").on("click", function(event){
    event.preventDefault();

    $("#articles-location").empty();
    articles = [];

    var yearStart = $("#start-year-input").val().trim();
    var yearEnd   = $("#end-year-input").val().trim();

    var search = $("#search-input").val().trim();

    if ((yearStart != "") && (yearEnd != "")) {
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=" + search + "&facet_field=day_of_week&facet=true&begin_date=" + yearStart + "0101&end_date=" + yearEnd + "1231&api-key=" + apiKey;
    }
    else if ((yearStart === "") && (yearEnd != "")) {
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=" + search + "&facet_field=day_of_week&facet=true&begin_date=19000101&end_date=" + yearEnd + "1231&api-key=" + apiKey;
    }
    else if ((yearEnd === "") && (yearStart != "")) {
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=" + search + "&facet_field=day_of_week&facet=true&begin_date=" + yearStart + "0101&end_date=" + currentDate + "&api-key=" + apiKey;
    }
    else{
        var queryURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + search + "&api-key=RWWZ8VTgJjkOMALXSPvImeafBajoUGem";
    }

    $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {

            var result = response.response;

            for(var i=0; i < $("#number-records").val(); i++){
                var title = result.docs[i].headline.main;
                var section = result.docs[i].section_name;
                var snippet = result.docs[i].snippet;
                var date = result.docs[i].pub_date;
                var link = result.docs[i].web_url;
    
                var fav = false;
                console.log(i);

                for(let j=0; j < favorites.length; j++) {
                    if (favorites[j].title === title) {
                        fav = true;
                    }
                }

                if (fav) {
                    var newArticle = new article(title, section, snippet, date, link, true);
                }
                else {
                    var newArticle = new article(title, section, snippet, date, link, false);
                }

                newArticle.create( i );
                articles.push(newArticle);
            }

            console.log(articles);
        });
});

// ==================== ON CLEAR CILCK EVENT ====================

$("#clear-button").on("click", function(event){
    event.preventDefault();

    $("#articles-location").empty();
});

// ==================== FAVORITE ARTICLES CILCK EVENT ====================

$("#favorites-button").on("click", function(event){
    event.preventDefault();
    articles = favorites;

    displayArticles();
});

// ==================== DISPLAY ARTICLES FUNCTION ====================
function displayArticles () {
    $("#articles-location").empty();

    for (var i = 0; i < articles.length; i++) {
        articles[i].create( i );
    }
}

// ==================== FAVORITE TOGGLE CILCK EVENT ====================

function favoriteArticle ( numFav, fav ) {
    event.preventDefault();

    if (fav) {
        articles[numFav].delFavorites();
    }
    else {
        articles[numFav].addFavorites();
    }

    displayArticles();
    console.log(articles);
    console.log(favorites);
};        