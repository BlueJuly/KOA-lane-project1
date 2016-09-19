var agent = require('supertest').agent
var app = require('./app.js');
var assert = require('assert');
app.proxy = true;

app.use(function* (next) {
	this.body = {
		lat: this.lat,
		lon: this.lon,
    weatherInfo : this.weatherInfo
	}
	yield next;
});

var server = agent(app.callback());

    describe('GET /', function () {
        it('should set location info (lat and lon) and return weather Info', function(done) {
           server.get('/')
           .expect(200)
           .set('X-Forwarded-For', '99.236.55.53')
           .expect('Content-Type', /json/)
           .end(function (err, res) {
           	  assert.equal(res.body.lat, 43.4646);
              assert.equal(res.body.lon, -80.4467);
              assert.notEqual(res.body.weatherInfo.weather, null);
		      done();
		   });          
        });
    });

    describe('GET /', function () {
        it('should set location info (lat and lon) and return weather Info', function(done) {
           server.get('/')
           .expect(200)
           .set('X-Forwarded-For', '97.234.54.33')
           .expect('Content-Type', /json/)
           .end(function (err, res) {
              assert.equal(res.body.lat, 40.7357);
              assert.equal(res.body.lon, -74.1724);
              assert.notEqual(res.body.weatherInfo.weather, null);
          done();
       });          
        });
    });

    describe('GET /', function () {
        it('should get error 404', function(done) {
           server.get('/')
           .expect(404)
           .set('X-Forwarded-For', 'aa.bb.cccccc.dddd')
           .expect('Content-Type', /json/)
           .end(function (err, res) {
             assert.equal(res.body.weatherInfo.cod, '404');
          done();
       });          
        });
    });

