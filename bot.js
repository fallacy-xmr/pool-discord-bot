console.log('Starting Bot..'); // uncomment to debug

const fs = require('fs');
const request = require('request');
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

console.log('Dependancies Loaded..'); // uncomment to debug

function checkAPI() {
	request('https://'+config.API_DOMAIN+'/pool/blocks', { json: true }, (err, res, body) => {
		if (err) { return console.log(err); }
	
		if (body[0].hash != config.LAST_BLOCK_HASH) {
			console.log('New Block Found: '+body[0].hash);  // uncoment to debug

			const channel = client.channels.cache.get(config.CHANNEL_ID);
			
			embed = new Discord.MessageEmbed()
				.setTitle('New Block Found!')
				.setURL('https://xmrchain.net/block/'+body[0].height)
				.setColor(0xff6600) //make it monero orange
//				.setDescription('Informative text to add at start')
				.addField('Hash', body[0].hash)
				.addField('Diff', body[0].diff)
				.addField('Height', body[0].height)
				.addField('Value', body[0].value);
			
			channel.send(embed);

			config.LAST_BLOCK_HASH = body[0].hash;
			fs.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));
			
		}
		
	});
	
	setTimeout(checkAPI, 120000);
}

client.login(config.BOT_TOKEN);
console.log ('Logged In..'); // uncomment to debug

//client.on('debug', console.log); // uncomment to debug

client.on('ready', () => {
	console.log('Client Ready..'); // uncomment to debug
	checkAPI();
	console.log('Checking API..'); // uncomment to debug
});