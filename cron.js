/* Designed to be run at a set interval, i.e. via cron, and then exit */
const fs = require('fs');
const request = require('request');
const Discord = require("discord.js");
const config = require("./config.json");

async function sendMessage(newBlock) {
	const client = new Discord.Client();

	client.login(config.BOT_TOKEN);

	client.on('ready', async() => {
		console.log(`Logged in as ${client.user.tag}!`); // uncomment to debug
		const channel = client.channels.cache.get(config.CHANNEL_ID);
		
		embed = new Discord.MessageEmbed()
			.setTitle('New Block Found')
			.setURL('https://xmrchain.net/block/'+newBlock.height)
			.setColor(0xff6600) //make it monero orange
			.addField('Hash', newBlock.hash)
//			.setDescription('Informative text to add at start')
			.addField('Diff', newBlock.diff)
			.addField('Height', newBlock.height)
			.addField('Value', newBlock.value);

		await channel.send(embed).then(console.log('Announcement Sent')).catch(console.error);
		
		client.destroy();

	});
	
	client.on('debug', console.log); // uncomment to debug
	
}

request('https://'+config.API_DOMAIN+'/pool/blocks', { json: true }, (err, res, body) => {
	if (err) { return console.log(err); }

	if (body[0].hash != config.LAST_BLOCK_HASH) {
		console.log('New Block Found: '+body[0].hash);  // uncoment to debug

		config.LAST_BLOCK_HASH = body[0].hash;
		fs.writeFileSync('./config.json', JSON.stringify(config, null, '\t'));
		
		sendMessage(body[0])
	} else {
		console.log('No New Block');
	}
	
});
