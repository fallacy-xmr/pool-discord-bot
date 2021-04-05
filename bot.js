const fs = require('fs');
const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

function checkAPI() {
	request('https://'+config.API_DOMAIN+'/pool/blocks', { json: true }, (err, res, body) => {
		if (err) { return console.log(err); }

		if (body[0].hash != config.LAST_BLOCK_HASH) {
//			console.log('New Block Found: '+body[0].hash);  // uncoment to debug

			const channel = client.channels.cache.get(config.CHANNEL_ID);
			// modify these lines to say whatever you want
			channel.send('New Block Found!');
			channel.send(JSON.stringify(body[0]));

			config.LAST_BLOCK_HASH = body[0].hash;
			fs.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));

		}

	});

	setTimeout(checkAPI, 60000);
}


client.login(config.BOT_TOKEN);

client.on('ready', () => {
//	console.log(`Logged in as ${client.user.tag}!`); // uncomment to debug
	checkAPI();
});