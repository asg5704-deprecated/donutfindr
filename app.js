var yelp	   = require('yelp-fusion'),
	express	   = require('express'),
	request	   = require('request'),
	bodyParser = require('body-parser'),
	app = express();

var clientId = process.env.CLIENT_ID,
	clientSecret = process.env.CLIENT_SECRET;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var bs = [];

app.get("/", function(req, res) {
	res.render("search");
});


app.post("/results", function(req, res) {
	//POST oAuth token to use Yelp API
	let client;
	let findMe = req.body.locationName;
	
	yelp.accessToken(clientId, clientSecret).then(response => {
  		client = yelp.client(response.jsonBody.access_token);
		
  		client.search({
  			term: 'Donut',
  			location: findMe,
  			limit: 50,
  			offset: 5
  		}).then(response => {
  			bs = response.jsonBody.businesses;
  			res.redirect("/results");
  		});
	}).catch(e => {
  		console.log(e);
	});
});


app.get("/results", function(req, res) {
	res.render("results", {bs:bs});
});


app.listen(process.env.PORT, process.env.IP, function(){
	console.log("DonutFindr is running");
});