
var clarifai_access_token_request = "https://7XcRYTSUu-X4tt2-3ojUsaepRtfPpHgk5VtvQn0n:8KU5maZusTMVL3PL7ZbXw_VOuD42shAhJM-1RrAB@api.clarifai.com/v1/token/"
var clarifai_access_token_header = "grant_type=client_credentials"

var clarifai_access_token = null;

var express = require('express');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var Clarifai = require('clarifai');

clarifai_client = new Clarifai({
  id: "7XcRYTSUu-X4tt2-3ojUsaepRtfPpHgk5VtvQn0n",
  secret: "8KU5maZusTMVL3PL7ZbXw_VOuD42shAhJM-1RrAB"
});

clarifai_client.getAccessToken(function(err, accessToken) {
	if (!err) {
	  clarifai_access_token = accessToken;
	}
});

var app = express();

  // Middleware to compile `styl` files to `css`.
  // For example, `assets/stylesheets/main.styl` will be compiled to `public/stylesheets/main.css`
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

app.enable('trust proxy');

// Routing to the user
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

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
	
});


