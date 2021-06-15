const affirmations = require("../affirmations.json");
const api = require('../lib/api.js');

/*  Formatting code by Salman A
	 from: https://stackoverflow.com/a/9462382 
	License: CC BY-SA 4.0  https://creativecommons.org/licenses/by-sa/4.0/
*/
function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + ' ' + item.symbol : "0";
}

module.exports = {
	name: 'hashrate',
	description: 'Get Your Hashrate',
	execute(message, args, db) {
		db.getUserAddress(message.author.id, function(error, xmraddr) {
			if (error) {
				message.channel.send(message.author.toString()+' Sorry! There was an error getting your hashrate.');
			} else {
				api.getHashrate(xmraddr, function(hashrate) {
					msg = message.author.toString()+' is crunching '+
					nFormatter(hashrate, 2)+'H/s. '+
					affirmations[Math.floor(Math.random()*affirmations.length)]+'!';
					message.channel.send(msg);
				});
			}
		});
	}
};
