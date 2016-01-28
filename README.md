
![](https://www.dropbox.com/s/9atj9gzse8jjq0p/logo.png?dl=1)

Photoverse is a web application creating using Node.js along with the Clarifai API that allows users to get 8tracks playlist suggestions based on pictures they select. Enjoy!

## Motivation

We've always loved music and technology, and for that reason we've created **Photoverse**. As the saying goes, a picture is worth a thousand words, so why can't a picture be worth a thousand songs? Leveraging the photo tagging power of the [Clarifai API](http://www.clarifai.com/api), we were able to search through 8tracks' library and show the user the top playlists to fit the mood created by their photos.

## Installation

To install:
```
npm install
```
To configure:

Create a constants.js file in the home directory.
```
function Constants() {
	this.clarifai_access_token_id = "<YOUR_CLARIFAI_ACCESS_TOKEN_ID>";
	this.clarifai_access_token_secret = "<YOUR_CLARIFAI_ACCESS_TOKEN_SECRET>";
}

module.exports = Constants;
```
To run:
```
node index.js
```
## Contributors

 - Jalsemgeest
 - zackharley
 - ColinLMacLeod1
 - andreskebe

