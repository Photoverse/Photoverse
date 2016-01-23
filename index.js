
var clarifai_access_token_request = "https://7XcRYTSUu-X4tt2-3ojUsaepRtfPpHgk5VtvQn0n:8KU5maZusTMVL3PL7ZbXw_VOuD42shAhJM-1RrAB@api.clarifai.com/v1/token/"
var clarifai_access_token_header = "grant_type=client_credentials"

var clarifai_access_token = null;

var express = require('express');
var request = require('request');
var Clarifai = require('clarifai');
var DomParser = require('dom-parser');
var parser = new DomParser();

var app = express();

app.use(function (req, res) {
  res.setHeader('Content-Type', 'text/plain')
  res.write('you posted:\n')
  res.end(JSON.stringify(req.body, null, 2))
})

clarifai_client = new Clarifai({
  id: "7XcRYTSUu-X4tt2-3ojUsaepRtfPpHgk5VtvQn0n",
  secret: "8KU5maZusTMVL3PL7ZbXw_VOuD42shAhJM-1RrAB"
});

clarifai_client.getAccessToken(function(err, accessToken) {
	if (!err) {
	  clarifai_access_token = accessToken;
	}
});

// Request address and return it's HTML
request('http://nhl.com/index.html', function(error, response, body) {
	if(!error && response.statusCode == 200) {
		console.log(body);
	} else {
		console.log(error);
	}
})

app.enable('trust proxy');

// Routing to the user
app.use(express.static(__dirname + "/public"));

var server = require('http').createServer(app);
var port = process.env.PORT || 3000;

server.listen(port, function() {

	// var url = "https://upload.wikimedia.org/wikipedia/commons/0/00/Wgretz_edit2.jpg"

    console.log("Server is listening on port " + port.toString());

 //    clarifai_client.tagFromUrls('image', url, function(err, results) {
	//   console.log(results);
	// }, null);
});

app.post('/findPhotoTags', function(req, res) {
    var image_url = req.body.image_url;
	 
   clarifai_client.tagFromUrls('image', image_url, function(err, results) {
      console.log(results);
      res.send(JSON.stringify(results));
   }, null);
});


