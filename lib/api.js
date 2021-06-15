const config = require("../config.json");
const request = require('request');
const fs = require('fs');

module.exports = {
	checkForNewBlock: function(callback) {

		request('https://'+config.API_DOMAIN+'/pool/blocks', { json: true }, (err, res, body) => {
			if (err) { return console.log(err); }
	
			if ((typeof body[0].hash !== 'undefined') && (body[0].hash != config.LAST_BLOCK_HASH)) {
	//			console.log('New Block Found: '+body[0].hash);  // uncoment to debug
				
				config.LAST_BLOCK_HASH = body[0].hash;
				fs.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));

				callback(true, body[0]);				
			} else {
				callback(false);
			}
		});		
	},
	getAvgHashrate: function(xmraddr, callback) {
		request('https://'+config.API_DOMAIN+'/miner/'+xmraddr+'/chart/hashrate/allWorkers', { json: true }, (err, res, body) => {
			if (err) { return console.log(err); }

			var timeCheck = Date.now() - 86400000;
			var sum = 0;
			var avgCount = 0;

			body.global.forEach(element => {
				if (element.ts >= timeCheck) {
					sum = sum + element.hs;
					avgCount++;
				}
			});

			average = sum / avgCount;

			callback(average);

		});
	},
	getHashrate: function(xmraddr, callback) {
		request('https://'+config.API_DOMAIN+'/miner/'+xmraddr+'/stats/allWorkers', { json: true }, (err, res, body) => {
			if (err) { return console.log(err); }
			
			callback(body.global.hash);

		});
	}
}
