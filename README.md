Meme.js
=======

`meme.js` a port of my pyMeme to javascript, so that it will work in both a browser and in node.js

Server example
--------------
a server is located in `server.js` (Creative, huh?). You can set the address to listen on using command line options `--address` and `--port`

Required Libs
-------------

`server.js` nees argparse to function:

    npm install argparse

To use `meme.js` in node.js you need to have [node-canvas](https://github.com/learnboost/node-canvas "It's AWESOME") installed:

    npm install canvas

