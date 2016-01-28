
var clarifai_access_token_request = "https://7XcRYTSUu-X4tt2-3ojUsaepRtfPpHgk5VtvQn0n:8KU5maZusTMVL3PL7ZbXw_VOuD42shAhJM-1RrAB@api.clarifai.com/v1/token/"
var clarifai_access_token_header = "grant_type=client_credentials"

var iframeStart = '<iframe src="http://8tracks.com/mixes/';
var iframeEnd = '/player_v3_universal" width="400" height="400" style="border: 0px none;"></iframe>';

var clarifai_access_token = null;

var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var stylus = require('stylus');
var Clarifai = require('clarifai');
var cheerio = require('cheerio');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(stylus.middleware({
 // Source directory
     src: __dirname + '/assets/stylesheets',
     // Destination directory
     dest: __dirname + '/public',
     // Compile function
     compile: function(str, path) {
       return stylus(str)
         .set('filename', path)
         .set('compress', true);
         }
     }));

var Constants = require('./constants.js');
var constant = new Constants();

clarifai_client = new Clarifai({
  id: constant.clarifai_access_token_id,
  secret: constant.clarifai_access_token_secret
});

clarifai_client.getAccessToken(function(err, accessToken) {
	if (!err) {
	  clarifai_access_token = accessToken;
	} else {
    console.log("Error getting an access token.");
  }
});

app.enable('trust proxy');

// Routing to the user
app.use(express.static(__dirname + "/public"));

var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

var allSongs = [];

server.listen(port, function() {
    console.log("Server is listening on port " + port.toString());
});

var totalLength = null;

function stringStartsWith (string, prefix) {
    return string.slice(0, prefix.length) == prefix;
}

function haveAllFiles(tags) {
    console.log(tags);
}

app.post('/findPhotoTags', function(req, res) {
    var image_url = req.body.image_url;

    if (image_url.indexOf("jpg") > -1 || image_url.indexOf("jpeg") > -1 || image_url.indexOf("png") > -1 ) {
       clarifai_client.tagFromUrls('image', image_url, function(err, results) {
          if (err) {
              console.log(err);
              console.log(err.results[0].result);
              res.send(JSON.stringify({ result: "Failure"}));
              return;
          } else {
            var results = getEightTracksHTML(results.tags, res);
          }
       }, null);
    } else {

        res.send(JSON.stringify({ result: "Failure" }));

        return;
    }


});

io.on('connection', function (socket) {

    function parseBody(body, tags) {
    
        var $ = cheerio.load(body);

        var playlists = [];
        var urls = [];
        
        $('.quick_add').each(function(i, elem) {
          playlists.push(elem.attribs['data-mix_id']);
        });

        for(var index in playlists) {
          urls[index] = iframeText(index, playlists[index]);
        }
        
        return {"iframes": urls, "tags": tags};
    }

    function chooseOne(results) {
        for (var i = results.length - 1; i >= 0; i--) {
            if (results[i].iframes.length < 12 || i == 0) {
                return results[i];
            }
        }
    }

    // Request address and return it's HTML
    function getEightTracksHTML(tags, request_count) {
        
        var requestResults = [];
        var tempCounter = 0;

        for (var i = 1; i < 6 && i < tags.length; i++) {
            var url = "http://8tracks.com/explore/";
            for (var x = 0; x < i; x++) {
                if (x == 0) {
                  url += tags[x].class;
                } else {
                  url += "+"+tags[x].class;
                }
            }

            request(url, function(error, response, body) {
              if(!error && response.statusCode == 200) {

                    var href = ""+response.request.uri.href;
                     if (href != "http://8tracks.com/explore/all") {
                        requestResults.push(parseBody(body,tags));
                     }
                     tempCounter += 1;
                     if (tempCounter >= 5) {
                        if (requestResults.length > 0) {

                            var results = chooseOne(requestResults);
                            socket.emit('FindPhotoTagResults', {results: results, requestCount: request_count});
                        } else {
                            socket.emit('FindPhotoTagResults', {results: "Failure", requestCount: request_count});
                        }
                     }
                     
              } else {
                socket.emit('FindPhotoTagResults', {results: "Failure", requestCount: request_count});
              }
            });
        }

    }

    // Use for every playlist returned from 
    function iframeText (resultNumber, playlistId) {
      return {"iframe": iframeStart + playlistId + iframeEnd}; 
    }


    socket.on('FindPhotoTags', function(data) {
        var image_url = data.url;
        var request_counter = data.requestCount;

        if (image_url.indexOf("jpg") > -1 || image_url.indexOf("jpeg") > -1 || image_url.indexOf("png") > -1 ) {
            clarifai_client.tagFromUrls('image', image_url, function(err, results) {
                if (err) {
                    socket.emit('ErrorFindingTags', {error:err});
                    return;
                } else {
                  getEightTracksHTML(results.tags, request_counter);
                }
            }, null);
        }
    });

    socket.on('disconnect', function() {
        // Clean up server if need be.
    });

});


