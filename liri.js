//liri.js

var fs = require("fs");
var request = require('request');
var inquirer = require("inquirer");
var Twitter = require('twitter');

var keys = require("./keys.js");
var params = { screen_name: 'plptweeter' };

var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: "34e579868bff437fb6386e72cfb2e4e7",
    secret: "379ff493f0864ae29c8cd438f43cd0b5"
});

var omdb = require('omdb');

// Prompt for user choice of activity 
inquirer
    .prompt([

        // User's activity choice list:
        {
            type: "list",
            name: "userActions",
            message: "What would you like to do?",
            choices: ["my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"]
        }
    ])
    .then(function(inquirerResponse) {

        if (inquirerResponse.userActions === "my-tweets") {

            var client = new Twitter(keys);
            // Then run a request to twitter
            client.get('statuses/user_timeline', params, function(error, tweets, response) {
                if (!error) {
                    if (tweets.length < 19) {
                        console.log("Here are all of your " + tweets.length + " tweets:")
                        for (i = 0; i < tweets.length; i++) {
                            console.log(tweets[i].text + "  " + tweets[i].created_at);
                        } //for
                    } else {
                        console.log("Here are all of your last 20 tweets:")
                        for (i = 0; i < 20; i++) {
                            console.log(tweets[i].text + "  " + tweets[i].created_at);
                        } //for                     
                    }; //if-else tweets.length

                } else {
                    console.log(error)
                };

            }); //client.get function    

        } else if (inquirerResponse.userActions === "spotify-this-song") {

            inquirer
                .prompt([{
                    type: "input",
                    name: "songName",
                    message: "Please enter a song title?"
                }])
                .then(function(inquirerResponse) {

                    if (inquirerResponse.songName === "") {
                        inquirerResponse.songName = '"The Sign"';
                    } else {
                        inquirerResponse.songName = '"' + inquirerResponse.songName + '"';
                    };

                    spotify.search({ type: 'track', query: inquirerResponse.songName }, function(err, data) {

                        if (err) {
                            return console.log('Error occurred: ' + err);
                        } else {
                            console.log("Here is the info on the song " + inquirerResponse.songName + ":")
                            for (i = 0; i < data.tracks.items.length; i++) {
                                console.log("Song name: " + data.tracks.items[i].name);
                                console.log("From the album(s): " + data.tracks.items[i].album.name);
                                console.log("Artist(s): " + data.tracks.items[i].artists[0].name);
                                console.log("Preview song here: " + data.tracks.items[i].href);
                            } //for tracks
                        }; //if else

                    }); //spotify search & function

                }); //prompt then

        } else if (inquirerResponse.userActions === "movie-this") {

            // Prompt for user movie input
            inquirer
                .prompt([{
                    type: "input",
                    name: "movieName",
                    message: "What movie are you interested in?"
                }])
                .then(function(inquirerResponse) {

                    if (inquirerResponse.movieName === "") {
                        inquirerResponse.movieName = "Mr Nobody"
                    };

                    var movieSearchStrg = "http://www.omdbapi.com/?t=" + inquirerResponse.movieName + "&y=&plot=short&apikey=trilogy"
                    // Then run a request to the OMDB API with the movie specified
                    request(movieSearchStrg, function(error, response, body) {

                        // If the request is successful (i.e. if the response status code is 200)
                        if (!error && response.statusCode === 200) {
                            console.log("Title of the movie: " + JSON.parse(body).Title)
                            console.log("Release year: " + JSON.parse(body).Year)
                            console.log("The IMDB Rating is: " + JSON.parse(body).Rated);
                            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value)
                            console.log("Country where movie produced: " + JSON.parse(body).Country)
                            console.log("Language of the movie: " + JSON.parse(body).Language)
                            console.log("Plot of the movie: " + JSON.parse(body).Plot)
                            console.log("Actors in the movie: " + JSON.parse(body).Actors)
                        }; //if

                    }); // request
                }); //then function


        } else if (inquirerResponse.userActions === "do-what-it-says") {

            fs.readFile("./random.txt", "utf8", function(error, data) {

                // If the code experiences any errors it will log the error to the console.
                if (error) {
                    return console.log(error);
                }
                console.log(data);

                var dataArr = data.split(",");
                var songFind = dataArr[1];

                spotify.search({ type: 'track', query: songFind }, function(err, data) {

                    if (err) {
                        return console.log('Error occurred: ' + err);
                    } else {
                        console.log("Here is the info on the song " + songFind + ":")
                        for (i = 0; i < data.tracks.items.length; i++) {
                            console.log("Song name: " + data.tracks.items[i].name);
                            console.log("From the album(s): " + data.tracks.items[i].album.name);
                            console.log("Artist(s): " + data.tracks.items[i].artists[0].name);
                            console.log("Preview song here: " + data.tracks.items[i].href);
                        } //for tracks
                        for (i = 0; i < data.tracks.items.length; i++) {
                            fs.appendFile("./log.txt",
                                "Song name: " + data.tracks.items[i].name + "," +
                                "From the album(s): " + data.tracks.items[i].album.name + "," +
                                "Artist(s): " + data.tracks.items[i].artists[0].name + "," +
                                "Preview song here: " + data.tracks.items[i].href,
                                function(err) {
                                    if (err) {
                                        console.log(err);
                                    };
                                }); //fs.appendFile
                        }; //for tracks
                    }; //if else

                }); //spotify search & function

            }); //fs readFile
        }; //if choice

    }); //prompt then function