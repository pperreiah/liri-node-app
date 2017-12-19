//liri.js

//Require package request.  install with:  npm install request

var request = require('request');
//  request('http://www.google.com', function(error, response, body) {
//      console.log('error:', error); // Print the error if one occurred
//      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//      console.log('body:', body); // Print the HTML for the Google homepage.
// });

// Load the NPM Package inquirer
var inquirer = require("inquirer");


var Twitter = require('twitter');
//Get twitter keys from keys.js
var keys = require("./keys.js");
var params = {screen_name: 'plptweeter'};

//Require Spotify   install with:  npm install --save node-spotify-api
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
    id: "34e579868bff437fb6386e72cfb2e4e7",
    secret: "379ff493f0864ae29c8cd438f43cd0b5"
});

const imdb = require('imdb-search');
var Omdb = require('omdb');
const OmdbApi = require('omdb-api-pt')
 
// Create a new instance of the module.
const omdb = new OmdbApi({
  apiKey: "97578add", 
  baseUrl: "https://omdbapi.com/"
})

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
				  		for (i=0; i<tweets.length; i++) {
				  			console.log(tweets[i].text + "  " + tweets[i].created_at);
				  		}  //for
				  	} else {
				  		console.log("Here are all of your last 20 tweets:")
				  		for (i=0; i<20; i++) {
				  			console.log(tweets[i].text + "  " + tweets[i].created_at);
				  		}  //for				  		
				  	};  //if-else tweets.length

				  } else {
				  	console.log(error)
				  };

				});   //client.get function    

            } else if (inquirerResponse.userActions === "spotify-this-song") {

                inquirer
                    .prompt([{
                        type: "input",
                        name: "songName",
                        message: "Please enter a song title?"
                    }])
                    .then(function(inquirerResponse) {

                            // spotify.search( { type: 'track', query: inquirerResponse.songName }, function(err, data) {          
                            //     if (err) {
                            //         return console.log('Error occurred: ' + err);
                            // 	}else {
                            // 		// console.log(data)
                            // 		for(i=0; i<5; i++) {
		                          //   	var artists = data[i].artists;
		                          //   	var songName = data[i].name;
		                          //   	var previewSongURL = data[i].preview_url;
		                          //   	var album = data[i].album;

		                          //       console.log("Here is the info on the song '" + songName + ":'");
		                          //       console.log("Artist(s): " + artists);
		                          //       console.log("Song name: " + songName);
		                          //       console.log("Preview song here: " + previewSongURL);
		                          //       console.log("From the album: " + album);
                            // 		} //for
                            //     }; //if
                            // });  //spotify search

                    //second then
                            spotify
                              .search({ type: 'track', query: inquirerResponse.songName })
                              .then(function(response) {
                              	results = JSON.stringify(response)
                                // console.log(response);
                                console.log(results[1].album)
                              })  //search
                              .catch(function(err) {
                                console.log(err);
                              });  //catch

                    }); 


                        } else if (inquirerResponse.userActions === "movie-this") {

                            // Prompt for user movie input
                            inquirer
                                .prompt([{
                                    type: "input",
                                    name: "movieName",
                                    message: "What movie are you interested in?"
                                }])
                                .then(function(inquirerResponse) {

                                    // Search for a Movie, result is an array of movies 
									imdb.search(inquirerResponse.movieName)
									  .then(result => {
									  	console.log(result)
									    for (let movie of result) {
									      // console.log(`${movie.id}: ${movie.title} - ${movie.year}`);
									      console.log(movie.title, movie.Year, movie.Rated)
									    }
									  })
									  .catch(err => {
									    console.log(err);
									  });



                                    // // Then run a request to the OMDB API with the movie specified
									// omdb.get({ title: inquirerResponse.name }, true, function(err, movie) {
									//     // if(err) {
									//     //     return console.error(err);
									//     // }
									 
									//     if(!movie) {
									//     	omdb.get({ title: "Mr Nobody" }, true, function(err, movie) {
									//         	console.log("Movie title: " + movie.title);
									// 		    console.log("Release year: " + formatYear(movie.year));
									// 		    console.log("IMdB Rating: " + movie.Rated);
									// 		    console.log("Rotten Tomatoes Rating: " + movie.tomatoRating);
									// 		    console.log("Country of production: " + formatList(movie.Country));
									// 		    console.log("Language: " + movie.Language);
									// 		    console.log("Plot: " + movie.Plot);
									// 		    console.log("Actors: " + formatList(movie.Actors));
									// 		});  //omdb.get Mr Nobody
									//     } else {

									//     console.log("Movie title: " + movie.title);
									//     console.log("Release year: " + formatYear(movie.year));
									//     console.log("IMdB Rating: " + movie.Rated);
									//     console.log("Rotten Tomatoes Rating: " + movie.tomatoRating);
									//     console.log("Country of production: " + formatList(movie.Country));
									//     console.log("Language: " + movie.Language);
									//     console.log("Plot: " + movie.Plot);
									//     console.log("Actors: " + formatList(movie.Actors));
									// 	} //else
									// });  //omdb.get

                                });  //then inquirer response

                        } else if (inquirerResponse.userActions === "do-what-it-says") {
                            console.log("do-what-it-says = " + inquirerResponse.userActions);
                        }; //if choice

    }); //then function