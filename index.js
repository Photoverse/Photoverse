
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

clarifai_client = new Clarifai({
  id: "7XcRYTSUu-X4tt2-3ojUsaepRtfPpHgk5VtvQn0n",
  secret: "8KU5maZusTMVL3PL7ZbXw_VOuD42shAhJM-1RrAB"
});

clarifai_client.getAccessToken(function(err, accessToken) {
	if (!err) {
	  clarifai_access_token = accessToken;
	} else {
    console.log("Error getting an access token.");
  }
});

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

    var mainTags = tags.slice(0,2);
  	
  	return {"iframes": urls, "tags": mainTags};
}

// Request address and return it's HTML
function getEightTracksHTML(tags, res) {
    
    var url = "http://8tracks.com/explore/";
    for (var i = 0; i < 2; i++) {
        if (i == 0) {
          url += tags[i].class;
        } else {
          url += "+"+tags[i].class;
        }
    }
    // url += "/popular"
    console.log(url);
    
    request(url, function(error, response, body) {
      if(!error && response.statusCode == 200) {
			   res.send(JSON.stringify(parseBody(body, tags)));
      } else {
			console.log(error);
      }
    });
}

// Use for every playlist returned from 
function iframeText (resultNumber, playlistId) {
	return {"iframe": iframeStart + playlistId + iframeEnd}; 
}

app.enable('trust proxy');

// Routing to the user
app.use(express.static(__dirname + "/public"));

var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

var allSongs = [];

server.listen(port, function() {

	// var url = "https://upload.wikimedia.org/wikipedia/commons/0/00/Wgretz_edit2.jpg"

    console.log("Server is listening on port " + port.toString());

 //    clarifai_client.tagFromUrls('image', url, function(err, results) {
	//   console.log(results);
	// }, null);
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
          console.log(err);
          console.log(results);

          var results = getEightTracksHTML(results.tags, res);
       }, null);
    } else {

        res.send(JSON.stringify({ result: "Failure" }));

        return;

        // var website_url = req.body.image_url;

        // console.log(website_url);

        // request(website_url, function(error, response, body) {
        //   if(!error && response.statusCode == 200) {
            
        //     var $ = cheerio.load(body);

        //     var resultingTags = [];

        //     var urls = [];
          
        //     $('img').each(function(i, elem) {
        //       var toPush = elem.attribs['src'];
        //       if (stringStartsWith(toPush, "//")) {
        //         toPush = toPush.substring(2);
        //       }
        //       if (!stringStartsWith(toPush, "http://")) {
        //         toPush = "http://"+toPush;
        //       }
        //       urls.push(toPush);
        //     });

        //     // console.log(urls);

        //     // console.log(urls.length);

        //     // totalLength = urls.length;
        //     totalLength = 5;
        //     var totalCount = 0;

        //     for (var i = 0; i < 5; i++) {
        //         // console.log(urls[i]);
        //         clarifai_client.tagFromUrls('image', urls[i], function(err, results) {
        //               console.log(err);
        //               console.log(results);
        //               for (var x = 0; x < results.tags.length; x++) {
        //                 if (resultingTags[results.tags[x].class] == null) {
        //                   resultingTags[results.tags[x].class] = 1;
        //                 } else {
        //                   resultingTags[results.tags[x].class] = resultingTags[results.tags[x].class] + 1;
        //                 }
        //               }
        //               totalCount += 1;
        //               if (totalCount == totalLength) {
        //                   haveAllFiles(resultingTags);
        //               }
        //            }, null);
        //     }



        //   res.send(JSON.stringify(parseBody(body)));
        //   } else {
        //   console.log(error);
        //   }
        // });

        





    }


});


