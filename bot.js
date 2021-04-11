const fs = require('fs');
const request = require('request');
const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const CronJob = require("cron").CronJob;

const checkAPI = new CronJob('* * * * *', function () {
	request('https://'+config.API_DOMAIN+'/pool/blocks', { json: true }, (err, res, body) => {
		if (err) { return console.log(err); }
	
		if ((typeof body[0].hash !== 'undefined') && (body[0].hash != config.LAST_BLOCK_HASH)) {
//			console.log('New Block Found: '+body[0].hash);  // uncoment to debug
			newBlock = body[0];
			
			const channel = client.channels.cache.get(config.CHANNEL_ID);
			
			embed = new Discord.MessageEmbed()
				.setTitle('New Block Found!')
				.setURL('https://xmrchain.net/block/'+newBlock.height)
				.setColor(0xff6600) //make it monero orange
//				.setDescription('Informative text to add at start')
				.addField('Hash', newBlock.hash)
				.addField('Diff', newBlock.diff)
				.addField('Height', newBlock.height)
				.addField('Value', newBlock.value);
			
			channel.send(embed);

			config.LAST_BLOCK_HASH = body[0].hash;
			fs.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));
			
		}
		
	});
	
	//setTimeout(checkAPI, config.CHECK_INTERVAL || 60000);
});


client.login(config.BOT_TOKEN);

client.on('ready', () => {
//	console.log(`Logged in as ${client.user.tag}!`); // uncomment to debug
	checkAPI.start();
});
