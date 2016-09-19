var koa = require('koa');
var app = koa();
var router = require('koa-router')();
var fetch = require('node-fetch');
const GEOLOCATEAPI = "http://ip-api.com/json/";
const WEATERAPI = "http://api.openweathermap.org/data/2.5/weather?";

//error handling 
app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    this.status = err.status || 500;
    this.body = err.message;
    this.app.emit('error', err, this);
  }
});

//middleware to get geo-location and weather information
app.use(function *(next) {
	//get request IP
	let reqIP = this.ip;
	//define geoLocatate query
	let geoLocateQuery = GEOLOCATEAPI + reqIP;
	try{
		//request for geo-Locate API
		let locationQueryResult = yield fetch(geoLocateQuery);
		//store the geo-location information
		this.locationInfo = yield locationQueryResult.json();
		this.lat = this.locationInfo.lat;
		this.lon = this.locationInfo.lon;
		//request for weather information
		let weatherQuery = WEATERAPI + "lat=" + this.lat +"&lon=" + this.lon + "&appid=dc40330deec885d52e5080d474cddcbf";
		let weatherQueryResult = yield fetch(weatherQuery);
		//save the weather information
		this.weatherInfo = yield weatherQueryResult.json();
		//print weather information
		console.log(this.weatherInfo);

	} catch(err){

		console.log("NO LOCATION/WEATHER INFO GET!");
	}

	yield next;
})
router.get('/', function *(next) {
	this.body = "this is project 2 test.";
	yield next;
});

 app.use(router.routes());
// app.use(router.allowedMethods());

 app.listen(3000);

module.exports = app;