var http = require('http');
var Canvas = require("canvas");
var fs = require("fs");
var meme = require("./meme");
var url = require("url");
var qs  = require("querystring");
var argparse = require("argparse");

var meme_map = {
"wonka": "templates/wonka.png",
"bad-luck-brian":"templates/bad-luck-brian.png",
"y-u-no":"templates/y-u-no.png",
"first-world-problems":"templates/first-world-problems.png",
"good-guy-greg":"templates/good-guy-greg.png",
"one-does-not-simply":"templates/one-does-not-simply.png",
"futurama-fry":"templates/futurama-fry.png",
"forever-alone": "templates/forever-alone.png",
"conspiracy-keanu":"templates/conspiracy-keanu.png",
"philosoraptor":"templates/philosoraptor.png"
}
function do_work(req, res, body){
  var request = url.parse(req.url, true);
  if(req.method==="POST") request.query = qs.parse(body);
  //req.on("data", function
  var can_generate = false;
  var options = {"meme": "wonka", "top":"", "bottom": ""};
  if(request.pathname.match(/^\/api\/$/)){
	var which_meme = request.query.meme || "wonka";
	var top  = request.query.top  || "";
	var bottom=request.query.bottom||"";
	options.meme = which_meme;
	options.top = top;
	options.bottom = bottom;
	can_generate = true;
  }else if(request.pathname.match(/^\/api\/json\/(.*)$/)){
	if(req.method == "POST"){
		json = body
	}else
		json = decodeURIComponent(request.pathname.match(/^\/api\/json\/(.*)$/)[1]);
	try {
		json = JSON.parse(json);
		for(name in json){
			if(json.hasOwnProperty(name)){
				options[name] = json[name];
			}
		}
	} catch (e){}
	can_generate = true;
  }else if(request.pathname.match(/^\/scripts\/meme.js$/)){
	res.writeHead(200, {'Content-Type': 'text/javascript'});
	res.end(fs.readFileSync(__dirname+"/meme.js"));
  }else{
	res.end("Oopsie Daisy! something went wrong!");
  }
  if(can_generate){
  	img = new Canvas.Image;
	var canvas, ctx;
	img.src = fs.readFileSync(__dirname +"/"+ meme_map[options.meme]);
	canvas = new Canvas(img.width, img.height);
	ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var top_lines = meme.make_text_fit_in_box(ctx, options.top, [canvas.width, canvas.height/3]);
	var bottom_lines = meme.make_text_fit_in_box(ctx, options.bottom, [canvas.width, canvas.height/3]);
	meme.draw_caption(ctx, top_lines[1], top_lines[0]);
	ctx.translate(0, canvas.height - bottom_lines[0] * bottom_lines[1].length);
	meme.draw_caption(ctx, bottom_lines[1], bottom_lines[0]);
	canvas.toBuffer(function(err, buf){
  		res.writeHead(200, {'Content-Type': 'image/png'});
		res.end(buf);
	});
  }
}
var server = http.createServer(function (req, res) {
  //var request = url.parse(req.url, true);
  if(req.method == "POST"){
	var body = "";
	req.on("data", function(data){
		body+=data;
	});
	req.on("end", function(){
		do_work(req, res,body);
	});
  }else if(req.method == "GET"){
	do_work(req, res);
  }else{
	res.end("ummmm... what?");
  }
});
var parser = new argparse.ArgumentParser({version: 0.5, addHelp: true, description: "Webserver for meme.js"});
parser.addArgument(["-p","--port"], {"help": "which port to listen on, DEFAULT=8889",
                                     "defaultValue":8889});
parser.addArgument(["-a","--address"], {"help": "which address to listen on, DEFAULT=127.0.0.1",
                                     "defaultValue":"127.0.0.1"});
args = parser.parseArgs();
server.listen(args.port, args.address);
