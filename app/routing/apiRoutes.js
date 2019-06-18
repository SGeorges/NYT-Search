var axios = require("axios");

module.exports= function(app) {

    // A GET route for scraping news from the New York Times database.
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://old.reddit.com/r/news/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("p.title").each(function(i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(element)
            .text();
            result.link = $(element)
            .children()
            .attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
            .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
            });
        });

        // Send a message to the client
        res.send("Scrape Complete");
        });
    });

    app.get("/search", function(req,res) {
        axios.get({
            url: req.url,
            method: "GET"
        }).then(function(response){
            res.json(response);
        });
    });
};